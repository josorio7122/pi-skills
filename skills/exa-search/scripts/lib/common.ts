import { readFileSync } from 'node:fs'
import { Exa } from 'exa-js'

/** Create an Exa client instance. Requires EXA_API_KEY env var. */
export function createClient() {
  return new Exa()
}

/** Require a CLI argument, exit with error if missing. */
export function requireArg({ value, name }: { readonly value: string | undefined; readonly name: string }) {
  if (!value) {
    process.stderr.write(`Error: ${name} is required\n`)
    process.exit(1)
  }
  return value
}

/** Write JSON to stdout. */
export function out(data: unknown) {
  process.stdout.write(JSON.stringify(data, null, 2) + '\n')
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
 * Parse CLI args: show help if --help or no args, return target and options.
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
 * Standardized error handler for all exa scripts.
 */
export function handleError(err: unknown): never {
  process.stderr.write(`Error: ${err instanceof Error ? err.message : String(err)}\n`)
  process.exit(1)
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
  if (typeof opts.contents === 'object' && opts.contents !== null) {
    return { ...base, ...(opts.contents as Record<string, unknown>) }
  }
  return base
}
