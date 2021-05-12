[@daiyam/regexp](https://github.com/daiyam/node-regexp)
======================================================================

[![MIT licensed](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)
[![NPM Version](https://img.shields.io/npm/v/@daiyam/regexp.svg?colorB=green)](https://www.npmjs.com/package/@daiyam/regexp)

With `@daiyam/regexp`, you can parse a regular expression to get an AST. Then you can visit, transform or/and translate the ast. When you have finished your edits, you can stringify the AST to get a string to create a `RegExp`.

Getting Started
---------------

With [node](http://nodejs.org) previously installed:

	npm install @daiyam/regexp

```typescript
import { escape, parse, stringify, translate, visit, Flavor, Token, TokenType } from '@daiyam/regexp'

function listCaptureGroups(regex: string): Token[] {
    const ast = parse(regex);

    const groups: Token[] = [];

    visit(ast.body, {
        [TokenType.CAPTURE_GROUP](token) {
            groups.push(token);
        }
    });

    return groups;
}

function toES2018(source: string): RegExp {
    return new RegExp(translate(source, Flavor.ES2018));
}
```

Syntax
------

The library is supporting ES2018 syntax and some elements of PCRE2 syntax.

| Characters / constructs                                                                                                      | Corresponding article                                                                                                                       |
| ---------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `\`, `.`, `\cX`, `\d`, `\D`, `\f`, `\n`, `\r`, `\s`, `\S`, `\t`, `\v`, `\w`, `\W`, `\0`, `\xhh`, `\uhhhh`, `\uhhhhh`, `[\b]` | [Character classes (MDN)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions/Character_Classes)              |
| `^`, `$`, `x(?=y)`, `x(?!y)`, `(?<=y)x`, `(?<!y)x`, `\b`, `\B`                                                               | [Assertions (MDN)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions/Assertions)                            |
| `(x)`, `(?:x)`, `(?<Name>x)`, `x|y`, `[xyz]`, `[^xyz]`, `\Number`                                                            | [Groups and ranges (MDN)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions/Groups_and_Ranges)              |
| `*`, `+`, `?`, `x{n}`, `x{n,}`, `x{n,m}`                                                                                     | [Quantifiers (MDN)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions/Quantifiers)                          |
| `\p{UnicodeProperty}`, `\P{UnicodeProperty}`                                                                                 | [Unicode property escapes (MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions/Unicode_Property_Escapes) |
| `(?imsxUJX-imsxUJX)`, `(?i:)`                                                                                                | [Option Setting (PCRE)](https://mariadb.com/kb/en/pcre/#option-setting)                                                                     |

API
---

### parse(value: string | RegExp) => Token

with `interface Token`, parse the `value` to generate an AST tree.

### stringify(tokens?: Token | Token[] | RegExp) => string

generate a string based on the given AST tokens.

### visit(tokens?: Token | Token[], callback?: { [TokenType: string]: Visitor } | Visitor) => void

with `type Visitor = (token: Token) => void`, call the `callback` when iterating the given AST tokens

### transform(tokens?: Token | Token[], callback?: { [TokenType: string]: Transformer } | Transformer) => void

with `type Transformer = (token: Token, parent: Token | null, key: string | null, index: number | null) => void`, call the `callback` when iterating the given AST tokens.
The `this` context of the `callback` with have the following functions:

- `this.remove() => void`: remove the current token
- `this.replace(token: string | Token | Token[], transform?: boolean) => void`: replace the current token with the given token(s). If `transform` is true, then the new token(s) are going to be transformed.
- `this.transform(tokens: Token | Token[], parent?: Token, key?: string) => void`: run the tranformation on the given token(s).

### translate(value: string | RegExp | Token | Token[], target: Flavor, toString?: boolean = true) => string | Token | Token[]

translate a regex for the `target` regexp language.

```typescript
function toES2018(source: string): RegExp {
    return new RegExp(translate(source, Flavor.ES2018));
}
```

| Supported Flavors |
| ----------------- |
| `ES2018`          |

### escape(value: string) => string

escape the RegExp special characters from the `value`.

### isRegExp(value: any) => boolean

determine if the `value` is a RexExp or not.

License
-------

Copyright &copy; 2021 Baptiste Augrain

Licensed under the [MIT license](http://www.opensource.org/licenses/mit-license.php).
