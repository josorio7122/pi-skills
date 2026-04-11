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

import { createAuthenticatedClient, executeAndPrint, parseArgs } from './lib/common.js'

const { target: id, opts } = parseArgs(import.meta.url)

const client = createAuthenticatedClient()

const limit = typeof opts.limit === 'number' ? opts.limit : 10

await executeAndPrint(() => client.getFeatureFlagActivity({ id, limit }))
