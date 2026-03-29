import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

import { createClient } from '../lib/posthog-client.js'
import { getFixture } from '../lib/fixtures.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

describe('dead exports: DashboardSpec interface', () => {
  it('dashboard-spec.ts does not export DashboardSpec interface', () => {
    const src = readFileSync(resolve(__dirname, '../lib/dashboard-spec.ts'), 'utf8')
    assert.ok(
      !src.includes('export interface DashboardSpec'),
      'DashboardSpec interface must not be exported from dashboard-spec.ts',
    )
  })
})

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
      'getFixture("status") must throw — "status" fixture key should be removed',
    )
  })

  it('getFixture("inspect-live") throws', () => {
    assert.throws(
      () => (getFixture as (key: string) => unknown)('inspect-live'),
      /No fixture for command: inspect-live/,
      'getFixture("inspect-live") must throw — "inspect-live" fixture key should be removed',
    )
  })
})
