import { spawnSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const COMMON = path.join(__dirname, '..', '..', 'skills', 'posthog-skill', 'scripts', 'lib', 'common.ts')
const ERROR = path.join(__dirname, '..', '..', 'skills', 'posthog-skill', 'scripts', 'lib', 'posthog-error.ts')

function runInline(code: string, env: Record<string, string | undefined> = {}) {
  const result = spawnSync('npx', ['tsx', '--eval', code], {
    encoding: 'utf8',
    env: { ...process.env, POSTHOG_PROJECT_ID: 'test-123', ...env },
  })
  return {
    status: result.status ?? -1,
    stdout: result.stdout ?? '',
    stderr: result.stderr ?? '',
  }
}

describe('handleError: PostHogError 401', () => {
  it('prints unauthorized message to stderr', () => {
    const result = runInline(`
      import { handleError } from '${COMMON}';
      import { PostHogError } from '${ERROR}';
      handleError(new PostHogError({ status: 401, message: 'test', endpoint: '/api/test' }));
    `)
    expect(result.status).toBe(1)
    expect(result.stderr).toContain('401')
    expect(result.stderr).toContain('Unauthorized')
  })
})

describe('handleError: PostHogError 403', () => {
  it('prints forbidden message to stderr', () => {
    const result = runInline(`
      import { handleError } from '${COMMON}';
      import { PostHogError } from '${ERROR}';
      handleError(new PostHogError({ status: 403, message: 'test', endpoint: '/api/test' }));
    `)
    expect(result.status).toBe(1)
    expect(result.stderr).toContain('403')
    expect(result.stderr).toContain('Forbidden')
  })
})

describe('handleError: PostHogError 429', () => {
  it('prints rate limit message to stderr', () => {
    const result = runInline(`
      import { handleError } from '${COMMON}';
      import { PostHogError } from '${ERROR}';
      handleError(new PostHogError({ status: 429, message: 'test', endpoint: '/api/test' }));
    `)
    expect(result.status).toBe(1)
    expect(result.stderr).toContain('rate limit')
  })
})

describe('handleError: PostHogError generic status', () => {
  it('prints the error message for unknown status codes', () => {
    const result = runInline(`
      import { handleError } from '${COMMON}';
      import { PostHogError } from '${ERROR}';
      handleError(new PostHogError({ status: 500, message: 'Internal Server Error', endpoint: '/api/test' }));
    `)
    expect(result.status).toBe(1)
    expect(result.stderr).toContain('Internal Server Error')
  })
})

describe('handleError: plain Error', () => {
  it('prints the error message to stderr', () => {
    const result = runInline(`
      import { handleError } from '${COMMON}';
      handleError(new Error('plain-error-message'));
    `)
    expect(result.status).toBe(1)
    expect(result.stderr).toContain('plain-error-message')
  })
})

describe('handleError: non-Error value', () => {
  it('stringifies non-Error values to stderr', () => {
    const result = runInline(`
      import { handleError } from '${COMMON}';
      handleError('something went wrong');
    `)
    expect(result.status).toBe(1)
    expect(result.stderr).toContain('something went wrong')
  })
})

describe('requireToken', () => {
  it('exits 1 when token is empty', () => {
    const result = runInline(`
      import { requireToken } from '${COMMON}';
      requireToken({ host: 'https://us.posthog.com', projectId: 'test-123', token: '' });
    `)
    expect(result.status).toBe(1)
    expect(result.stderr).toContain('POSTHOG_PERSONAL_API_KEY')
  })
})

describe('resolveConfig', () => {
  it('uses default host when POSTHOG_HOST is not set', () => {
    const result = runInline(
      `
      import { resolveConfig, out } from '${COMMON}';
      out(resolveConfig());
    `,
      { POSTHOG_HOST: undefined },
    )
    expect(result.status).toBe(0)
    expect(result.stdout).toContain('https://us.posthog.com')
  })
})

describe('resolveConfig: token is undefined when env var is missing', () => {
  it('returns undefined token when POSTHOG_PERSONAL_API_KEY is not set', () => {
    const result = runInline(
      `
      import { resolveConfig, out } from '${COMMON}';
      out(resolveConfig());
    `,
      { POSTHOG_PERSONAL_API_KEY: undefined },
    )
    expect(result.status).toBe(0)
    const parsed = JSON.parse(result.stdout) as { token: unknown }
    expect(parsed.token).toBeUndefined()
  })
})
