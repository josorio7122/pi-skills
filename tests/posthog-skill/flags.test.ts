import { spawnSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const SCRIPTS = path.join(__dirname, '..', '..', 'skills', 'posthog-skill', 'scripts')

interface RunFlagOptions {
  script: string
  args?: string[]
  env?: Record<string, string | undefined>
}

function runFlag({ script, args = [], env = {} }: RunFlagOptions) {
  const result = spawnSync('npx', ['tsx', path.join(SCRIPTS, script), ...args], {
    encoding: 'utf8',
    env: {
      ...process.env,
      POSTHOG_PROJECT_ID: 'test-123',
      POSTHOG_PERSONAL_API_KEY: '',
      ...env,
    },
  })
  return {
    status: result.status ?? -1,
    stdout: result.stdout ?? '',
    stderr: result.stderr ?? '',
  }
}

describe('flags-get.ts', () => {
  it('shows help text on --help', () => {
    const result = runFlag({ script: 'flags-get.ts', args: ['--help'] })
    expect(result.status).toBe(0)
    expect(result.stdout).toContain('Usage:')
  })

  it('shows help when no arguments provided', () => {
    const result = runFlag({ script: 'flags-get.ts' })
    expect(result.status).toBe(0)
    expect(result.stdout).toContain('Usage:')
  })

  it('exits 1 when token is missing', () => {
    const result = runFlag({ script: 'flags-get.ts', args: ['101'], env: { POSTHOG_PERSONAL_API_KEY: '' } })
    expect(result.status).toBe(1)
    expect(result.stderr).toContain('POSTHOG_PERSONAL_API_KEY')
  })
})

describe('flags-create.ts', () => {
  it('shows help text on --help', () => {
    const result = runFlag({ script: 'flags-create.ts', args: ['--help'] })
    expect(result.status).toBe(0)
    expect(result.stdout).toContain('Usage:')
  })

  it('exits 1 when token is missing', () => {
    const result = runFlag({ script: 'flags-create.ts', args: ['my-flag'], env: { POSTHOG_PERSONAL_API_KEY: '' } })
    expect(result.status).toBe(1)
    expect(result.stderr).toContain('POSTHOG_PERSONAL_API_KEY')
  })

  it('exits 1 when options JSON is invalid', () => {
    const result = runFlag({
      script: 'flags-create.ts',
      args: ['my-flag', '{not-json}'],
      env: { POSTHOG_PERSONAL_API_KEY: 'phx_test' },
    })
    expect(result.status).toBe(1)
    expect(result.stderr).toContain('not valid JSON')
  })
})

describe('flags-update.ts', () => {
  it('shows help text on --help', () => {
    const result = runFlag({ script: 'flags-update.ts', args: ['--help'] })
    expect(result.status).toBe(0)
    expect(result.stdout).toContain('Usage:')
  })

  it('exits 1 when token is missing', () => {
    const result = runFlag({ script: 'flags-update.ts', args: ['101'], env: { POSTHOG_PERSONAL_API_KEY: '' } })
    expect(result.status).toBe(1)
    expect(result.stderr).toContain('POSTHOG_PERSONAL_API_KEY')
  })

  it('exits 1 when options JSON is invalid', () => {
    const result = runFlag({
      script: 'flags-update.ts',
      args: ['101', '{bad}'],
      env: { POSTHOG_PERSONAL_API_KEY: 'phx_test' },
    })
    expect(result.status).toBe(1)
    expect(result.stderr).toContain('not valid JSON')
  })
})

describe('flags-activity.ts', () => {
  it('shows help text on --help', () => {
    const result = runFlag({ script: 'flags-activity.ts', args: ['--help'] })
    expect(result.status).toBe(0)
    expect(result.stdout).toContain('Usage:')
  })

  it('exits 1 when token is missing', () => {
    const result = runFlag({ script: 'flags-activity.ts', args: ['101'], env: { POSTHOG_PERSONAL_API_KEY: '' } })
    expect(result.status).toBe(1)
    expect(result.stderr).toContain('POSTHOG_PERSONAL_API_KEY')
  })
})

describe('flags-toggle.ts', () => {
  it('shows help text on --help', () => {
    const result = runFlag({ script: 'flags-toggle.ts', args: ['--help'] })
    expect(result.status).toBe(0)
    expect(result.stdout).toContain('Usage:')
  })

  it('exits 1 when token is missing', () => {
    const result = runFlag({ script: 'flags-toggle.ts', args: ['101'], env: { POSTHOG_PERSONAL_API_KEY: '' } })
    expect(result.status).toBe(1)
    expect(result.stderr).toContain('POSTHOG_PERSONAL_API_KEY')
  })
})

describe('flags-list.ts', () => {
  it('shows help text on --help', () => {
    const result = runFlag({ script: 'flags-list.ts', args: ['--help'] })
    expect(result.status).toBe(0)
    expect(result.stdout).toContain('Usage:')
  })

  it('exits 1 when token is missing', () => {
    const result = runFlag({ script: 'flags-list.ts', env: { POSTHOG_PERSONAL_API_KEY: '' } })
    expect(result.status).toBe(1)
    expect(result.stderr).toContain('POSTHOG_PERSONAL_API_KEY')
  })
})
