const ESCAPE_REGEX = /[-|\\{}()[\]^$+*?.]/g

function escape(value) {
	return value.replace(ESCAPE_REGEX, '\\$&')
}

module.exports = {
	escape
}
