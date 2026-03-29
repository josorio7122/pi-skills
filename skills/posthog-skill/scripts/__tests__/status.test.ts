import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const TSX = path.join(__dirname, '..', '..', '..', '..', 'node_modules', '.bin', 'tsx')
const RUN = path.join(__dirname, '..', 'run.ts')

function run(
  args: string[] = [],
  env: Record<string, string> = {},
): { status: number | null; stdout: string; stderr: string } {
  return spawnSync(TSX, [RUN, ...args], {
    encoding: 'utf8',
    env: { ...process.env, ...env },
  })
}

describe('status command', () => {
  it('exits 0 with no token set', () => {
    const result = run(['status'], { POSTHOG_PERSONAL_API_KEY: '' })
    assert.strictEqual(result.status, 0, `expected exit 0, got ${result.status}\n${result.stderr}`)
  })

  it('stdout contains NOT SET when no token', () => {
    const result = run(['status'], { POSTHOG_PERSONAL_API_KEY: '' })
    assert.ok(result.stdout.includes('NOT SET'), `expected "NOT SET" in stdout:\n${result.stdout}`)
  })

  it('stdout contains masked token when token is set', () => {
    const result = run(['status'], { POSTHOG_PERSONAL_API_KEY: 'phx_supersecrettoken123' })
    assert.ok(
      result.stdout.includes('***'),
      `expected masked token "***" in stdout:\n${result.stdout}`,
    )
    assert.ok(
      !result.stdout.includes('supersecrettoken123'),
      'token value must not appear in plaintext',
    )
  })

  it('stdout is valid JSON', () => {
    const result = run(['status'], { POSTHOG_PERSONAL_API_KEY: '' })
    assert.doesNotThrow(
      () => JSON.parse(result.stdout),
      `stdout is not valid JSON:\n${result.stdout}`,
    )
  })

  it('includes project_id in output', () => {
    const result = run(['status'], { POSTHOG_PERSONAL_API_KEY: '', POSTHOG_PROJECT_ID: '39507' })
    const parsed = JSON.parse(result.stdout) as { project_id: unknown }
    assert.ok(parsed.project_id, 'output must include project_id')
  })
})
