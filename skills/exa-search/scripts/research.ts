#!/usr/bin/env tsx
/**
 * Exa research — create and manage deep research tasks.
 *
 * Usage:
 *   tsx scripts/research.ts create <instructions> [options-json]
 *   tsx scripts/research.ts get <research-id> [options-json]
 *   tsx scripts/research.ts poll <research-id> [options-json]
 *   tsx scripts/research.ts list [options-json]
 *   tsx scripts/research.ts run <instructions> [options-json]
 *   tsx scripts/research.ts --help
 *
 * Subcommands:
 *   create   — Start a new research task (returns immediately with researchId)
 *   get      — Get the current status/result of a research task
 *   poll     — Poll an existing task until finished (blocks until complete)
 *   list     — List research tasks
 *   run      — Create + poll in one step (convenience)
 *
 * Options JSON for create/run:
 *   {
 *     "model": "exa-research-fast",   // "exa-research-fast"|"exa-research"|"exa-research-pro"
 *     "outputSchema": {}              // JSON Schema for structured output
 *   }
 *
 * Options JSON for get:
 *   {
 *     "stream": false,                // stream SSE events
 *     "events": false                 // include event log
 *   }
 *
 * Options JSON for poll:
 *   {
 *     "pollInterval": 2000,           // ms between polls (default 2000)
 *     "timeoutMs": 300000,            // max wait time (default 5 min)
 *     "events": false
 *   }
 *
 * Options JSON for list:
 *   {
 *     "limit": 10,
 *     "cursor": "..."
 *   }
 *
 * Environment:
 *   EXA_API_KEY — required
 *
 * Examples:
 *   tsx scripts/research.ts create "Research the latest AI developments"
 *   tsx scripts/research.ts get "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *   tsx scripts/research.ts run "What is SpaceX's latest valuation?" '{"model":"exa-research-pro"}'
 *   tsx scripts/research.ts list '{"limit":5}'
 */

import {
  createAuthenticatedClient,
  executeAndPrint,
  handleError,
  isRecord,
  parseJsonObject,
  requireArg,
  showHelp,
} from './lib/common.js'

const VALID_MODELS = ['exa-research-fast', 'exa-research', 'exa-research-pro'] as const
type ResearchModel = (typeof VALID_MODELS)[number]

function toModel(value: unknown): ResearchModel | undefined {
  if (typeof value === 'string' && (VALID_MODELS as readonly string[]).includes(value)) {
    return value as ResearchModel
  }
  return undefined
}

function buildCreateParams({
  instructions,
  opts,
}: {
  readonly instructions: string
  readonly opts: Readonly<Record<string, unknown>>
}) {
  const model = toModel(opts.model)
  const outputSchema = isRecord(opts.outputSchema) ? opts.outputSchema : undefined
  return {
    instructions,
    ...(model ? { model } : {}),
    ...(outputSchema ? { outputSchema } : {}),
  }
}

// research.ts has a subcommand pattern: parseArgs assumes args[1] is JSON opts,
// which conflicts with create/run where args[1] is instructions text. Use
// showHelp directly and index process.argv by position instead.
if (process.argv.includes('--help') || process.argv.length <= 2) {
  showHelp(import.meta.url)
}

const subcommand = process.argv[2]
const arg1 = process.argv[3]

const exa = createAuthenticatedClient()

try {
  switch (subcommand) {
    case 'create': {
      const instructions = requireArg({ value: arg1, name: 'instructions' })
      const opts = process.argv[4] ? parseJsonObject(process.argv[4]) : {}
      await executeAndPrint(() => exa.research.create(buildCreateParams({ instructions, opts })))
      break
    }

    case 'get': {
      const researchId = requireArg({ value: arg1, name: 'research-id' })
      const opts = process.argv[4] ? parseJsonObject(process.argv[4]) : {}
      if (opts.stream) {
        const streamResult = await exa.research.get(researchId, { stream: true, ...opts })
        for await (const event of streamResult) {
          process.stdout.write(JSON.stringify(event) + '\n')
        }
      } else {
        await executeAndPrint(() => exa.research.get(researchId, opts))
      }
      break
    }

    case 'poll': {
      const researchId = requireArg({ value: arg1, name: 'research-id' })
      const opts = process.argv[4] ? parseJsonObject(process.argv[4]) : {}
      await executeAndPrint(() => exa.research.pollUntilFinished(researchId, opts))
      break
    }

    case 'run': {
      const instructions = requireArg({ value: arg1, name: 'instructions' })
      const opts = process.argv[4] ? parseJsonObject(process.argv[4]) : {}
      const created: unknown = await exa.research.create(buildCreateParams({ instructions, opts }))
      const researchId =
        typeof created === 'object' && created !== null && 'researchId' in created ? created.researchId : undefined
      if (typeof researchId !== 'string') {
        process.stderr.write('Error: unexpected response from exa.research.create — missing researchId\n')
        process.exit(1)
      }
      process.stderr.write(`Research task created: ${researchId} — polling...\n`)
      await executeAndPrint(() =>
        exa.research.pollUntilFinished(researchId, {
          pollInterval: typeof opts.pollInterval === 'number' ? opts.pollInterval : 2000,
          timeoutMs: typeof opts.timeoutMs === 'number' ? opts.timeoutMs : 300000,
          ...(typeof opts.events === 'boolean' ? { events: opts.events } : {}),
        }),
      )
      break
    }

    case 'list': {
      const opts = process.argv[3] ? parseJsonObject(process.argv[3]) : {}
      await executeAndPrint(() => exa.research.list(opts))
      break
    }

    default:
      process.stderr.write(`Error: Unknown subcommand "${subcommand}".\n`)
      process.stderr.write('Valid subcommands: create, get, poll, list, run\n')
      process.exit(1)
  }
} catch (err) {
  handleError(err)
}
