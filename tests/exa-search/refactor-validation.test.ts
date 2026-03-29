import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const __dirname = dirname(fileURLToPath(import.meta.url))
const SCRIPTS = resolve(__dirname, '../../skills/exa-search/scripts')

describe('refactor: contents.ts uses common.ts helpers', () => {
	it('does not manually parse process.argv', () => {
		const src = readFileSync(resolve(SCRIPTS, 'contents.ts'), 'utf8')
		expect(src).not.toContain('process.argv.slice')
	})
})

describe('refactor: research.ts uses common.ts helpers', () => {
	it('does not contain raw console.log(JSON.stringify(', () => {
		const src = readFileSync(resolve(SCRIPTS, 'research.ts'), 'utf8')
		expect(src).not.toContain('console.log(JSON.stringify(')
	})

	it('does not manually parse process.argv.slice', () => {
		const src = readFileSync(resolve(SCRIPTS, 'research.ts'), 'utf8')
		expect(src).not.toContain('process.argv.slice')
	})
})
