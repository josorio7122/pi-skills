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

import { createAuthenticatedClient, executeAndPrint, parseArgsOptional } from './lib/common.js'

const { opts } = parseArgsOptional(import.meta.url)

const client = createAuthenticatedClient()

const params: Record<string, string | number> = {}
if (typeof opts.search === 'string') params.search = opts.search
if (typeof opts.active === 'string') params.active = opts.active
if (typeof opts.type === 'string') params.type = opts.type
if (typeof opts.limit === 'number') params.limit = opts.limit

await executeAndPrint(() => client.listFeatureFlags(params))
