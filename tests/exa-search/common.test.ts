import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { requireArg } from '../../skills/exa-search/scripts/lib/common.js'
import { filterOptions } from '../../skills/exa-search/scripts/lib/common.js'
import { buildContentsOptions } from '../../skills/exa-search/scripts/lib/common.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const COMMON = path.join(__dirname, '..', '..', 'skills', 'exa-search', 'scripts', 'lib', 'common.ts')

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

// ---------------------------------------------------------------------------
// requireArg
// ---------------------------------------------------------------------------

describe('requireArg: returns value when provided', () => {
  it('returns the string when value is present', () => {
    const result = requireArg('hello', 'test')
    assert.strictEqual(result, 'hello')
  })

  it('returns an empty-but-truthy string value', () => {
    const result = requireArg('x', 'name')
    assert.strictEqual(result, 'x')
  })
})

describe('requireArg: exits when value is undefined', () => {
  it('process exits with code 1 when value is undefined', () => {
    const result = runInline(
      `import { requireArg } from '${COMMON}'; requireArg(undefined, 'testarg');`,
    )
    assert.strictEqual(result.status, 1, `expected exit 1, got ${result.status}\n${result.stderr}`)
  })

  it('prints error message to stderr when value is undefined', () => {
    const result = runInline(
      `import { requireArg } from '${COMMON}'; requireArg(undefined, 'myarg');`,
    )
    assert.ok(result.stderr.includes('myarg'), `expected "myarg" in stderr:\n${result.stderr}`)
  })
})

// ---------------------------------------------------------------------------
// filterOptions
// ---------------------------------------------------------------------------

describe('filterOptions: picks specified keys', () => {
  it('returns only the keys listed in the keys array', () => {
    const opts = { a: 1, b: 2, c: 3 }
    const result = filterOptions(opts, ['a', 'c'])
    assert.deepStrictEqual(result, { a: 1, c: 3 })
  })

  it('does not include keys absent from the keys array', () => {
    const opts = { a: 1, b: 2 }
    const result = filterOptions(opts, ['a'])
    assert.ok(!('b' in result), 'result must not include key "b"')
  })
})

describe('filterOptions: skips undefined values', () => {
  it('omits keys whose value is undefined', () => {
    const opts: Record<string, unknown> = { a: 1, b: undefined }
    const result = filterOptions(opts, ['a', 'b'])
    assert.deepStrictEqual(result, { a: 1 })
    assert.ok(!('b' in result), '"b" with undefined value must be omitted')
  })

  it('keeps keys whose value is null or 0 (only undefined is skipped)', () => {
    const opts: Record<string, unknown> = { a: null, b: 0, c: false }
    const result = filterOptions(opts, ['a', 'b', 'c'])
    assert.ok('a' in result, '"a" with null value must be kept')
    assert.ok('b' in result, '"b" with 0 value must be kept')
    assert.ok('c' in result, '"c" with false value must be kept')
  })
})

describe('filterOptions: returns empty when no keys match', () => {
  it('returns {} when none of the specified keys exist in opts', () => {
    const opts = { x: 1, y: 2 }
    const result = filterOptions(opts, ['a', 'b'])
    assert.deepStrictEqual(result, {})
  })

  it('returns {} when opts is empty', () => {
    const result = filterOptions({}, ['a', 'b'])
    assert.deepStrictEqual(result, {})
  })
})

// ---------------------------------------------------------------------------
// buildContentsOptions
// ---------------------------------------------------------------------------

describe('buildContentsOptions: text: true', () => {
  it('sets text: true in output when opts.text is true', () => {
    const result = buildContentsOptions({ text: true })
    assert.deepStrictEqual(result, { text: true })
  })
})

describe('buildContentsOptions: highlights: true', () => {
  it('sets highlights: true in output when opts.highlights is true', () => {
    const result = buildContentsOptions({ highlights: true })
    assert.deepStrictEqual(result, { highlights: true })
  })
})

describe('buildContentsOptions: summary: true', () => {
  it('sets summary: true in output when opts.summary is true', () => {
    const result = buildContentsOptions({ summary: true })
    assert.deepStrictEqual(result, { summary: true })
  })
})

describe('buildContentsOptions: empty opts returns empty object', () => {
  it('returns {} when no relevant keys are present', () => {
    const result = buildContentsOptions({})
    assert.deepStrictEqual(result, {})
  })

  it('returns {} when opts only has irrelevant keys', () => {
    const result = buildContentsOptions({ numResults: 5, query: 'foo' })
    assert.deepStrictEqual(result, {})
  })
})

describe('buildContentsOptions: text as object with maxCharacters', () => {
  it('passes text object through when opts.text is an object', () => {
    const textObj = { maxCharacters: 500 }
    const result = buildContentsOptions({ text: textObj })
    assert.deepStrictEqual(result, { text: textObj })
  })
})

describe('buildContentsOptions: contents object merges into result', () => {
  it('merges opts.contents object fields into result', () => {
    const result = buildContentsOptions({ contents: { text: true, highlights: true } })
    assert.ok('text' in result, 'merged text from contents')
    assert.ok('highlights' in result, 'merged highlights from contents')
  })
})

// ---------------------------------------------------------------------------
// handleError
// ---------------------------------------------------------------------------

describe('handleError: exits with code 1', () => {
  it('process exits with code 1 when handleError is called', () => {
    const result = runInline(
      `import { handleError } from '${COMMON}'; handleError(new Error('boom'));`,
    )
    assert.strictEqual(result.status, 1, `expected exit 1, got ${result.status}\n${result.stderr}`)
  })

  it('prints error message to stderr', () => {
    const result = runInline(
      `import { handleError } from '${COMMON}'; handleError(new Error('test-error-message'));`,
    )
    assert.ok(
      result.stderr.includes('test-error-message'),
      `expected "test-error-message" in stderr:\n${result.stderr}`,
    )
  })
})

// ---------------------------------------------------------------------------
// requireApiKey
// ---------------------------------------------------------------------------

describe('requireApiKey: exits when EXA_API_KEY is missing', () => {
  it('process exits with code 1 when EXA_API_KEY is not set', () => {
    const result = runInline(`import { requireApiKey } from '${COMMON}'; requireApiKey();`, {
      EXA_API_KEY: undefined,
    })
    assert.strictEqual(result.status, 1, `expected exit 1, got ${result.status}\n${result.stderr}`)
  })

  it('prints error message to stderr when EXA_API_KEY is missing', () => {
    const result = runInline(`import { requireApiKey } from '${COMMON}'; requireApiKey();`, {
      EXA_API_KEY: undefined,
    })
    assert.ok(
      result.stderr.includes('EXA_API_KEY'),
      `expected "EXA_API_KEY" in stderr:\n${result.stderr}`,
    )
  })
})

describe('requireApiKey: succeeds when EXA_API_KEY is set', () => {
  it('process exits with code 0 when EXA_API_KEY is set', () => {
    const result = runInline(`import { requireApiKey } from '${COMMON}'; requireApiKey();`, {
      EXA_API_KEY: 'test-api-key-abc123',
    })
    assert.strictEqual(result.status, 0, `expected exit 0, got ${result.status}\n${result.stderr}`)
  })
})
