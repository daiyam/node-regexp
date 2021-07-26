{
	const { TokenType } = require('../src/type.js')
}

regexp		= patternMod / pattern

pattern		= match:match alternate:("|" pattern)? {
	if(alternate) {
		const body = alternate[1].type === TokenType.ALTERNATE ? [match, ...alternate[1].body] : [match, alternate[1]]

		return { type: TokenType.ALTERNATE, body: body }
	}
	else {
		return match
	}
}

patternMod	= "/" body:pattern "/" modifiers:modifierPositive? {
	if(modifiers) {
		return { type: TokenType.PATTERN, body: body, modifiers: modifiers }
	}
	else {
		return { type: TokenType.PATTERN, body: body }
	}
}

match		= modifier:("(" modifier ")")? begin:begin? (!quantifier) matches:(quantified / submatch)* end:end? {
	const body = []

	if(modifier) {
		body.push(modifier[1])
	}

	if(begin) {
		body.push(begin)
	}

	body.push(...matches.flat())

	if(end) {
		body.push(end)
	}

	return { type: TokenType.MATCH, body: body }
}
submatch	= subexp / charset / terminal

begin		= "^" { return { type: TokenType.BEGIN } }
end			= "$" { return { type: TokenType.END } }


modifier 		= "?" modifiers:modifierSpec { return { type: TokenType.MODIFIER, ...modifiers } }
modifierSpec	= (modifierPositiveNegative / modifierPositive / modifierNegative)
modifierPositiveNegative	= positive:[gimsuxyUJX]+ "-" negative:[gimsuxyUJX]+		{ return { positive: positive, negative: negative } }
modifierPositive			= positive:[gimsuxyUJX]+								{ return { positive: positive, negative: [] } }
modifierNegative			= "-" negative:[gimsuxyUJX]+							{ return { positive: [], negative: negative } }

quantified	= submatch:submatch quantifier:quantifier {
	if(submatch.type === TokenType.LITERAL && submatch.text.length > 1) {
		return [
			{ type: TokenType.LITERAL, text: submatch.text.substr(0, submatch.text.length - 1) },
			{ type: TokenType.QUANTIFIED, body: { type: TokenType.LITERAL, text: submatch.text.substr(-1) }, quantifier: quantifier }
		]
	}
	else {
		return { type: TokenType.QUANTIFIED, body: submatch, quantifier: quantifier }
	}
}

quantifier "Quantifier" = quantity:quantifierSpec notgreedy:greedyFlag? { quantity.greedy = !notgreedy; return quantity }

quantifierSpec			= quantifierSpecFull / quantifierSpecAtLeast / quantifierSpecExact / quantifierRequired / quantifierAny / quantifierOptional
quantifierSpecFull		= "{" min:integer "," max:integer "}"	{ return { type: TokenType.QUANTIFIER, min: min, max: max } }
quantifierSpecAtLeast	= "{" min:integer ",}"					{ return { type: TokenType.QUANTIFIER, min: min, max: Infinity } }
quantifierSpecExact 	= "{" value:integer "}"					{ return { type: TokenType.QUANTIFIER, min: value, max: value } }
quantifierRequired		= "+"									{ return { type: TokenType.QUANTIFIER, min: 1, max: Infinity } }
quantifierAny			= "*"									{ return { type: TokenType.QUANTIFIER, min: 0, max: Infinity } }
quantifierOptional		= "?"									{ return { type: TokenType.QUANTIFIER, min: 0, max: 1 } }
greedyFlag				= "?"


integer = num:([0-9]+) { return +num.join('') }


subexp 				= "(" body:(positiveLookbehind / negativeLookbehind / positiveLookahead / negativeLookahead / groupNamed / groupNoCapture / groupModifiers / modifier / groupCapture) ")" { return body }

groupCapture		= regexp:regexp					{ return { type: TokenType.CAPTURE_GROUP, body: regexp } }
groupNoCapture		= "?:" regexp:regexp			{ return { type: TokenType.NON_CAPTURE_GROUP, body: regexp } }
groupNamed			= "?<" name:[0-9a-zA-Z\_]+ ">" regexp:regexp	{ return { type: TokenType.NAMED_GROUP, name: name.join(''), body: regexp } }
positiveLookbehind	= "?<=" regexp:regexp			{ return { type: TokenType.POSITIVE_LOOKBEHIND, body: regexp } }
negativeLookbehind	= "?<!" regexp:regexp			{ return { type: TokenType.NEGATIVE_LOOKBEHIND, body: regexp } }
positiveLookahead	= "?=" regexp:regexp			{ return { type: TokenType.POSITIVE_LOOKAHEAD, body: regexp } }
negativeLookahead	= "?!" regexp:regexp			{ return { type: TokenType.NEGATIVE_LOOKAHEAD, body: regexp } }
groupModifiers		= "?" modifiers:modifierSpec ":" regexp:regexp		{ return { type: TokenType.MODIFIED_GROUP, modifiers: modifiers, body: regexp } }


