import { spawnSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import {
	buildContentsOptions,
	filterOptions,
	requireArg,
} from '../../skills/exa-search/scripts/lib/common.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const COMMON = path.join(
	__dirname,
	'..',
	'..',
	'skills',
	'exa-search',
	'scripts',
	'lib',
	'common.ts',
)

function runInline(
	code: string,
	env: Record<string, string | undefined> = {},
): { status: number; stdout: string; stderr: string } {
	const result = spawnSync('npx', ['tsx', '--eval', code], {
		encoding: 'utf8',
		env: { ...process.env, ...env },
	})
	return {
		status: result.status ?? -1,
		stdout: result.stdout ?? '',
		stderr: result.stderr ?? '',
	}
}

describe('requireArg', () => {
	it('returns value when provided', () => {
		expect(requireArg('hello', 'test')).toBe('hello')
	})

	it('exits with code 1 when value is undefined', () => {
		const result = runInline(
			`import { requireArg } from '${COMMON}'; requireArg(undefined, 'testarg');`,
		)
		expect(result.status).toBe(1)
	})

	it('prints error message to stderr when value is undefined', () => {
		const result = runInline(
			`import { requireArg } from '${COMMON}'; requireArg(undefined, 'myarg');`,
		)
		expect(result.stderr).toContain('myarg')
	})
})

describe('filterOptions', () => {
	it('returns only the keys listed in the keys array', () => {
		expect(filterOptions({ a: 1, b: 2, c: 3 }, ['a', 'c'])).toEqual({ a: 1, c: 3 })
	})

	it('omits keys whose value is undefined', () => {
		const result = filterOptions({ a: 1, b: undefined } as Record<string, unknown>, ['a', 'b'])
		expect(result).toEqual({ a: 1 })
		expect('b' in result).toBe(false)
	})

	it('keeps keys whose value is null or 0', () => {
		const result = filterOptions({ a: null, b: 0, c: false }, ['a', 'b', 'c'])
		expect('a' in result).toBe(true)
		expect('b' in result).toBe(true)
		expect('c' in result).toBe(true)
	})

	it('returns {} when no keys match', () => {
		expect(filterOptions({ x: 1 }, ['a', 'b'])).toEqual({})
	})
})

describe('buildContentsOptions', () => {
	it('sets text: true when opts.text is true', () => {
		expect(buildContentsOptions({ text: true })).toEqual({ text: true })
	})

	it('sets highlights: true when opts.highlights is true', () => {
		expect(buildContentsOptions({ highlights: true })).toEqual({ highlights: true })
	})

	it('sets summary: true when opts.summary is true', () => {
		expect(buildContentsOptions({ summary: true })).toEqual({ summary: true })
	})

	it('returns {} when no relevant keys are present', () => {
		expect(buildContentsOptions({})).toEqual({})
	})

	it('passes text object through when opts.text is an object', () => {
		const textObj = { maxCharacters: 500 }
		expect(buildContentsOptions({ text: textObj })).toEqual({ text: textObj })
	})

	it('merges opts.contents object fields into result', () => {
		const result = buildContentsOptions({ contents: { text: true, highlights: true } })
		expect('text' in result).toBe(true)
		expect('highlights' in result).toBe(true)
	})
})

describe('handleError', () => {
	it('exits with code 1', () => {
		const result = runInline(
			`import { handleError } from '${COMMON}'; handleError(new Error('boom'));`,
		)
		expect(result.status).toBe(1)
	})

	it('prints error message to stderr', () => {
		const result = runInline(
			`import { handleError } from '${COMMON}'; handleError(new Error('test-error-message'));`,
		)
		expect(result.stderr).toContain('test-error-message')
	})
})

describe('requireApiKey', () => {
	it('exits with code 1 when EXA_API_KEY is not set', () => {
		const result = runInline(`import { requireApiKey } from '${COMMON}'; requireApiKey();`, {
			EXA_API_KEY: undefined,
		})
		expect(result.status).toBe(1)
	})

	it('prints EXA_API_KEY in stderr when missing', () => {
		const result = runInline(`import { requireApiKey } from '${COMMON}'; requireApiKey();`, {
			EXA_API_KEY: undefined,
		})
		expect(result.stderr).toContain('EXA_API_KEY')
	})

	it('exits 0 when EXA_API_KEY is set', () => {
		const result = runInline(`import { requireApiKey } from '${COMMON}'; requireApiKey();`, {
			EXA_API_KEY: 'test-api-key-abc123',
		})
		expect(result.status).toBe(0)
	})
})
