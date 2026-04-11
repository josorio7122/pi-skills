import { Exa } from 'exa-js'
import { isRecord } from '../../../../scripts/lib/shared.js'

export {
  executeAndPrint,
  filterOptions,
  handleError,
  isRecord,
  out,
  parseArgs,
  parseJsonObject,
  requireArg,
  showHelp,
} from '../../../../scripts/lib/shared.js'

/** Create an Exa client instance. Requires EXA_API_KEY env var. */
export function createClient() {
  return new Exa()
}

/**
 * Ensure EXA_API_KEY is set. Exits with an error message if not.
 */
export function requireApiKey() {
  if (!process.env.EXA_API_KEY) {
    process.stderr.write('Error: EXA_API_KEY environment variable is required.\n')
    process.stderr.write('Get one at: https://dashboard.exa.ai/api-keys\n')
    process.exit(1)
  }
}

/** Validate API key and return an authenticated Exa client. */
export function createAuthenticatedClient() {
  requireApiKey()
  return createClient()
}

/** Check if the user requested any contents fields. */
export function wantsContents(opts: Readonly<Record<string, unknown>>) {
  return Boolean(opts.contents || opts.text || opts.highlights || opts.summary)
}

/**
 * Build contents options from text/highlights/summary fields.
 * Each field accepts `true` (shorthand) or an object (fine control).
 */
export function buildContentsOptions(opts: Readonly<Record<string, unknown>>) {
  const base = Object.fromEntries(
    (['text', 'highlights', 'summary'] as const)
      .filter((key) => opts[key] === true || (typeof opts[key] === 'object' && opts[key] !== null))
      .map((key) => [key, opts[key]]),
  )
  if (isRecord(opts.contents)) {
    return { ...base, ...opts.contents }
  }
  return base
}
