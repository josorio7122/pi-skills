import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const LIVE = Boolean(process.env['POSTHOG_TEST_LIVE'])

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

describe('create --dry-run', () => {
  it('exits 0', () => {
    const result = run(['create', '--dry-run'], { POSTHOG_PERSONAL_API_KEY: '' })
    assert.strictEqual(result.status, 0, `expected exit 0\n${result.stderr}`)
  })

  it('stdout is valid JSON', () => {
    const result = run(['create', '--dry-run'], { POSTHOG_PERSONAL_API_KEY: '' })
    assert.doesNotThrow(() => JSON.parse(result.stdout), `not valid JSON:\n${result.stdout}`)
  })

  it('output contains dashboard_url', () => {
    const result = run(['create', '--dry-run'], { POSTHOG_PERSONAL_API_KEY: '' })
    const parsed = JSON.parse(result.stdout) as { dashboard_url: unknown }
    assert.ok(parsed.dashboard_url, 'output must have dashboard_url')
  })

  it('output contains tiles array', () => {
    const result = run(['create', '--dry-run'], { POSTHOG_PERSONAL_API_KEY: '' })
    const parsed = JSON.parse(result.stdout) as { tiles: unknown }
    assert.ok(Array.isArray(parsed.tiles), 'output must have tiles array')
  })

  it('tiles array has exactly 8 entries', () => {
    const result = run(['create', '--dry-run'], { POSTHOG_PERSONAL_API_KEY: '' })
    const parsed = JSON.parse(result.stdout) as { tiles: unknown[] }
    assert.strictEqual(parsed.tiles.length, 8, `expected 8 tiles, got ${parsed.tiles.length}`)
  })

  it('each tile has name and insight_id', () => {
    const result = run(['create', '--dry-run'], { POSTHOG_PERSONAL_API_KEY: '' })
    const parsed = JSON.parse(result.stdout) as {
      tiles: Array<{ name: unknown; insight_id: unknown }>
    }
    for (const tile of parsed.tiles) {
      assert.ok(tile.name, `tile missing name: ${JSON.stringify(tile)}`)
      assert.ok(tile.insight_id !== undefined, `tile "${tile.name}" missing insight_id`)
    }
  })

  it('output contains dashboard_id', () => {
    const result = run(['create', '--dry-run'], { POSTHOG_PERSONAL_API_KEY: '' })
    const parsed = JSON.parse(result.stdout) as { dashboard_id: unknown }
    assert.ok(parsed.dashboard_id !== undefined, 'output must have dashboard_id')
  })
})

describe('create without token (live)', () => {
  it('exits 1 when no token set', () => {
    const result = run(['create'], { POSTHOG_PERSONAL_API_KEY: '' })
    assert.strictEqual(result.status, 1, `expected exit 1\n${result.stderr}`)
  })
})

describe('create live first run (POSTHOG_TEST_LIVE=1)', { skip: !LIVE }, () => {
  it('exits 0 with valid token', () => {
    const result = run(['create'])
    assert.strictEqual(result.status, 0, `expected exit 0\nstderr: ${result.stderr}`)
  })

  it('output dashboard_id is a positive integer', () => {
    const result = run(['create'])
    const parsed = JSON.parse(result.stdout) as { dashboard_id: unknown }
    assert.ok(
      Number.isInteger(parsed.dashboard_id) && (parsed.dashboard_id as number) > 0,
      `expected positive integer dashboard_id, got: ${parsed.dashboard_id}`,
    )
  })

  it('output dashboard_url contains project/39507/dashboard/', () => {
    const result = run(['create'])
    const parsed = JSON.parse(result.stdout) as { dashboard_url: string }
    assert.ok(
      parsed.dashboard_url.includes('project/39507/dashboard/'),
      `unexpected dashboard_url: ${parsed.dashboard_url}`,
    )
  })

  it('output tiles has exactly 8 entries', () => {
    const result = run(['create'])
    const parsed = JSON.parse(result.stdout) as { tiles: unknown[] }
    assert.strictEqual(parsed.tiles.length, 8, `expected 8 tiles, got ${parsed.tiles.length}`)
  })
})

describe('create live idempotency (POSTHOG_TEST_LIVE=1)', { skip: !LIVE }, () => {
  it('second run exits 0', () => {
    const result = run(['create'])
    assert.strictEqual(result.status, 0, `expected exit 0\nstderr: ${result.stderr}`)
  })

  it('second run: all 8 tiles have status existing', () => {
    const result = run(['create'])
    const parsed = JSON.parse(result.stdout) as { tiles: Array<{ status: string }> }
    const nonExisting = parsed.tiles.filter((t) => t.status !== 'existing')
    assert.strictEqual(
      nonExisting.length,
      0,
      `expected all tiles to be "existing" on second run, but got: ${JSON.stringify(nonExisting)}`,
    )
  })
})
