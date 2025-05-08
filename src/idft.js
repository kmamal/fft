const { memoize } = require('@kmamal/util/function/memoize')
const { map } = require('@kmamal/util/array/map')

const TWO_PI = 2 * Math.PI

const map$$$ = map.$$$

const tmp = {}

const defineFor = memoize((Algebra) => {
	const {
		fromNumber: _fromNumber,
	} = Algebra

	const _ZERO = _fromNumber(0)
	const _ONE = _fromNumber(1)

	const Complex = require('@kmamal/complex').defineFor(Algebra)
	const {
		fromParts,
		add,
		mul,
		scale,
	} = Complex

	const re$$$ = (x) => x.re
	const add$$$ = add.$$$
	const mul$$$ = mul.$$$
	const scale$$$ = scale.$$$

	const { expi } = require('./expi').defineFor(Algebra)
	const expiTo = expi.to

	const idft = (arr) => {
		const { length } = arr
		const res = new Array(length)

		const factor = TWO_PI / length
		const _scale = _fromNumber(_ONE / length)
		for (let i = 0; i < length; i++) {
			res[i] = fromParts(_ZERO, _ZERO)
			for (let j = 0; j < length; j++) {
				expiTo(tmp, factor * i * j)
				mul$$$(tmp, arr[j])
				add$$$(res[i], tmp)
			}
			scale$$$(res[i], _scale)
		}

		return res
	}

	const idftReal = (arr) => {
		const res = idft(arr)
		map$$$(res, re$$$)
		return res
	}

	return {
		idft,
		idftReal,
	}
})

module.exports = { defineFor }
