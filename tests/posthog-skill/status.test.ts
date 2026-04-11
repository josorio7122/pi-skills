import { describe, expect, it } from 'vitest'
import { runScript } from '../helpers/run-script.js'

const STATUS_SCRIPT = new URL('../../skills/posthog-skill/scripts/status.ts', import.meta.url).pathname

function runStatus(env: Record<string, string> = {}) {
  return runScript({ scriptPath: STATUS_SCRIPT, env })
}

describe('status script', () => {
  it('exits 0 with no token set', () => {
    const result = runStatus({ POSTHOG_PERSONAL_API_KEY: '' })
    expect(result.status).toBe(0)
  })

  it('stdout contains NOT SET when no token', () => {
    const result = runStatus({ POSTHOG_PERSONAL_API_KEY: '' })
    expect(result.stdout).toContain('NOT SET')
  })

  it('stdout contains masked token when token is set', () => {
    const result = runStatus({ POSTHOG_PERSONAL_API_KEY: 'phx_supersecrettoken123' })
    expect(result.stdout).toContain('***')
    expect(result.stdout).not.toContain('supersecrettoken123')
  })

  it('stdout is valid JSON', () => {
    const result = runStatus({ POSTHOG_PERSONAL_API_KEY: '' })
    expect(() => JSON.parse(result.stdout)).not.toThrow()
  })

  it('includes project_id in output', () => {
    const result = runStatus({
      POSTHOG_PERSONAL_API_KEY: '',
      POSTHOG_PROJECT_ID: 'test-project-123',
    })
    const parsed = JSON.parse(result.stdout) as { project_id: unknown }
    expect(parsed.project_id).toBeTruthy()
  })
})
