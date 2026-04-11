import { spawnSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const SHARED = path.join(__dirname, '..', '..', 'scripts', 'lib', 'shared.ts')

function runInline(code: string) {
  const result = spawnSync('npx', ['tsx', '--eval', code], {
    encoding: 'utf8',
    env: { ...process.env },
  })
  return {
    status: result.status ?? -1,
    stdout: result.stdout ?? '',
    stderr: result.stderr ?? '',
  }
}

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
