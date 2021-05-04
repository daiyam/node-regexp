const fs = require('fs')
const path = require('path')
const peg = require('pegjs')

const parser = peg.generate(fs.readFileSync(path.join(__dirname, '..', 'src', 'grammar.pegjs'), 'utf8'), {
    output: 'source',
    format: 'commonjs'
})

fs.writeFileSync(path.join(__dirname, '..', 'lib', 'parser.js'), parser, 'utf8')
