import { describe, it } from 'node:test'
import assert from 'node:assert/strict'

import { createClient } from '../../skills/posthog-skill/scripts/lib/posthog-client.js'
import { getFixture } from '../../skills/posthog-skill/scripts/lib/fixtures.js'

describe('dead exports: patchDashboard on client', () => {
  it('client object does not expose patchDashboard', () => {
    const client = createClient({
      host: 'http://localhost',
      projectId: 'test',
      token: 'test-token',
    })
    assert.ok(
      !('patchDashboard' in client),
      'patchDashboard must not be a property of the PostHogClient object',
    )
  })
})

describe('dead exports: fixture keys status and inspect-live', () => {
  it('getFixture("status") throws', () => {
    assert.throws(
      () => (getFixture as (key: string) => unknown)('status'),
      /No fixture for command: status/,
      'getFixture("status") must throw',
    )
  })

  it('getFixture("inspect-live") throws', () => {
    assert.throws(
      () => (getFixture as (key: string) => unknown)('inspect-live'),
      /No fixture for command: inspect-live/,
      'getFixture("inspect-live") must throw',
    )
  })
})