charset "CharacterSet"			= "[" negated:"^"? body:(charsetRange / charsetTerminal)* "]"	{ return { type: TokenType.CHARSET, body: body, negated: !!negated} }
charsetRange "CharacterRange"	= begin:charsetTerminal "-" end:charsetTerminal					{ return { type: TokenType.RANGE, begin: begin, end: end } }
charsetTerminal "Character"		= charsetEscapedCharacter / charsetLiteral
charsetLiteral					= value:[^\\\]]													{ return { type: TokenType.LITERAL, text: value } }
charsetEscapedCharacter = backspaceCharacter / controlCharacter / digitCharacter / nonDigitCharacter / formFeedCharacter / lineFeedCharacter / carriageReturnCharacter / whiteSpaceCharacter / nonWhiteSpaceCharacter / tabCharacter / verticalTabCharacter / wordCharacter / nonWordCharacter / octalCharacter / hexCharacter / utf16Character / unicodeCharacter / nullCharacter / otherEscaped

terminal = anyCharacter / escapedCharacter / literal

anyCharacter = "." { return { type: TokenType.ANY } }

literal "Literal" = value:[^|\\/.\[\(\)\?\+\*\$\^]+ { return { type: TokenType.LITERAL, text: value.join('') } }

escapedCharacter = wordBoundaryCharacter / nonWordBoundaryCharacter  /controlCharacter / digitCharacter / nonDigitCharacter /formFeedCharacter / lineFeedCharacter / carriageReturnCharacter / whiteSpaceCharacter / nonWhiteSpaceCharacter / tabCharacter /verticalTabCharacter / wordCharacter / nonWordCharacter / backReference / namedBackReference / octalCharacter / hexCharacter / utf16Character / unicodeCharacter / unicodeProperty / nonUnicodeProperty / nullCharacter / otherEscaped

backReference				= "\\" code:[1-9]					{ return { type: TokenType.BACK_REFERENCE, code: code } }
backspaceCharacter			= "\\b"								{ return { type: TokenType.BACKSPACE } }
carriageReturnCharacter		= "\\r"								{ return { type: TokenType.CARRIAGE_RETURN } }
controlCharacter			= "\\c" code:.						{ return { type: TokenType.CONTROL, code: code } }
digitCharacter				= "\\d"								{ return { type: TokenType.DIGIT } }
nonDigitCharacter			= "\\D"								{ return { type: TokenType.NON_DIGIT } }
formFeedCharacter			= "\\f"								{ return { type: TokenType.FORM_FEED } }
hexCharacter				= "\\x" code:[0-9a-fA-F]+			{ return { type: TokenType.HEX, code: code.join('') } }
lineFeedCharacter			= "\\n"								{ return { type: TokenType.LINE_FEED } }
namedBackReference			= "\\k<" name:[0-9a-zA-Z\_]+ ">"	{ return { type: TokenType.NAMED_BACK_REFERENCE, name: name } }
nullCharacter				= "\\0"								{ return { type: TokenType.NUL } }
octalCharacter				= "\\0" code:[0-7]+					{ return { type: TokenType.OCTAL, code: code.join('') } }
tabCharacter				= "\\t"								{ return { type: TokenType.TAB } }
unicodeCharacter			= "\\u{" code:[0-9a-fA-F]+ "}" 		{ return { type: TokenType.UNICODE, code: code.join('') } }
unicodeProperty				= "\\p{" property:[0-9a-zA-Z\_=]+ "}"	{ return { type: TokenType.UNICODE_PROPERTY, property: property.join('') } }
nonUnicodeProperty			= "\\P{" property:[0-9a-zA-Z\_=]+ "}"	{ return { type: TokenType.NON_UNICODE_PROPERTY, property: property.join('') } }
utf16Character				= "\\u" code:[0-9a-fA-F]+	 		{ return { type: TokenType.UTF16, code: code.join('') } }
verticalTabCharacter		= "\\v"								{ return { type: TokenType.VERTICAL_TAB } }
whiteSpaceCharacter			= "\\s"								{ return { type: TokenType.WHITE_SPACE } }
nonWhiteSpaceCharacter		= "\\S"								{ return { type: TokenType.NON_WHITE_SPACE } }
wordBoundaryCharacter		= "\\b"								{ return { type: TokenType.WORD_BOUNDARY } }
nonWordBoundaryCharacter	= "\\B"								{ return { type: TokenType.NON_WORD_BOUNDARY } }
wordCharacter				= "\\w"								{ return { type: TokenType.WORD } }
nonWordCharacter			= "\\W"								{ return { type: TokenType.NON_WORD } }
otherEscaped				= "\\" code:.						{ return { type: TokenType.ESCAPE, code: code } }
