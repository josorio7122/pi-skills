import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import path from 'node:path'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import { LIVE, run } from './helpers.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

describe('compare --dry-run', () => {
  it('exits 0', () => {
    const result = run(['compare', '--dry-run'], { POSTHOG_PERSONAL_API_KEY: '' })
    assert.strictEqual(result.status, 0, `expected exit 0\n${result.stderr}`)
  })

  it('stdout is valid JSON', () => {
    const result = run(['compare', '--dry-run'], { POSTHOG_PERSONAL_API_KEY: '' })
    assert.doesNotThrow(() => JSON.parse(result.stdout), `not valid JSON:\n${result.stdout}`)
  })

  it('output contains query_kind field', () => {
    const result = run(['compare', '--dry-run'], { POSTHOG_PERSONAL_API_KEY: '' })
    const parsed = JSON.parse(result.stdout) as { query_kind: unknown }
    assert.ok(parsed.query_kind, 'output must have query_kind field')
  })

  it('output contains required summary fields', () => {
    const result = run(['compare', '--dry-run'], { POSTHOG_PERSONAL_API_KEY: '' })
    const parsed = JSON.parse(result.stdout) as Record<string, unknown>
    const required = ['name', 'query_kind', 'viz_type', 'date_range']
    for (const field of required) {
      assert.ok(field in parsed, `output must have field "${field}"`)
    }
  })
})

describe('compare without token (live)', () => {
  it('exits 1 when no token set', () => {
    const result = run(['compare'], { POSTHOG_PERSONAL_API_KEY: '' })
    assert.strictEqual(result.status, 1, `expected exit 1\n${result.stderr}`)
  })
})

const SKILL_DIR = path.join(__dirname, '../..')
const ACH_SUMMARY_PATH = path.join(SKILL_DIR, 'references/ach-reference-summary.json')

describe('compare live (POSTHOG_TEST_LIVE=1)', { skip: !LIVE }, () => {
  it('exits 0 with valid token', () => {
    const result = run(['compare'])
    assert.strictEqual(result.status, 0, `expected exit 0\nstderr: ${result.stderr}`)
  })

  it('output id equals dry-run-fixture-id', () => {
    const result = run(['compare'])
    const parsed = JSON.parse(result.stdout) as { id: string }
    assert.strictEqual(parsed.id, 'dry-run-fixture-id')
  })

  it('output has query_kind, name, viz_type, date_range fields', () => {
    const result = run(['compare'])
    const parsed = JSON.parse(result.stdout) as Record<string, unknown>
    for (const field of ['query_kind', 'name', 'viz_type', 'date_range']) {
      assert.ok(field in parsed, `output must have field "${field}"`)
    }
  })

  it('references/ach-reference-summary.json exists after compare runs', () => {
    run(['compare'])
    assert.ok(fs.existsSync(ACH_SUMMARY_PATH), `file not found: ${ACH_SUMMARY_PATH}`)
  })

  it('ach-reference-summary.json contains id dry-run-fixture-id', () => {
    run(['compare'])
    const content = JSON.parse(fs.readFileSync(ACH_SUMMARY_PATH, 'utf8')) as { id: string }
    assert.strictEqual(content.id, 'dry-run-fixture-id')
  })
})
