#!/usr/bin/env tsx
/**
 * PostHog flags update — update a feature flag's properties.
 *
 * Usage:
 *   tsx scripts/flags-update.ts <id> [options-json]
 *   tsx scripts/flags-update.ts --help
 *
 * Options JSON (all optional):
 *   {
 *     "name": "Updated Name",
 *     "active": false,
 *     "tags": ["release", "updated"]
 *   }
 *
 * Environment:
 *   POSTHOG_PROJECT_ID       — required
 *   POSTHOG_PERSONAL_API_KEY — required
 *   POSTHOG_HOST             — optional
 *
 * Examples:
 *   tsx scripts/flags-update.ts 101 '{"active":false}'
 *   tsx scripts/flags-update.ts 101 '{"name":"New Name","tags":["v2"]}'
 */

import { executeAndPrint, parseArgs, requireToken, resolveConfig } from './lib/common.js'
import { createClient } from './lib/posthog-client.js'

const { target: id, opts } = parseArgs(import.meta.url)

const config = resolveConfig()
requireToken(config)

const client = createClient({ config })

const body: Record<string, unknown> = {}
if (opts.name !== undefined) body.name = opts.name
if (opts.active !== undefined) body.active = opts.active
if (opts.tags !== undefined) body.tags = opts.tags

await executeAndPrint(() => client.patchFeatureFlag({ id, body }))
