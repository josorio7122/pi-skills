#!/usr/bin/env tsx
/**
 * PostHog flags activity — check who changed a feature flag.
 *
 * Usage:
 *   tsx scripts/flags-activity.ts <id> [options-json]
 *   tsx scripts/flags-activity.ts --help
 *
 * Options JSON (all optional):
 *   {
 *     "limit": 10
 *   }
 *
 * Environment:
 *   POSTHOG_PROJECT_ID       — required
 *   POSTHOG_PERSONAL_API_KEY — required
 *   POSTHOG_HOST             — optional
 *
 * Examples:
 *   tsx scripts/flags-activity.ts 101
 *   tsx scripts/flags-activity.ts 101 '{"limit":5}'
 */

import { parseArgs, resolveConfig, requireToken, executeAndPrint } from './lib/common.js'
import { createClient } from './lib/posthog-client.js'

const { target: id, opts } = parseArgs(import.meta.url)

const config = resolveConfig()
requireToken(config)

const client = createClient(config)

await executeAndPrint(() =>
  client.getFeatureFlagActivity(id, (opts.limit as number | undefined) ?? 10),
)
