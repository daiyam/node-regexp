function visit(tokens, callback) {
	if(typeof callback === 'function') {
		visitFunc(tokens, callback)
	}
	else if(callback) {
		visitMap(tokens, callback)
	}
}

function visitFunc(tokens, callback) {
	if(Array.isArray(tokens)) {
		for (const token of tokens) {
			callback(token)

			if (token.body) {
				visitFunc(token.body, callback)
			}
		}
	}
	else if(tokens) {
		callback(tokens)

		if (tokens.body) {
			visitFunc(tokens.body, callback)
		}
	}
}

function visitMap(tokens, callbackMap) {
	visitFunc(tokens, (token) => {
		if(callbackMap[token.type]) {
			callbackMap[token.type](token)
		}
	})
}

module.exports = {
	visit
}
