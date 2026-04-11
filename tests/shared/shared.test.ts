import { describe, expect, it } from 'vitest'
import { isRecord } from '../../scripts/lib/shared.js'
import { runInline } from '../helpers/run-script.js'

const SHARED = new URL('../../scripts/lib/shared.ts', import.meta.url).pathname

describe('isRecord', () => {
  it('returns false for arrays', () => {
    expect(isRecord([1, 2, 3])).toBe(false)
  })
  it('returns false for null', () => {
    expect(isRecord(null)).toBe(false)
  })
  it('returns true for plain objects', () => {
    expect(isRecord({ a: 1 })).toBe(true)
  })
  it('returns true for empty objects', () => {
    expect(isRecord({})).toBe(true)
  })
  it('returns false for strings', () => {
    expect(isRecord('hello')).toBe(false)
  })
  it('returns false for numbers', () => {
    expect(isRecord(42)).toBe(false)
  })
})

describe('parseArgs: options validation', () => {
  it('exits 1 when options JSON is an array', () => {
    const result = runInline(`
      process.argv = ['node', 'script', 'target', '[1,2,3]'];
      import { parseArgs } from '${SHARED}';
      parseArgs('file:///dummy.ts');
    `)
    expect(result.status).toBe(1)
    expect(result.stderr).toContain('not a valid JSON object')
  })

  it('exits 1 when options JSON is a primitive string', () => {
    const result = runInline(`
      process.argv = ['node', 'script', 'target', '"hello"'];
      import { parseArgs } from '${SHARED}';
      parseArgs('file:///dummy.ts');
    `)
    expect(result.status).toBe(1)
    expect(result.stderr).toContain('not a valid JSON object')
  })

  it('exits 1 when options JSON is a number', () => {
    const result = runInline(`
      process.argv = ['node', 'script', 'target', '42'];
      import { parseArgs } from '${SHARED}';
      parseArgs('file:///dummy.ts');
    `)
    expect(result.status).toBe(1)
    expect(result.stderr).toContain('not a valid JSON object')
  })

  it('accepts a valid JSON object', () => {
    const result = runInline(`
      process.argv = ['node', 'script', 'target', '{"key":"value"}'];
      import { parseArgs } from '${SHARED}';
      const { opts } = parseArgs('file:///dummy.ts');
      process.stdout.write(JSON.stringify(opts));
    `)
    expect(result.status).toBe(0)
    expect(result.stdout).toContain('"key":"value"')
  })
})
