#!/usr/bin/env tsx
/**
 * PostHog flags toggle — enable or disable a feature flag.
 *
 * Usage:
 *   tsx scripts/flags-toggle.ts <id>
 *   tsx scripts/flags-toggle.ts --help
 *
 * Environment:
 *   POSTHOG_PROJECT_ID       — required
 *   POSTHOG_PERSONAL_API_KEY — required
 *   POSTHOG_HOST             — optional
 *
 * Examples:
 *   tsx scripts/flags-toggle.ts 101
 */

import { createAuthenticatedClient, executeAndPrint, parseArgs } from './lib/common.js'

const { target: id } = parseArgs(import.meta.url)

const client = createAuthenticatedClient()

await executeAndPrint(async () => {
  const current = await client.getFeatureFlag(id)
  const updated = await client.patchFeatureFlag({ id, body: { active: !current.active } })
  return {
    id: current.id,
    key: current.key,
    active_before: current.active,
    active_after: updated.active,
  }
})
