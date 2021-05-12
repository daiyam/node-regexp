export declare enum TokenType {
	ALTERNATE,
	ANY,
	BACK_REFERENCE,
	BACKSPACE,
	CAPTURE_GROUP,
	CARRIAGE_RETURN,
	CHARSET,
	CONTROL,
	DIGIT,
	ESCAPE,
	FORM_FEED,
	HEX,
	LINE_FEED,
	LITERAL,
	MATCH,
	MODIFIED_GROUP,
	MODIFIER,
	NAMED_BACK_REFERENCE,
	NAMED_GROUP,
	NEGATIVE_LOOKAHEAD,
	NEGATIVE_LOOKBEHIND,
	NON_CAPTURE_GROUP,
	NON_DIGIT,
	NON_UNICODE_PROPERTY,
	NON_WHITE_SPACE,
	NON_WORD,
	NON_WORD_BOUNDARY,
	NUL,
	OCTAL,
	POSITIVE_LOOKAHEAD,
	POSITIVE_LOOKBEHIND,
	QUANTIFIED,
	QUANTIFIER,
	RANGE,
	TAB,
	UNICODE,
	UNICODE_PROPERTY,
	UTF16,
	VERTICAL_TAB,
	WHITE_SPACE,
	WORD,
	WORD_BOUNDARY
}

export declare enum Flavor {
	ES2018
}

export declare interface Token {
	type: TokenType,
	body?: Token | Token[]
}

declare type Visitor = (token: Token) => void;
declare type Transformer = (token: Token, parent: Token | null, key: string | null, index: number | null) => void;

export declare const escape: (value: string) => string;
export declare const isRegExp: (value: any) => boolean;
export declare const parse: (value: string | RegExp) => Token;
export declare const stringify: (tokens?: Token | Token[] | RegExp) => string;
export declare const visit: (tokens?: Token | Token[], callback?: { [TokenType: string]: Visitor } | Visitor) => void;
export declare const transform: (tokens?: Token | Token[], callback?: { [TokenType: string]: Transformer } | Transformer) =>
void;
export declare const translate: (value: string | RegExp | Token | Token[], target: Flavor, toString?: boolean) => string | Token | Token[];
