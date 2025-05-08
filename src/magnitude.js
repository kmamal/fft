const { memoize } = require('@kmamal/util/function/memoize')
const { map } = require('@kmamal/util/array/map')

const mapTo = map.to
const map$$$ = map.$$$

const defineFor = memoize((Algebra) => {
	const {
		__info: { isPrimitive },
	} = Algebra

	const Complex = require('@kmamal/complex').defineFor(Algebra)
	const {
		norm,
	} = Complex

	const normTo = norm.to
	const norm$$$ = (x) => normTo(x.re, x)

	const magnitude = (arr) => map(arr, norm)
	const magnitudeTo = (dst, arr) => mapTo(dst, arr, norm)
	const magnitude$$$ = isPrimitive
		? (arr) => map$$$(arr, norm)
		: (arr) => map$$$(arr, norm$$$)
	magnitude.to = magnitudeTo
	magnitude.$$$ = magnitude$$$

	return { magnitude }
})

module.exports = { defineFor }
