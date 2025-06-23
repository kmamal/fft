const { memoize } = require('@kmamal/util/function/memoize')
const { map } = require('@kmamal/util/array/map')

const TWO_PI = 2 * Math.PI

const map$$$ = map.$$$

const tmp = {}

const defineFor = memoize((Algebra) => {
	const {
		__info: { isPrimitive },
		fromNumber: _fromNumber,
		clone: _clone,
	} = Algebra

	const _ZERO = _fromNumber(0)

	const Complex = require('@kmamal/complex').defineFor(Algebra)
	const {
		fromParts,
		add,
		mul,
	} = Complex

	const reItself = (x) => x.re
	const add$$$ = add.$$$
	const mul$$$ = mul.$$$
	const fromRealItself = isPrimitive
		? (_re) => ({ re: _re, im: _ZERO })
		: (_re) => ({ re: _re, im: _clone(_ZERO) })

	const { expi } = require('./expi').defineFor(Algebra)
	const expiTo = expi.to

	const dft = (arr) => {
		const { length } = arr
		const res = new Array(length)
		const factor = -TWO_PI / length

		for (let i = 0; i < length; i++) {
			res[i] = fromParts(_ZERO, _ZERO)
			for (let j = 0; j < length; j++) {
				expiTo(tmp, (i * j) * factor)
				mul$$$(tmp, arr[j])
				add$$$(res[i], tmp)
			}
		}

		return res
	}

	const dftReal = (arr) => {
		map$$$(arr, fromRealItself)
		const res = dft(arr)
		map$$$(arr, reItself)
		return res
	}

	return {
		dft,
		dftReal,
	}
})

module.exports = { defineFor }
