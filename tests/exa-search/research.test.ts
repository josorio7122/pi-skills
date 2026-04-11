import { describe, expect, it } from 'vitest'
import { runScript } from '../helpers/run-script.js'

const RESEARCH = new URL('../../skills/exa-search/scripts/research.ts', import.meta.url).pathname

function runResearch(args: string[], env: Record<string, string | undefined> = {}) {
  return runScript(RESEARCH, args, { EXA_API_KEY: 'test-key', ...env })
}

describe('research.ts: invalid JSON handling', () => {
  it('exits 1 with user-friendly message when create opts are invalid JSON', () => {
    const result = runResearch(['create', 'test instructions', '{not-json'])
    expect(result.status).toBe(1)
    expect(result.stderr).toContain('not valid JSON')
  })

  it('exits 1 with user-friendly message when list opts are invalid JSON', () => {
    const result = runResearch(['list', '{not-json'])
    expect(result.status).toBe(1)
    expect(result.stderr).toContain('not valid JSON')
  })
})
