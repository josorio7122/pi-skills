#!/usr/bin/env tsx
/**
 * PostHog flags get — inspect one feature flag in detail.
 *
 * Usage:
 *   tsx scripts/flags-get.ts <id>
 *   tsx scripts/flags-get.ts --help
 *
 * Environment:
 *   POSTHOG_PROJECT_ID       — required
 *   POSTHOG_PERSONAL_API_KEY — required
 *   POSTHOG_HOST             — optional
 *
 * Examples:
 *   tsx scripts/flags-get.ts 101
 */

import { createAuthenticatedClient, executeAndPrint, parseArgs } from './lib/common.js'

const { target: id } = parseArgs(import.meta.url)

const client = createAuthenticatedClient()

await executeAndPrint(() => client.getFeatureFlag(id))
