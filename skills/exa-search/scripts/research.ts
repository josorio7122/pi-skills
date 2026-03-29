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
  showHelp,
  requireApiKey,
  handleError,
  requireArg,
  createClient,
  executeAndPrint,
} from './lib/common.js'

// research.ts has a subcommand pattern: parseArgs assumes args[1] is JSON opts,
// which conflicts with create/run where args[1] is instructions text. Use
// showHelp directly and index process.argv by position instead.
if (process.argv.includes('--help') || process.argv.length <= 2) {
  showHelp(import.meta.url)
}

const subcommand = process.argv[2]
const arg1 = process.argv[3]

requireApiKey()

const exa = createClient()

try {
  switch (subcommand) {
    case 'create': {
      const instructions = requireArg(arg1, 'instructions')
      const opts: Record<string, unknown> = process.argv[4]
        ? (JSON.parse(process.argv[4]) as Record<string, unknown>)
        : {}
      await executeAndPrint(async () =>
        exa.research.create({
          instructions,
          model:
            (opts.model as 'exa-research-fast' | 'exa-research' | 'exa-research-pro') ?? undefined,
          outputSchema: (opts.outputSchema as Record<string, unknown>) ?? undefined,
        }),
      )
      break
    }

    case 'get': {
      const researchId = requireArg(arg1, 'research-id')
      const opts: Record<string, unknown> = process.argv[4]
        ? (JSON.parse(process.argv[4]) as Record<string, unknown>)
        : {}
      if (opts.stream) {
        const streamResult = await exa.research.get(researchId, { stream: true, ...opts })
        for await (const event of streamResult) {
          process.stdout.write(JSON.stringify(event) + '\n')
        }
      } else {
        await executeAndPrint(async () => exa.research.get(researchId, opts))
      }
      break
    }

    case 'poll': {
      const researchId = requireArg(arg1, 'research-id')
      const opts: Record<string, unknown> = process.argv[4]
        ? (JSON.parse(process.argv[4]) as Record<string, unknown>)
        : {}
      await executeAndPrint(async () => exa.research.pollUntilFinished(researchId, opts))
      break
    }

    case 'run': {
      const instructions = requireArg(arg1, 'instructions')
      const opts: Record<string, unknown> = process.argv[4]
        ? (JSON.parse(process.argv[4]) as Record<string, unknown>)
        : {}
      const created = await exa.research.create({
        instructions,
        model:
          (opts.model as 'exa-research-fast' | 'exa-research' | 'exa-research-pro') ?? undefined,
        outputSchema: (opts.outputSchema as Record<string, unknown>) ?? undefined,
      })
      const createdTyped = created as { researchId: string }
      console.error(`Research task created: ${createdTyped.researchId} — polling...`)
      await executeAndPrint(async () =>
        exa.research.pollUntilFinished(createdTyped.researchId, {
          pollInterval: (opts.pollInterval as number) || 2000,
          timeoutMs: (opts.timeoutMs as number) || 300000,
          events: opts.events as boolean | undefined,
        }),
      )
      break
    }

    case 'list': {
      const opts: Record<string, unknown> = arg1
        ? (JSON.parse(arg1) as Record<string, unknown>)
        : {}
      await executeAndPrint(async () => exa.research.list(opts))
      break
    }

    default:
      console.error(`Error: Unknown subcommand "${subcommand}".`)
      console.error('Valid subcommands: create, get, poll, list, run')
      process.exit(1)
  }
} catch (err) {
  handleError(err)
}
