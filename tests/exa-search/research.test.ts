import { spawnSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const RESEARCH = path.join(__dirname, '..', '..', 'skills', 'exa-search', 'scripts', 'research.ts')

function runResearch(args: string[], env: Record<string, string | undefined> = {}) {
  const result = spawnSync('npx', ['tsx', RESEARCH, ...args], {
    encoding: 'utf8',
    env: { ...process.env, EXA_API_KEY: 'test-key', ...env },
  })
  return {
    status: result.status ?? -1,
    stdout: result.stdout ?? '',
    stderr: result.stderr ?? '',
  }
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
