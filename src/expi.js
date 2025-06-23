const { memoize } = require('@kmamal/util/function/memoize')

// Euler's formula: e^(i*x) = cos(x) + i*sin(x)

const defineFor = memoize((Algebra) => {
	const {
		fromNumber: _fromNumber,
		sin: _sin,
		cos: _cos,
	} = Algebra

	const expi = (x) => {
		const _x = _fromNumber(x)
		return { re: _cos(_x), im: _sin(_x) }
	}

	const expiTo = (dst, x) => {
		const _x = _fromNumber(x)
		dst.re = _cos(_x)
		dst.im = _sin(_x)
		return dst
	}

	expi.to = expiTo

	return { expi }
})

module.exports = { defineFor }
