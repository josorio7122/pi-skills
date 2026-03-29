#!/usr/bin/env tsx
/**
 * PostHog flags create — create a new feature flag.
 *
 * Usage:
 *   tsx scripts/flags-create.ts <key> [options-json]
 *   tsx scripts/flags-create.ts --help
 *
 * Options JSON (all optional):
 *   {
 *     "name": "My Flag",
 *     "tags": ["release", "experiment"],
 *     "dryRun": true
 *   }
 *
 * Environment:
 *   POSTHOG_PROJECT_ID       — required
 *   POSTHOG_PERSONAL_API_KEY — required
 *   POSTHOG_HOST             — optional
 *
 * Examples:
 *   tsx scripts/flags-create.ts "my-new-flag"
 *   tsx scripts/flags-create.ts "my-new-flag" '{"name":"My New Flag","tags":["release"]}'
 *   tsx scripts/flags-create.ts "my-new-flag" '{"dryRun":true}'
 */

import { parseArgs, resolveConfig, requireToken, executeAndPrint, out } from './lib/common.js'
import { createClient } from './lib/posthog-client.js'
import { getFixture } from './lib/fixtures.js'

const { target: key, opts } = parseArgs(import.meta.url)

if (opts.dryRun) {
  out(getFixture('flags-create'))
  process.exit(0)
}

const config = resolveConfig()
requireToken(config)

const client = createClient(config)

const body: Record<string, unknown> = {}
if (opts.name !== undefined) body['name'] = opts.name
if (opts.tags !== undefined) body['tags'] = opts.tags

await executeAndPrint(() => client.createFeatureFlag(key, body))
