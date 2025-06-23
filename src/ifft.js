const { memoize } = require('@kmamal/util/function/memoize')
const { map } = require('@kmamal/util/array/map')

const map$$$ = map.$$$

const defineFor = memoize((Algebra) => {
	const {
		fromNumber: _fromNumber,
	} = Algebra

	const _ONE = _fromNumber(1)

	const Complex = require('@kmamal/complex').defineFor(Algebra)
	const {
		conjugate,
		scale,
	} = Complex

	const re$$$ = (x) => x.re
	const conjugate$$$ = conjugate.$$$
	const scale$$$ = scale.$$$

	const { fft } = require('./fft').defineFor(Algebra)

	const fft$$$ = fft.$$$

	const ifft$$$ = (arr) => {
		const N = arr.length

		map$$$(arr, conjugate$$$)
		fft$$$(arr)
		map$$$(arr, conjugate$$$)

		const _scale = _fromNumber(_ONE / N)
		for (let i = 0; i < N; i++) {
			scale$$$(arr[i], _scale)
		}

		return arr
	}
	const ifft = (arr) => ifft$$$(Array.from(arr))
	ifft.$$$ = ifft$$$

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
