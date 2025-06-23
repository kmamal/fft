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

	const { dft } = require('./dft').defineFor(Algebra)

	const dft$$$ = dft.$$$

	const idft$$$ = (arr) => {
		const N = arr.length

		map$$$(arr, conjugate$$$)
		dft$$$(arr)
		map$$$(arr, conjugate$$$)

		const _scale = _fromNumber(_ONE / N)
		for (let i = 0; i < N; i++) {
			scale$$$(arr[i], _scale)
		}

		return arr
	}
	const idft = (arr) => idft$$$(Array.from(arr))
	idft.$$$ = idft$$$

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
