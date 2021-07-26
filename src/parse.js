const { parse: peg$parse } = require('../lib/parser')

function parse(value) {
	if(typeof value === 'string') {
		return peg$parse(value)
	}
	else if(isRegExp(value)) {
		return peg$parse(value.toString())
	}
	else {
		throw new TypeError('The regexp to parse must be represented as a string.')
	}
}

module.exports = {
	parse
}
