#!/usr/bin/env tsx
/**
 * PostHog flags list — list all feature flags.
 *
 * Usage:
 *   tsx scripts/flags-list.ts [options-json]
 *   tsx scripts/flags-list.ts --help
 *
 * Options JSON (all optional):
 *   {
 *     "search": "checkout",
 *     "active": "true",
 *     "type": "multivariate",
 *     "limit": 50
 *   }
 *
 * Environment:
 *   POSTHOG_PROJECT_ID       — required
 *   POSTHOG_PERSONAL_API_KEY — required
 *   POSTHOG_HOST             — optional
 *
 * Examples:
 *   tsx scripts/flags-list.ts
 *   tsx scripts/flags-list.ts '{"search":"checkout"}'
 *   tsx scripts/flags-list.ts '{"active":"true","limit":10}'
 */

import {
  parseArgsOptional,
  resolveConfig,
  requireToken,
  executeAndPrint,
} from './lib/common.js'
import { createClient } from './lib/posthog-client.js'

const { opts } = parseArgsOptional(import.meta.url)

const config = resolveConfig()
requireToken(config)

const client = createClient(config)

await executeAndPrint(() =>
  client.listFeatureFlags({
    search: opts.search as string | undefined,
    active: opts.active as string | undefined,
    type: opts.type as string | undefined,
    limit: opts.limit as number | undefined,
  }),
)
