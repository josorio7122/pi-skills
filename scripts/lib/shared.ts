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
  return typeof value === 'object' && value !== null
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
      const parsed: unknown = JSON.parse(args[1])
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

  return { target, opts }
}
