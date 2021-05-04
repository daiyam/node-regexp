const { TokenType } = require('./type.js')
const { escape } = require('./escape.js')
const { parse: _parse } = require('../lib/parser')
const { stringify: _stringify } = require('./stringify.js')
const { transform } = require('./transform.js')
const { TranslationTarget, translate } = require('./translate.js')
const { visit } = require('./visit.js')

function isRegExp(value) {
	return Object.prototype.toString.call(value) === '[object RegExp]'
}

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

function stringify(value) {
	if(isRegExp(value)) {
		return value.toString()
	}
	else {
		return _stringify(value)
	}
}

module.exports = {
	TokenType,
	TranslationTarget,
	escape,
	isRegExp,
	parse,
	stringify,
	translate,
	transform,
	visit
}
