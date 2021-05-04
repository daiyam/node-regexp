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
import { escape, parse, stringify, translate, visit, Token, TokenType, TranslationTarget } from '@daiyam/regexp'

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
    return new RegExp(translate(source, TranslationTarget.ES2018));
}
```

License
-------

Copyright &copy; 2021 Baptiste Augrain

Licensed under the [MIT license](http://www.opensource.org/licenses/mit-license.php).
