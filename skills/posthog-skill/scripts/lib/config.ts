import { PostHogError } from './posthog-client.js'
import type { PostHogConfig } from './posthog-client.js'

// ---------------------------------------------------------------------------
// Config types
// ---------------------------------------------------------------------------

export interface AppConfig extends PostHogConfig {}

// ---------------------------------------------------------------------------
// Config resolution
// ---------------------------------------------------------------------------

export function resolveConfig(): AppConfig {
  const projectId = process.env['POSTHOG_PROJECT_ID']
  if (!projectId) {
    process.stderr.write('Error: POSTHOG_PROJECT_ID environment variable is required\n')
    process.exit(1)
  }
  return {
    host: process.env['POSTHOG_HOST'] ?? 'https://us.posthog.com',
    projectId,
    token: process.env['POSTHOG_PERSONAL_API_KEY'] ?? '',
  }
}

export function requireToken(config: AppConfig): void {
  if (!config.token) {
    process.stderr.write(
      'Error: POSTHOG_PERSONAL_API_KEY is required for this command.\n' +
        'Set it in your environment: export POSTHOG_PERSONAL_API_KEY=phx_...\n',
    )
    process.exit(1)
  }
}

// ---------------------------------------------------------------------------
// Output helpers
// ---------------------------------------------------------------------------

export function out(data: unknown): void {
  process.stdout.write(JSON.stringify(data, null, 2) + '\n')
}

export function info(msg: string): void {
  process.stderr.write(msg + '\n')
}

export function handleApiError(err: unknown, context?: string): never {
  if (err instanceof PostHogError) {
    if (err.status === 401) {
      process.stderr.write(
        `Error: PostHog returned 401 (Unauthorized) on ${err.endpoint}\n` +
          'Verify that POSTHOG_PERSONAL_API_KEY is valid and has not expired.\n',
      )
    } else if (err.status === 403) {
      process.stderr.write(
        `Error: PostHog returned 403 (Forbidden) on ${err.endpoint}\n` +
          'Check that your API key has these scopes: dashboard:read, dashboard:write, insight:read, insight:write, query:read\n',
      )
    } else if (err.status === 429) {
      process.stderr.write(
        `Error: PostHog rate limit exceeded on ${err.endpoint} — tried 3 times.\n`,
      )
    } else {
      process.stderr.write(`Error: ${context ?? 'PostHog request failed'}: ${err.message}\n`)
    }
  } else {
    const message = err instanceof Error ? err.message : String(err)
    process.stderr.write(`Error: Connection to PostHog failed: ${message}\n`)
  }
  process.exit(1)
}
