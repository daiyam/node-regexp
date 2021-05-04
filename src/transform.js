const { parse } = require('../lib/parser')

function transform(tokens, callback) {
	if(typeof callback === 'function') {
		transformFunc(tokens, null, null, callback)
	}
	else if(callback) {
		transformMap(tokens, callback)
	}
}

function transformFunc(tokens, parent, key, callback) {
	if(Array.isArray(tokens)) {
		let i = -1
		let notSkipped = true

		const that = {
			remove() {
				tokens.splice(i, 1)

				--i

				notSkipped = false
			},
			replace(token, transform) {
				if(typeof token === 'string') {
					token = parse(token).body
				}

				if(Array.isArray(token)) {
					tokens.splice(i, 1, ...token)
				}
				else {
					tokens.splice(i, 1, token)
				}

				if(transform) {
					--i
				}
				else if(Array.isArray(token)) {
					i += token.length - 1
				}

				notSkipped = false
			}
		}

		while(++i < tokens.length) {
			const token = tokens[i]

			callback.call(that, token, parent, key, i)

			if(notSkipped) {
				token.body && transformFunc(token.body, token, 'body', callback)
			}
			else {
				notSkipped = true
			}
		}
	}
	else {
		callback.call(null, tokens, parent, key, null)

		tokens.body && transformFunc(tokens.body, tokens, 'body', callback)
	}
}

function transformMap(tokens, callbackMap) {
	transform(tokens, function(token, parent, key, index) {
		if(callbackMap[token.type]) {
			callbackMap[token.type].call(this, token, parent, key, index)
		}
	})
}

module.exports = {
	transform
}
