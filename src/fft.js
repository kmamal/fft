const { memoize } = require('@kmamal/util/function/memoize')
const { map } = require('@kmamal/util/array/map')
const { reverseBits } = require('./reverse-bits')

const TWO_PI = 2 * Math.PI

const map$$$ = map.$$$

const tmp1 = {}
const tmp2 = {}

const defineFor = memoize((Algebra) => {
	const {
		__info: { isPrimitive },
		fromNumber: _fromNumber,
		clone: _clone,
	} = Algebra

	const _ZERO = _fromNumber(0)

	const Complex = require('@kmamal/complex').defineFor(Algebra)
	const {
		add,
		sub,
		mul,
	} = Complex

	const fromReal$$$ = isPrimitive
		? (_re) => ({ re: _re, im: _ZERO })
		: (_re) => ({ re: _re, im: _clone(_ZERO) })
	const add$$$ = add.$$$
	const subTo = sub.to
	const mulTo = mul.to

	const { expi } = require('./expi').defineFor(Algebra)
	const expiTo = expi.to

	const fft = (arr) => {
		const { length } = arr
		const res = new Array(length)
		const shift = 32 - Math.log2(length)
		const factor = -TWO_PI / length

		for (let i = 0; i < length; i++) {
			const j = reverseBits(i) >>> shift
			res[j] = arr[i]
		}

		for (let step = 2; step <= length; step *= 2) {
			for (let i = 0; i < step / 2; i++) {
				expiTo(tmp1, factor * i)
				for (let j = 0; j < length / step; j++) {
					mulTo(tmp2, tmp1, res[j * step + i + step / 2])
					subTo(res[j * step + i + step / 2], res[j * step + i], tmp2)
					add$$$(res[j * step + i], tmp2)
				}
			}
		}

		return res
	}

	const fftReal = (arr) => {
		map$$$(arr, fromReal$$$)
		return fft(arr)
	}

	return {
		fft,
		fftReal,
	}
})

module.exports = { defineFor }
