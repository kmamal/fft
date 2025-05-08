
const TABLE = new Array(256)

for (let i = 0; i < 256; ++i) {
	let value = i
	let reversed = i
	let shift = 7
	for (value >>>= 1; value; value >>>= 1) {
		reversed <<= 1
		reversed |= value & 1
		--shift
	}
	TABLE[i] = (reversed << shift) & 0xff
}

const reverseBits = (x) => 0
	| (TABLE[x & 0xff] << 24)
	| (TABLE[(x >>> 8) & 0xff] << 16)
	| (TABLE[(x >>> 16) & 0xff] << 8)
	| TABLE[(x >>> 24) & 0xff]

module.exports = { reverseBits }
