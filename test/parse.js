const { expect } = require('chai')
const fs = require('fs')
const klaw = require('klaw-sync')
const path = require('path')
const YAML = require('yaml')

const { parse } = require('../src')

describe('parse', () => {
	function prepare(file) {
		const name = path.basename(file).slice(0, -4)

		it(name, () => {
			const { regexp, ast } = YAML.parse(fs.readFileSync(file, 'utf8'))

			const data = parse(regexp)

			try {
				expect(data).to.eql(ast)
			}
			catch(error) {
				console.log(YAML.stringify(data))

				throw error
			}
		})
	}

	const files = klaw(path.join(__dirname, 'fixtures', 'parse'), {
		nodir: true,
		traverseAll: true,
		filter: (item) => item.path.slice(-4) === '.yml'
	})

	for(const file of files) {
		prepare(file.path)
	}
})
