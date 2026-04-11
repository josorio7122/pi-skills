import { handleError as baseHandleError, showHelp } from '../../../../scripts/lib/shared.js'
import { PostHogError } from './posthog-error.js'
import type { PostHogConfig } from './posthog-types.js'

export { executeAndPrint, out, parseArgs, requireArg, showHelp } from '../../../../scripts/lib/shared.js'

/** Require an environment variable, exit with error if missing. */
export function requireEnv(name: string) {
  const value = process.env[name]
  if (!value) {
    process.stderr.write(`Error: ${name} environment variable is required.\n`)
    process.exit(1)
  }
  return value
}

/** Resolve PostHog config from environment variables. */
export function resolveConfig() {
  return {
    host: process.env.POSTHOG_HOST ?? 'https://us.posthog.com',
    projectId: requireEnv('POSTHOG_PROJECT_ID'),
    token: process.env.POSTHOG_PERSONAL_API_KEY,
  }
}

/** Require a valid API token in the config. Exits if missing. */
export function requireToken(config: PostHogConfig) {
  if (!config.token) {
    process.stderr.write(
      'Error: POSTHOG_PERSONAL_API_KEY is required for this command.\n' +
        'Set it in your environment: export POSTHOG_PERSONAL_API_KEY=phx_...\n',
    )
    process.exit(1)
  }
}

/**
 * Parse CLI args where the first positional arg is optional.
 * Pattern: [options-json]
 */
export function parseArgsOptional(scriptUrl: string) {
  const args = process.argv.slice(2)

  if (args.includes('--help')) {
    showHelp(scriptUrl)
  }

  let opts: Readonly<Record<string, unknown>> = {}
  if (args[0]) {
    try {
      const parsed: unknown = JSON.parse(args[0])
      if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
        process.stderr.write('Error: options argument is not a valid JSON object\n')
        process.exit(1)
      }
      opts = parsed as Readonly<Record<string, unknown>>
    } catch {
      process.stderr.write('Error: options argument is not valid JSON\n')
      process.exit(1)
    }
  }

  return { opts }
}

const STATUS_MESSAGES: Readonly<Record<number, (endpoint: string) => string>> = {
  401: (ep) =>
    `Error: PostHog returned 401 (Unauthorized) on ${ep}\nVerify that POSTHOG_PERSONAL_API_KEY is valid and has not expired.\n`,
  403: (ep) => `Error: PostHog returned 403 (Forbidden) on ${ep}\nCheck that your API key has the required scopes.\n`,
  429: (ep) => `Error: PostHog rate limit exceeded on ${ep} — tried 3 times.\n`,
}

/**
 * Standardized error handler with PostHogError awareness.
 */
export function handleError(err: unknown): never {
  if (err instanceof PostHogError) {
    const formatter = STATUS_MESSAGES[err.status]
    process.stderr.write(formatter ? formatter(err.endpoint) : `Error: ${err.message}\n`)
    process.exit(1)
  }
  baseHandleError(err)
}
