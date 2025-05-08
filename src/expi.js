const { memoize } = require('@kmamal/util/function/memoize')

// Euler's formula: e^(i*x) = cos(x) + i*sin(x)

const defineFor = memoize((Algebra) => {
	const {
		fromNumber: _fromNumber,
		sin: _sin,
		cos: _cos,
	} = Algebra

	const Complex = require('@kmamal/complex').defineFor(Algebra)
	const {
		clone,
		copy,
		conjugate,
	} = Complex

	const _cache = new Map()

	const expi = (x) => {
		const cached = _cache.get(x)
		if (cached !== undefined) { return clone(cached) }

		const _x = _fromNumber(x)
		const res = { re: _cos(_x), im: _sin(_x) }

		_cache.set(x, res)
		_cache.set(-x, conjugate(res))
		return res
	}

	const expiTo = (dst, x) => {
		const cached = _cache.get(x)
		if (cached !== undefined) {
			copy(dst, cached)
			return dst
		}

		const _x = _fromNumber(x)
		dst.re = _cos(_x)
		dst.im = _sin(_x)

		_cache.set(x, clone(dst))
		_cache.set(-x, conjugate(dst))
		return dst
	}

	expi.to = expiTo

	return { expi }
})

module.exports = { defineFor }
