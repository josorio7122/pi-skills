import { Exa } from 'exa-js'
import { isRecord } from '../../../../scripts/lib/shared.js'

export {
  executeAndPrint,
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

/**
 * Pick allowed keys from an options object, skipping undefined values.
 */
export function filterOptions({
  opts,
  keys,
}: {
  readonly opts: Readonly<Record<string, unknown>>
  readonly keys: readonly string[]
}): Readonly<Record<string, unknown>> {
  const filtered: Record<string, unknown> = {}
  for (const key of keys) {
    if (opts[key] !== undefined) filtered[key] = opts[key]
  }
  return filtered
}

/**
 * Build contents options from text/highlights/summary fields.
 * Each field accepts `true` (shorthand) or an object (fine control).
 */
export function buildContentsOptions(opts: Readonly<Record<string, unknown>>) {
  const base: Record<string, unknown> = {}
  for (const key of ['text', 'highlights', 'summary'] as const) {
    if (opts[key] === true || (typeof opts[key] === 'object' && opts[key] !== null)) base[key] = opts[key]
  }
  if (isRecord(opts.contents)) {
    return { ...base, ...opts.contents }
  }
  return base
}
