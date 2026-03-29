#!/usr/bin/env tsx
/**
 * PostHog flags toggle — enable or disable a feature flag.
 *
 * Usage:
 *   tsx scripts/flags-toggle.ts <id> [options-json]
 *   tsx scripts/flags-toggle.ts --help
 *
 * Options JSON (all optional):
 *   {
 *     "dryRun": true
 *   }
 *
 * Environment:
 *   POSTHOG_PROJECT_ID       — required
 *   POSTHOG_PERSONAL_API_KEY — required
 *   POSTHOG_HOST             — optional
 *
 * Examples:
 *   tsx scripts/flags-toggle.ts 101
 *   tsx scripts/flags-toggle.ts 101 '{"dryRun":true}'
 */

import { parseArgs, resolveConfig, requireToken, executeAndPrint, out } from './lib/common.js'
import { createClient } from './lib/posthog-client.js'
import { getFixture } from './lib/fixtures.js'

const { target: id, opts } = parseArgs(import.meta.url)

if (opts.dryRun) {
  out(getFixture('flags-toggle'))
  process.exit(0)
}

const config = resolveConfig()
requireToken(config)

const client = createClient(config)

await executeAndPrint(async () => {
  const current = await client.getFeatureFlag(id)
  await client.patchFeatureFlag(id, { active: !current.active })
  return {
    id: current.id,
    key: current.key,
    active_before: current.active,
    active_after: !current.active,
  }
})
