import { readFileSync } from 'node:fs'

/** Require a CLI argument, exit with error if missing. */
export function requireArg({ value, name }: { readonly value: string | undefined; readonly name: string }) {
  if (!value) {
    process.stderr.write(`Error: ${name} is required\n`)
    process.exit(1)
  }
  return value
}

/** Type guard: narrows unknown to Record<string, unknown>. */
export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/** Write JSON to stdout. Callers must ensure data is not circular. */
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

/** Parse a string as a JSON object. Rejects arrays, primitives, and null. */
export function parseJsonObject(raw: string): Readonly<Record<string, unknown>> {
  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    process.stderr.write('Error: options argument is not valid JSON\n')
    process.exit(1)
  }
  if (!isRecord(parsed)) {
    process.stderr.write('Error: options argument is not a valid JSON object\n')
    process.exit(1)
  }
  return parsed
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
    opts = parseJsonObject(args[1])
  }

  return { target, opts }
}

/** Write error to stderr and exit. */
export function handleError(err: unknown): never {
  process.stderr.write(`Error: ${err instanceof Error ? err.message : String(err)}\n`)
  process.exit(1)
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
