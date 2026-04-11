#!/usr/bin/env tsx
/**
 * Exa answer — get AI-generated answers with citations.
 *
 * Usage:
 *   tsx scripts/answer.ts <query> [options-json]
 *   tsx scripts/answer.ts --help
 *
 * Options JSON (all optional):
 *   {
 *     "text": true,              // include full text in citation results
 *     "model": "exa",            // "exa" (default)
 *     "systemPrompt": "...",     // guide the LLM behavior
 *     "outputSchema": {},        // JSON Schema for structured output
 *     "stream": false,           // stream chunks to stdout
 *     "userLocation": "US"
 *   }
 *
 * Environment:
 *   EXA_API_KEY — required
 *
 * Examples:
 *   tsx scripts/answer.ts "What is the latest Next.js version?"
 *   tsx scripts/answer.ts "Compare React and Vue" '{"text":true}'
 *   tsx scripts/answer.ts "SpaceX valuation" '{"model":"exa","stream":true}'
 *   tsx scripts/answer.ts "List top 3 ORMs" '{"outputSchema":{"type":"object","properties":{"items":{"type":"array","items":{"type":"string"}}}}}'
 */

import { createClient, filterOptions, handleError, isRecord, out, parseArgs, requireApiKey } from './lib/common.js'

const { target: query, opts } = parseArgs(import.meta.url)
requireApiKey()

const exa = createClient()

const answerOpts = filterOptions({ opts, keys: ['text', 'model', 'systemPrompt', 'outputSchema', 'userLocation'] })

try {
  if (opts.stream) {
    // Streaming mode — write chunks as they arrive
    for await (const chunk of exa.streamAnswer(query, answerOpts)) {
      if (!isRecord(chunk)) continue
      if (typeof chunk.content === 'string') process.stdout.write(chunk.content)
      if (chunk.citations != null) {
        process.stdout.write('\n')
        out({ citations: chunk.citations })
      }
    }
    process.stdout.write('\n')
  } else {
    const result = await exa.answer(query, answerOpts)
    out(result)
  }
} catch (err) {
  handleError(err)
}
