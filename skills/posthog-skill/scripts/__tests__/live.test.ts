/**
 * Integration sequence — runs the full safe verification in order.
 * Only executes when POSTHOG_TEST_LIVE=1.
 */

import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const LIVE = Boolean(process.env['POSTHOG_TEST_LIVE'])

const TSX = path.join(__dirname, '..', '..', '..', '..', 'node_modules', '.bin', 'tsx')
const RUN = path.join(__dirname, '..', 'run.ts')

function run(args: string[] = []): { status: number | null; stdout: string; stderr: string } {
  return spawnSync(TSX, [RUN, ...args], {
    encoding: 'utf8',
    env: { ...process.env },
    timeout: 30000,
  })
}

describe('live integration sequence (POSTHOG_TEST_LIVE=1)', { skip: !LIVE }, () => {
  it('status exits 0 and token_present is true', () => {
    const result = run(['status'])
    assert.strictEqual(result.status, 0, `stderr: ${result.stderr}`)
    const parsed = JSON.parse(result.stdout) as { token_present: boolean }
    assert.strictEqual(parsed.token_present, true, 'token_present must be true')
  })

  it('inspect --live exits 0', () => {
    const result = run(['inspect', '--live'])
    assert.strictEqual(result.status, 0, `stderr: ${result.stderr}`)
  })

  it('compare exits 0', () => {
    const result = run(['compare'])
    assert.strictEqual(result.status, 0, `stderr: ${result.stderr}`)
  })

  it('create exits 0', () => {
    const result = run(['create'])
    assert.strictEqual(result.status, 0, `stderr: ${result.stderr}`)
  })

  it('create again exits 0 with all tiles existing (idempotency)', () => {
    const result = run(['create'])
    assert.strictEqual(result.status, 0, `stderr: ${result.stderr}`)
    const parsed = JSON.parse(result.stdout) as { tiles: Array<{ status: string }> }
    const nonExisting = parsed.tiles.filter((t) => t.status !== 'existing')
    assert.strictEqual(
      nonExisting.length,
      0,
      `expected all tiles "existing" on second run: ${JSON.stringify(nonExisting)}`,
    )
  })
})
