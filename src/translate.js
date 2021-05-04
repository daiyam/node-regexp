const { TokenType } = require('./type.js')
const { parse } = require('../lib/parser')
const { stringify } = require('./stringify.js')
const { transform } = require('./transform.js')

const TranslationTarget = {
	ES2018: 'es2018'
}

function translate(value, target) {
	if(target === TranslationTarget.ES2018) {
		return stringify(translateES2018(parse(value)))
	}
	else {
		return value
	}
}

function translateES2018(ast) {
	let caseless = false

	transform(ast, {
		[TokenType.LITERAL](token) {
			if(caseless) {
				let text = '';
				for(const c of token.text.split('')) {
					text += `[${c.toUpperCase()}${c.toLowerCase()}]`
				}

				this.replace(text)
			}
		},
		[TokenType.MODIFIED_GROUP](token) {
			if(token.modifiers.positive.includes('i')) {
				caseless = true
			}
			if(token.modifiers.negative.includes('i')) {
				caseless = false
			}

			this.replace(token.body, true)
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
					this.replace(`${beginUpper}-${endUpper}${beginLower}-${endLower}`)
				}
			}
		}
	})

	return ast
}

module.exports = {
	TranslationTarget,
	translate
}
