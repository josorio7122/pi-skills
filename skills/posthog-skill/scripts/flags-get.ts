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

import { executeAndPrint, parseArgs, requireToken, resolveConfig } from './lib/common.js'
import { createClient } from './lib/posthog-client.js'

const { target: id } = parseArgs(import.meta.url)

const config = resolveConfig()
requireToken(config)

const client = createClient({ config })

await executeAndPrint(() => client.getFeatureFlag(id))
