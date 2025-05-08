const { memoize } = require('@kmamal/util/function/memoize')
const { map } = require('@kmamal/util/array/map')
const { reverseBits } = require('./reverse-bits')

const TWO_PI = 2 * Math.PI

const map$$$ = map.$$$

const tmp1 = {}
const tmp2 = {}

const defineFor = memoize((Algebra) => {
	const {
		fromNumber: _fromNumber,
	} = Algebra

	const _ONE = _fromNumber(1)

	const Complex = require('@kmamal/complex').defineFor(Algebra)
	const {
		add,
		sub,
		mul,
		scale,
	} = Complex

	const re$$$ = (x) => x.re
	const add$$$ = add.$$$
	const subTo = sub.to
	const mulTo = mul.to
	const scale$$$ = scale.$$$

	const { expi } = require('./expi')(Algebra)
	const expiTo = expi.to

	const ifft = (arr) => {
		const { length } = arr
		const res = new Array(length)

		const shift = 32 - Math.log2(length)
		for (let i = 0; i < length; i++) {
			const j = reverseBits(i) >>> shift
			res[j] = arr[i]
		}

		const factor = TWO_PI / length
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

		const _scale = _fromNumber(_ONE / length)
		for (let i = 0; i < length; i++) {
			scale$$$(res[i], _scale)
		}

		return res
	}

	const ifftReal = (arr) => {
		const res = ifft(arr)
		map$$$(res, re$$$)
		return res
	}

	return {
		ifft,
		ifftReal,
	}
})

module.exports = { defineFor }
