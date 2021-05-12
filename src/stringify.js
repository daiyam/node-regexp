const { TokenType } = require('./type.js')
const { isRegExp } = require('./isRegExp.js')

function stringify(tokens) {
	if(Array.isArray(tokens)) {
		let result = ''

		for(const token of tokens) {
			result += stringify(token)
		}

		return result
	}
	else if(isRegExp(tokens)) {
		return tokens.toString()
	}
	else if(tokens) {
		return toString(tokens, '')
	}
	else {
		return ''
	}
}

function toString(value, result) {
	if(value.type === TokenType.ALTERNATE) { // {{{
		for(let i = 0, l = value.body.length; i < l; i++) {
			if(i !== 0) {
				result += '|'
			}

			result = toString(value.body[i], result)
		}
	} // }}}
	else if(value.type === TokenType.ANY) { // {{{
		result += '.'
	} // }}}
	else if(value.type === TokenType.BACK_REFERENCE) { // {{{
		result += `\\${value.code}`
	} // }}}
	else if(value.type === TokenType.BACKSPACE) { // {{{
		result += '\\b'
	} // }}}
	else if(value.type === TokenType.BEGIN) { // {{{
		result += '^'
	} // }}}
	else if(value.type === TokenType.CAPTURE_GROUP) { // {{{
		result += '('

		result = toString(value.body, result)

		result += ')'
	} // }}}
	else if(value.type === TokenType.CARRIAGE_RETURN) { // {{{
		result += '\\r'
	} // }}}
	else if(value.type === TokenType.CHARSET) { // {{{
		result += '['

		if(value.negated) {
			result += '^'
		}

		for(const val of value.body) {
			result = toString(val, result)
		}

		result += ']'
	} // }}}
	else if(value.type === TokenType.CONTROL) { // {{{
		result += `\\c${value.code}`
	} // }}}
	else if(value.type === TokenType.DIGIT) { // {{{
		result += `\\d`
	} // }}}
	else if(value.type === TokenType.END) { // {{{
		result += '$'
	} // }}}
	else if(value.type === TokenType.ESCAPE) { // {{{
		result += `\\${value.code}`
	} // }}}
	else if(value.type === TokenType.FORM_FEED) { // {{{
		result += '\\f'
	} // }}}
	else if(value.type === TokenType.HEX) { // {{{
		result += `\\x${value.code}`
	} // }}}
	else if(value.type === TokenType.LINE_FEED) { // {{{
		result += `\\n`
	} // }}}
	else if(value.type === TokenType.LITERAL) { // {{{
		result += value.text
	} // }}}
	else if(value.type === TokenType.MATCH) { // {{{
		for(const val of value.body) {
			result = toString(val, result)
		}
	} // }}}
	else if(value.type === TokenType.MODIFIED_GROUP) { // {{{
		result += '(?'

		result += value.modifiers.positive.join('')

		if(value.modifiers.negative.length) {
			result += `-${value.negative.join('')}`
		}

		result += ':'

		result = toString(value.body, result)

		result += ')'
	} // }}}
	else if(value.type === TokenType.MODIFIER) { // {{{
		result += '(?'

		result += value.positive.join('')

		if(value.negative.length) {
			result += `-${value.negative.join('')}`
		}

		result += ')'
	} // }}}
	else if(value.type === TokenType.NAMED_BACK_REFERENCE) { // {{{
		result += `\\k<${value.name}>`
	} // }}}
	else if(value.type === TokenType.NAMED_GROUP) { // {{{
		result += `(?<${value.name}>`

		result = toString(value.body, result)

		result += ')'
	} // }}}
	else if(value.type === TokenType.NEGATIVE_LOOKAHEAD) { // {{{
		result += '(?!'

		result = toString(value.body, result)

		result += ')'
	} // }}}
	else if(value.type === TokenType.NEGATIVE_LOOKBEHIND) { // {{{
		result += '(?<!'

		result = toString(value.body, result)

		result += ')'
	} // }}}
	else if(value.type === TokenType.NON_CAPTURE_GROUP) { // {{{
		result += '(?:'

		result = toString(value.body, result)

		result += ')'
	} // }}}
	else if(value.type === TokenType.NON_DIGIT) { // {{{
		result += '\\D'
	} // }}}
	else if(value.type === TokenType.NON_UNICODE_PROPERTY) { // {{{
		result += `\\P{${value.property}}`
	} // }}}
	else if(value.type === TokenType.NON_WHITE_SPACE) { // {{{
		result += '\\S'
	} // }}}
	else if(value.type === TokenType.NON_WORD) { // {{{
		result += '\\W'
	} // }}}
	else if(value.type === TokenType.NON_WORD_BOUNDARY) { // {{{
		result += '\\B'
	} // }}}
	else if(value.type === TokenType.NUL) { // {{{
		result += '\\0'
	} // }}}
	else if(value.type === TokenType.OCTAL) { // {{{
		result += `\\0${value.code}`
	} // }}}
	else if(value.type === TokenType.POSITIVE_LOOKAHEAD) { // {{{
		result += '(?='

		result = toString(value.body, result)

		result += ')'
	} // }}}
	else if(value.type === TokenType.POSITIVE_LOOKBEHIND) { // {{{
		result += '(?<='

		result = toString(value.body, result)

		result += ')'
	} // }}}
	else if(value.type === TokenType.QUANTIFIED) { // {{{
		result = toString(value.body, result)
		result = toString(value.quantifier, result)
	} // }}}
	else if(value.type === TokenType.QUANTIFIER) { // {{{
		if(value.max === Infinity) {
			if(value.min === 0) {
				result += '*'
			}
			else if(value.min === 1) {
				result += '+'
			}
			else {
				result += `{${value.min},}`
			}
		}
		else if(value.min === 0 && value.max === 1) {
			result += '?'
		}
		else if(value.min === value.max) {
			result += `{${value.min}}`
		}
		else {
			result += `{${value.min},${value.max}}`
		}
	} // }}}
	else if(value.type === TokenType.RANGE) { // {{{
		result = toString(value.begin, result)
		result += '-'
		result = toString(value.end, result)
	} // }}}
	else if(value.type === TokenType.TAB) { // {{{
		result += '\\t'
	} // }}}
	else if(value.type === TokenType.UNICODE) { // {{{
		result += `\\u{${value.code}}`
	} // }}}
	else if(value.type === TokenType.UNICODE_PROPERTY) { // {{{
		result += `\\p{${value.property}}`
	} // }}}
	else if(value.type === TokenType.UTF16) { // {{{
		result += `\\u${value.code}`
	} // }}}
	else if(value.type === TokenType.VERTICAL_TAB) { // {{{
		result += '\\v'
	} // }}}
	else if(value.type === TokenType.WHITE_SPACE) { // {{{
		result += '\\s'
	} // }}}
	else if(value.type === TokenType.WORD) { // {{{
		result += `\\w`
	} // }}}
	else if(value.type === TokenType.WORD_BOUNDARY) { // {{{
		result += `\\b`
	} // }}}

	return result
}

module.exports = {
	stringify
}
