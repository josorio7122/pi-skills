import { describe, expect, it } from 'vitest'
import { runInline } from '../helpers/run-script.js'

const COMMON = new URL('../../skills/posthog-skill/scripts/lib/common.ts', import.meta.url).pathname
const ERROR = new URL('../../skills/posthog-skill/scripts/lib/posthog-error.ts', import.meta.url).pathname

function run(code: string, env: Record<string, string | undefined> = {}) {
  return runInline(code, { POSTHOG_PROJECT_ID: 'test-123', ...env })
}

describe('handleError: PostHogError 401', () => {
  it('prints unauthorized message to stderr', () => {
    const result = run(`
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
    const result = run(`
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
    const result = run(`
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
    const result = run(`
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
    const result = run(`
      import { handleError } from '${COMMON}';
      handleError(new Error('plain-error-message'));
    `)
    expect(result.status).toBe(1)
    expect(result.stderr).toContain('plain-error-message')
  })
})

describe('handleError: non-Error value', () => {
  it('stringifies non-Error values to stderr', () => {
    const result = run(`
      import { handleError } from '${COMMON}';
      handleError('something went wrong');
    `)
    expect(result.status).toBe(1)
    expect(result.stderr).toContain('something went wrong')
  })
})

describe('requireToken', () => {
  it('exits 1 when token is empty', () => {
    const result = run(`
      import { requireToken } from '${COMMON}';
      requireToken({ host: 'https://us.posthog.com', projectId: 'test-123', token: '' });
    `)
    expect(result.status).toBe(1)
    expect(result.stderr).toContain('POSTHOG_PERSONAL_API_KEY')
  })
})

describe('resolveConfig', () => {
  it('uses default host when POSTHOG_HOST is not set', () => {
    const result = run(
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
    const result = run(
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
