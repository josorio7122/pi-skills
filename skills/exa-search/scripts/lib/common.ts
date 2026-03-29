import { readFileSync } from 'node:fs'
import { Exa } from 'exa-js'

/** Require an environment variable, exit with error if missing. */
export function requireEnv(name: string): string {
	const value = process.env[name]
	if (!value) {
		process.stderr.write(`Error: ${name} environment variable is required.\n`)
		process.exit(1)
	}
	return value
}

/** Create an Exa client instance. Requires EXA_API_KEY env var. */
export function createClient(): Exa {
	return new Exa()
}

/** Require a CLI argument, exit with error if missing. */
export function requireArg(value: string | undefined, name: string): string {
	if (!value) {
		process.stderr.write(`Error: ${name} is required\n`)
		process.exit(1)
	}
	return value
}

/** Write JSON to stdout. */
export function out(data: unknown): void {
	process.stdout.write(JSON.stringify(data, null, 2) + '\n')
}

/** Execute an async API call, print JSON result, exit on error. */
export async function executeAndPrint<T>(apiCall: () => Promise<T>): Promise<void> {
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
export function showHelp(scriptUrl: string): void {
	const lines: string[] = []
	const src = readFileSync(new URL(scriptUrl), 'utf8')
	for (const line of src.split('\n')) {
		if (line.startsWith(' * ') || line.startsWith(' */')) {
			if (line.startsWith(' */')) break
			lines.push(line.slice(3))
		}
	}
	process.stdout.write(lines.join('\n') + '\n')
	process.exit(0)
}

/**
 * Ensure EXA_API_KEY is set. Exits with an error message if not.
 */
export function requireApiKey(): void {
	if (!process.env.EXA_API_KEY) {
		process.stderr.write('Error: EXA_API_KEY environment variable is required.\n')
		process.stderr.write('Get one at: https://dashboard.exa.ai/api-keys\n')
		process.exit(1)
	}
}

/**
 * Parse CLI args: show help if --help or no args, return target and options.
 */
export function parseArgs(scriptUrl: string): { target: string; opts: Record<string, unknown> } {
	const args = process.argv.slice(2)

	if (args.includes('--help') || args.length === 0) {
		showHelp(scriptUrl)
	}

	const target = requireArg(args[0], 'target')
	let opts: Record<string, unknown> = {}
	if (args[1]) {
		try {
			opts = JSON.parse(args[1]) as Record<string, unknown>
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
export function filterOptions(
	opts: Record<string, unknown>,
	keys: readonly string[],
): Record<string, unknown> {
	const filtered: Record<string, unknown> = {}
	for (const key of keys) {
		if (opts[key] !== undefined) filtered[key] = opts[key]
	}
	return filtered
}

/**
 * Build contents options from text/highlights/summary fields.
 */
export function buildContentsOptions(opts: Record<string, unknown>): Record<string, unknown> {
	let contentsOpts: Record<string, unknown> = {}
	if (opts.text === true) contentsOpts.text = true
	else if (typeof opts.text === 'object') contentsOpts.text = opts.text
	if (opts.highlights === true) contentsOpts.highlights = true
	else if (typeof opts.highlights === 'object') contentsOpts.highlights = opts.highlights
	if (opts.summary === true) contentsOpts.summary = true
	else if (typeof opts.summary === 'object') contentsOpts.summary = opts.summary
	if (typeof opts.contents === 'object')
		contentsOpts = { ...contentsOpts, ...(opts.contents as Record<string, unknown>) }
	return contentsOpts
}
