#!/usr/bin/env tsx
/**
 * PostHog status — check config and token status.
 *
 * Usage:
 *   tsx scripts/status.ts
 *   tsx scripts/status.ts --help
 *
 * Environment:
 *   POSTHOG_PROJECT_ID       — required
 *   POSTHOG_PERSONAL_API_KEY — optional (shows presence)
 *   POSTHOG_HOST             — optional (default: https://us.posthog.com)
 *
 * Examples:
 *   tsx scripts/status.ts
 */

import { out, parseArgsOptional, resolveConfig } from './lib/common.js'

parseArgsOptional(import.meta.url)

const config = resolveConfig()

out({
	host: config.host,
	project_id: config.projectId,
	token: config.token ? '*** (present)' : 'NOT SET',
	token_present: Boolean(config.token),
})
