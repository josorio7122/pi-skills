import { describe, it } from 'node:test'
import assert from 'node:assert/strict'

describe('helpers module: constants', () => {
  it('exports RUN constant as a string ending with run.ts', async () => {
    const mod = await import('./helpers.js')
    assert.strictEqual(typeof mod.RUN, 'string', 'RUN must be a string')
    assert.ok(mod.RUN.endsWith('run.ts'), `RUN must end with run.ts, got: ${mod.RUN}`)
  })


})

describe('helpers module: run()', () => {
  it('returns object with status (number), stdout (string), stderr (string)', async () => {
    const { run } = await import('./helpers.js')
    const result = run(['status'], { POSTHOG_PERSONAL_API_KEY: '' })
    assert.strictEqual(
      typeof result.status,
      'number',
      `status must be number, got: ${typeof result.status}`,
    )
    assert.strictEqual(
      typeof result.stdout,
      'string',
      `stdout must be string, got: ${typeof result.stdout}`,
    )
    assert.strictEqual(
      typeof result.stderr,
      'string',
      `stderr must be string, got: ${typeof result.stderr}`,
    )
  })

  it('passes env override — token absent produces NOT SET in stdout', async () => {
    const { run } = await import('./helpers.js')
    const result = run(['status'], { POSTHOG_PERSONAL_API_KEY: '' })
    assert.ok(
      result.stdout.includes('NOT SET'),
      `expected "NOT SET" in stdout when token is empty:\n${result.stdout}`,
    )
  })

  it('accepts optional timeout in third options argument', async () => {
    const { run } = await import('./helpers.js')
    const result = run(['status'], { POSTHOG_PERSONAL_API_KEY: '' }, { timeout: 10000 })
    assert.strictEqual(
      typeof result.status,
      'number',
      `run() with timeout option must still return a numeric status, got: ${typeof result.status}`,
    )
  })
})
