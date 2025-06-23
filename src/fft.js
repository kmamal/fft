const { memoize } = require('@kmamal/util/function/memoize')
const { map } = require('@kmamal/util/array/map')
const { swap } = require('@kmamal/util/array/swap')
const { reverseBits } = require('./reverse-bits')

const TWO_PI = 2 * Math.PI

const map$$$ = map.$$$
const swap$$$ = swap.$$$

const tmp1 = {}
const tmp2 = {}
const tmp3 = {}

const defineFor = memoize((Algebra) => {
	const {
		__info: { isPrimitive },
		fromNumber: _fromNumber,
		clone: _clone,
	} = Algebra

	const _ZERO = _fromNumber(0)
	const _ONE = _fromNumber(1)

	const Complex = require('@kmamal/complex').defineFor(Algebra)
	const {
		copy,
		add,
		sub,
		mul,
		fromReal,
	} = Complex

	const reItself = (x) => x.re
	const add$$$ = add.$$$
	const subTo = sub.to
	const mulTo = mul.to
	const mul$$$ = mul.$$$
	const fromRealItself = isPrimitive
		? (_re) => ({ re: _re, im: _ZERO })
		: (_re) => ({ re: _re, im: _clone(_ZERO) })

	const ONE = fromReal(_ONE)

	const { expi } = require('./expi').defineFor(Algebra)
	const expiTo = expi.to

	const fft$$$ = (arr) => {
		const { length } = arr

		const shift = 32 - Math.log2(length)
		for (let i = 0; i < length; i++) {
			const j = reverseBits(i) >>> shift
			if (j > i) { swap$$$(arr, i, j) }
		}

		let halfStep = 1
		for (let step = 2; step <= length; step *= 2) {
			const factor = expiTo(tmp1, -TWO_PI / step)
			for (let i = 0; i < length; i += step) {
				const w = copy(tmp2, ONE)
				for (let j = 0; j < halfStep; j++) {
					const index1 = i + j
					const index2 = index1 + halfStep
					mulTo(tmp3, w, arr[index2])
					subTo(arr[index2], arr[index1], tmp3)
					add$$$(arr[index1], tmp3)
					mul$$$(w, factor)
				}
			}
			halfStep = step
		}

		return arr
	}
	const fft = (arr) => fft$$$(Array.from(arr))
	fft.$$$ = fft$$$

	const fftReal = (arr) => {
		map$$$(arr, fromRealItself)
		const res = fft(arr)
		map$$$(arr, reItself)
		return res
	}

	return {
		fft,
		fftReal,
	}
})

module.exports = { defineFor }
