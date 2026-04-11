import { describe, expect, it } from 'vitest'
import { createClient } from '../../skills/posthog-skill/scripts/lib/posthog-client.js'
import { PostHogError } from '../../skills/posthog-skill/scripts/lib/posthog-error.js'
import { CONFIG, makeFetch } from './posthog-client-helpers.js'

describe('posthog-client: 429 retry logic', () => {
  it('retries on 429 and eventually succeeds', async () => {
    const fetch = makeFetch(
      { status: 429, body: {} },
      { status: 429, body: {} },
      { status: 200, body: { results: [] } },
    )
    const client = createClient({ config: CONFIG, opts: { fetchFn: fetch, retryDelayMs: 0 } })
    const result = await client.listDashboards()
    expect(fetch.calls).toHaveLength(3)
    expect(result).toEqual({ results: [] })
  })

  it('throws PostHogError after 3 attempts when all return 429', async () => {
    const fetch = makeFetch({ status: 429, body: {} }, { status: 429, body: {} }, { status: 429, body: {} })
    const client = createClient({ config: CONFIG, opts: { fetchFn: fetch, retryDelayMs: 0 } })
    await expect(client.listDashboards()).rejects.toThrow(PostHogError)
    expect(fetch.calls).toHaveLength(3)
  })
})

describe('posthog-client: PostHogError on 4xx', () => {
  it('throws PostHogError with status 401', async () => {
    const fetch = makeFetch({ status: 401, body: { detail: 'Unauthorized' } })
    const client = createClient({ config: CONFIG, opts: { fetchFn: fetch } })
    await expect(client.listDashboards()).rejects.toThrow(PostHogError)
  })

  it('throws PostHogError with status 403', async () => {
    const fetch = makeFetch({ status: 403, body: { detail: 'Forbidden' } })
    const client = createClient({ config: CONFIG, opts: { fetchFn: fetch } })
    await expect(client.listDashboards()).rejects.toThrow(PostHogError)
  })

  it('token does not appear in PostHogError.message', async () => {
    const fetch = makeFetch({ status: 401, body: { detail: 'bad token' } })
    const client = createClient({ config: CONFIG, opts: { fetchFn: fetch } })
    try {
      await client.listDashboards()
    } catch (err) {
      expect((err as PostHogError).message).not.toContain(CONFIG.token)
    }
  })

  it('PostHogError has an endpoint property', async () => {
    const fetch = makeFetch({ status: 404, body: {} })
    const client = createClient({ config: CONFIG, opts: { fetchFn: fetch } })
    try {
      await client.getDashboard(999)
    } catch (err) {
      expect(typeof (err as PostHogError).endpoint).toBe('string')
      expect((err as PostHogError).endpoint).not.toContain(CONFIG.token)
    }
  })
})

describe('posthog-client: exhausted retries throw descriptive error', () => {
  it('throws PostHogError with rate-limit message after all 429 attempts', async () => {
    const fetch = makeFetch({ status: 429, body: {} }, { status: 429, body: {} }, { status: 429, body: {} })
    const client = createClient({ config: CONFIG, opts: { fetchFn: fetch, retryDelayMs: 0 } })
    try {
      await client.listDashboards()
      expect.fail('should have thrown')
    } catch (err) {
      expect(err).toBeInstanceOf(PostHogError)
      expect((err as PostHogError).status).toBe(429)
      expect((err as PostHogError).message).toContain('rate limit')
    }
  })
})

describe('posthog-client: 5xx does not retry', () => {
  it('throws PostHogError immediately on 500 without retry', async () => {
    const fetch = makeFetch({ status: 500, body: { detail: 'server error' } }, { status: 200, body: {} })
    const client = createClient({ config: CONFIG, opts: { fetchFn: fetch, retryDelayMs: 0 } })
    await expect(client.listDashboards()).rejects.toThrow(PostHogError)
    expect(fetch.calls).toHaveLength(1)
  })
})
