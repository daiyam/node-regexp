const { expect } = require('chai')
const fs = require('fs')
const klaw = require('klaw-sync')
const path = require('path')
const YAML = require('yaml')

const { translate } = require('../src')

describe('translate', () => {
	function prepare(file) {
		const name = path.basename(file).slice(0, -4)

		it(name, () => {
			const { source, target, result } = YAML.parse(fs.readFileSync(file, 'utf8'))

			const data = translate(source, target)

			expect(data).to.eql(result)
		})
	}

	const files = klaw(path.join(__dirname, 'fixtures', 'translate'), {
		nodir: true,
		traverseAll: true,
		filter: (item) => item.path.slice(-4) === '.yml'
	})

	for(const file of files) {
		prepare(file.path)
	}
})
