const { parse: _parse } = require('../lib/parser')

function parse(value) {
	if(typeof value === 'string') {
		return _parse(value)
	}
	else if(isRegExp(value)) {
		return _parse(value.toString())
	}
	else {
		throw new TypeError('The regexp to parse must be represented as a string.')
	}
}

module.exports = {
	parse
}
