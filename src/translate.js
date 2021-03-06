const { TokenType } = require('./type.js')
const { isRegExp } = require('./isRegExp.js')
const { parse } = require('./parse.js')
const { stringify } = require('./stringify.js')
const { transform } = require('./transform.js')

const Flavor = {
	ES2018: 'es2018'
}

const Translators = {
	[Flavor.ES2018]: translateES2018
}

function translate(value, target, toString = true) {
	const translator = Translators[target]
	if(!translator) {
		return value
	}

	let result

	if(Array.isArray(value)) {
		result = []

		for(const token of value) {
			result.push(translator(token))
		}
	}
	else if(isRegExp(value) || typeof value === 'string') {
		result = translator(parse(value))
	}
	else {
		result = translator(value)
	}

	if(toString) {
		return stringify(result)
	}
	else {
		return result
	}
}

function translateES2018(ast) {
	let caseless = false
	let inCharset = false
	let sets = null

	transform(ast, {
		[TokenType.CHARSET](token) {
			inCharset = true
			sets = {}

			this.transform(token.body, token, 'body')

			inCharset = false
		},
		[TokenType.LITERAL](token) {
			if(caseless) {
				let text = '';
				let upper, lower, upperLower

				for(const c of token.text.split('')) {
					upper = c.toUpperCase()
					lower = c.toLowerCase()

					if(upper === lower) {
						text += upper
					}
					else {
						upperLower = `${upper}${lower}`

						if(inCharset) {
							if(!sets[upperLower]) {
								sets[upperLower] = true

								text += upperLower
							}
						}
						else {
							text += `[${upperLower}]`
						}
					}
				}

				if(token.text !== text) {
					this.replace(text)
				}
			}
		},
		[TokenType.MODIFIED_GROUP](token) {
			if(token.modifiers.positive.includes('i')) {
				caseless = true
			}
			if(token.modifiers.negative.includes('i')) {
				caseless = false
			}

			this.replace({
				type: TokenType.NON_CAPTURE_GROUP,
				body: token.body
			}, true)
		},
		[TokenType.MODIFIER](token) {
			if(token.positive.includes('i')) {
				caseless = true
			}
			if(token.negative.includes('i')) {
				caseless = false
			}

			this.remove()
		},
		[TokenType.RANGE](token) {
			if(caseless) {
				let beginUpper, beginLower
				if(token.begin.type === TokenType.LITERAL) {
					beginUpper = token.begin.text.toUpperCase()
					beginLower = token.begin.text.toLowerCase()
				}

				let endUpper, endLower
				if(token.end.type === TokenType.LITERAL) {
					endUpper = token.end.text.toUpperCase()
					endLower = token.end.text.toLowerCase()
				}

				if(beginUpper && endUpper && beginUpper !== beginLower && (beginUpper.charCodeAt(0) - endUpper.charCodeAt(0)) === (beginLower.charCodeAt(0) - endLower.charCodeAt(0))) {
					const range = `${beginUpper}-${endUpper}${beginLower}-${endLower}`

					if(sets[range]) {
						this.remove()
					}
					else {
						sets[range] = true

						this.replace(range)
					}
				}
			}
		}
	})

	return ast
}

module.exports = {
	Flavor,
	translate
}
