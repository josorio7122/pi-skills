import { readFileSync } from 'node:fs'
import { PostHogError } from './posthog-error.js'
import type { PostHogConfig } from './posthog-types.js'

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
    token: process.env.POSTHOG_PERSONAL_API_KEY ?? '',
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

/** Require a CLI argument, exit with error if missing. */
export function requireArg({ value, name }: { readonly value: string | undefined; readonly name: string }) {
  if (!value) {
    process.stderr.write(`Error: ${name} is required\n`)
    process.exit(1)
  }
  return value
}

/** Execute an async API call, print JSON result, exit on error. */
export async function executeAndPrint<T>(apiCall: () => Promise<T>) {
  try {
    const result = await apiCall()
    out(result)
  } catch (err) {
    handleError(err)
  }
}

/** Write JSON to stdout. */
export function out(data: unknown) {
  process.stdout.write(JSON.stringify(data, null, 2) + '\n')
}

/**
 * Show help text extracted from the JSDoc comment at the top of a script file.
 */
export function showHelp(scriptUrl: string) {
  const lines: string[] = []
  const src = readFileSync(new URL(scriptUrl), 'utf8')
  let inJsDoc = false
  for (const line of src.split('\n')) {
    if (!inJsDoc && line.trimStart().startsWith('/**')) {
      inJsDoc = true
      continue
    }
    if (inJsDoc) {
      if (line.trimStart().startsWith('*/')) break
      const content = line.replace(/^\s*\* ?/, '')
      lines.push(content)
    }
  }
  process.stdout.write(lines.join('\n') + '\n')
  process.exit(0)
}

/**
 * Parse CLI args: show help if --help or no args, return target and options.
 * Pattern: <target> [options-json]
 */
export function parseArgs(scriptUrl: string) {
  const args = process.argv.slice(2)

  if (args.includes('--help') || args.length === 0) {
    showHelp(scriptUrl)
  }

  const target = requireArg({ value: args[0], name: 'target' })
  let opts: Readonly<Record<string, unknown>> = {}
  if (args[1]) {
    try {
      opts = JSON.parse(args[1]) as Readonly<Record<string, unknown>>
    } catch {
      process.stderr.write('Error: options argument is not valid JSON\n')
      process.exit(1)
    }
  }

  return { target, opts }
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
      opts = JSON.parse(args[0]) as Readonly<Record<string, unknown>>
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
  } else {
    process.stderr.write(`Error: ${err instanceof Error ? err.message : String(err)}\n`)
  }
  process.exit(1)
}
