import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { LIVE, run } from './helpers.js'

const BRANCH_EVENTS = [
  'form_page_reached',
  'soil_donation_selected',
  'travel_protection_selected',
  'fcf_amount_selected',
  'fcf_more_info_clicked',
  'payment_method_selected',
  'payment_mode_selected',
  'payment_completed',
  'signing_completed',
]

describe('inspect command (no --live)', () => {
  it('exits 0 without any env vars', () => {
    const result = run(['inspect'], { POSTHOG_PERSONAL_API_KEY: '' })
    assert.strictEqual(result.status, 0, `expected exit 0\n${result.stderr}`)
  })

  it('stdout is valid JSON', () => {
    const result = run(['inspect'], { POSTHOG_PERSONAL_API_KEY: '' })
    assert.doesNotThrow(() => JSON.parse(result.stdout), `not valid JSON:\n${result.stdout}`)
  })

  it('output contains all 9 branch event names', () => {
    const result = run(['inspect'], { POSTHOG_PERSONAL_API_KEY: '' })
    const text = result.stdout
    for (const event of BRANCH_EVENTS) {
      assert.ok(text.includes(event), `missing event "${event}" in inspect output`)
    }
  })

  it('output events array has length 9', () => {
    const result = run(['inspect'], { POSTHOG_PERSONAL_API_KEY: '' })
    const parsed = JSON.parse(result.stdout) as { events: unknown[] }
    assert.strictEqual(parsed.events.length, 9, 'expected 9 events in output')
  })
})

describe('inspect --dry-run', () => {
  it('exits 0', () => {
    const result = run(['inspect', '--dry-run'], { POSTHOG_PERSONAL_API_KEY: '' })
    assert.strictEqual(result.status, 0)
  })

  it('stdout is valid JSON', () => {
    const result = run(['inspect', '--dry-run'], { POSTHOG_PERSONAL_API_KEY: '' })
    assert.doesNotThrow(() => JSON.parse(result.stdout))
  })

  it('dry-run output has events array', () => {
    const result = run(['inspect', '--dry-run'], { POSTHOG_PERSONAL_API_KEY: '' })
    const parsed = JSON.parse(result.stdout) as { events: unknown }
    assert.ok(Array.isArray(parsed.events), 'expected events array')
  })
})

describe('inspect --live without token', () => {
  it('exits 1 when POSTHOG_PERSONAL_API_KEY is not set', () => {
    const result = run(['inspect', '--live'], { POSTHOG_PERSONAL_API_KEY: '' })
    assert.strictEqual(result.status, 1, `expected exit 1\n${result.stderr}`)
  })

  it('stderr mentions POSTHOG_PERSONAL_API_KEY', () => {
    const result = run(['inspect', '--live'], { POSTHOG_PERSONAL_API_KEY: '' })
    assert.ok(
      result.stderr.includes('POSTHOG_PERSONAL_API_KEY'),
      `expected stderr to mention POSTHOG_PERSONAL_API_KEY:\n${result.stderr}`,
    )
  })
})

const BRANCH_EVENTS_LIVE = [
  'form_page_reached',
  'soil_donation_selected',
  'travel_protection_selected',
  'fcf_amount_selected',
  'fcf_more_info_clicked',
  'payment_method_selected',
  'payment_mode_selected',
  'payment_completed',
  'signing_completed',
]

describe('inspect --live (POSTHOG_TEST_LIVE=1)', { skip: !LIVE }, () => {
  it('exits 0 with valid token', () => {
    const result = run(['inspect', '--live'])
    assert.strictEqual(result.status, 0, `expected exit 0\nstderr: ${result.stderr}`)
  })

  it('output source equals posthog-live', () => {
    const result = run(['inspect', '--live'])
    const parsed = JSON.parse(result.stdout) as { source: string }
    assert.strictEqual(parsed.source, 'posthog-live')
  })

  it('output events array has exactly 9 entries', () => {
    const result = run(['inspect', '--live'])
    const parsed = JSON.parse(result.stdout) as { events: unknown[] }
    assert.strictEqual(parsed.events.length, 9, `expected 9 events, got ${parsed.events.length}`)
  })

  it('each entry has event (string), count_30d (number >= 0), last_seen (string or null)', () => {
    const result = run(['inspect', '--live'])
    const parsed = JSON.parse(result.stdout) as {
      events: Array<{ event: unknown; count_30d: unknown; last_seen: unknown }>
    }
    for (const entry of parsed.events) {
      assert.strictEqual(
        typeof entry.event,
        'string',
        `event must be string: ${JSON.stringify(entry)}`,
      )
      assert.ok(
        typeof entry.count_30d === 'number' && (entry.count_30d as number) >= 0,
        `count_30d must be number >= 0: ${JSON.stringify(entry)}`,
      )
      assert.ok(
        entry.last_seen === null || typeof entry.last_seen === 'string',
        `last_seen must be string or null: ${JSON.stringify(entry)}`,
      )
    }
  })

  it('all 9 spec event names appear in output', () => {
    const result = run(['inspect', '--live'])
    const parsed = JSON.parse(result.stdout) as { events: Array<{ event: string }> }
    const outputNames = parsed.events.map((e) => e.event)
    for (const eventName of BRANCH_EVENTS_LIVE) {
      assert.ok(outputNames.includes(eventName), `missing event "${eventName}" in live output`)
    }
  })
})
