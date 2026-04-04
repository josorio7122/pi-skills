import { describe, expect, it } from 'vitest'
import { createClient } from '../../skills/posthog-skill/scripts/lib/posthog-client.js'
import { PostHogError } from '../../skills/posthog-skill/scripts/lib/posthog-error.js'

const CONFIG = {
  host: 'https://us.posthog.com',
  projectId: 'test-project-123',
  token: 'phx_test_token_abc123',
}

interface MockCall {
  url: string
  options: RequestInit
}

interface MockResponse {
  status?: number
  body?: Record<string, unknown>
}

interface MockFetchFn {
  (url: string, options: RequestInit): Promise<{ status: number; ok: boolean; json: () => Promise<unknown> }>
  calls: MockCall[]
}

function makeFetch(...responses: MockResponse[]): MockFetchFn {
  let call = 0
  const calls: MockCall[] = []
  const mockFetch = async (url: string, options: RequestInit) => {
    calls.push({ url, options })
    const resp = responses[call] ?? responses[responses.length - 1] ?? {}
    call++
    const { status = 200, body = {} } = resp
    return {
      status,
      ok: status >= 200 && status < 300,
      json: async (): Promise<unknown> => body,
    }
  }
  ;(mockFetch as MockFetchFn).calls = calls
  return mockFetch as MockFetchFn
}

describe('posthog-client: Authorization header', () => {
  it('sets Authorization: Bearer <token> on GET requests', async () => {
    const fetch = makeFetch({ status: 200, body: { results: [] } })
    const client = createClient({ config: CONFIG, opts: { fetchFn: fetch } })
    await client.listDashboards()
    expect((fetch.calls[0]!.options.headers as Record<string, string>).Authorization).toBe(`Bearer ${CONFIG.token}`)
  })

  it('sets Authorization: Bearer <token> on POST requests', async () => {
    const fetch = makeFetch({ status: 201, body: { id: 1 } })
    const client = createClient({ config: CONFIG, opts: { fetchFn: fetch } })
    await client.createDashboard({ name: 'Test', tags: [] })
    expect((fetch.calls[0]!.options.headers as Record<string, string>).Authorization).toBe(`Bearer ${CONFIG.token}`)
  })
})

describe('posthog-client: Content-Type header', () => {
  it('sets Content-Type: application/json on POST requests', async () => {
    const fetch = makeFetch({ status: 201, body: { id: 1 } })
    const client = createClient({ config: CONFIG, opts: { fetchFn: fetch } })
    await client.createDashboard({ name: 'Test', tags: [] })
    expect((fetch.calls[0]!.options.headers as Record<string, string>)['Content-Type']).toBe('application/json')
  })
})

describe('posthog-client: success responses', () => {
  it('returns parsed JSON body on 200', async () => {
    const fetch = makeFetch({ status: 200, body: { count: 5, results: [] } })
    const client = createClient({ config: CONFIG, opts: { fetchFn: fetch } })
    const result = await client.listDashboards()
    expect(result).toEqual({ count: 5, results: [] })
  })

  it('returns parsed JSON body on 201', async () => {
    const fetch = makeFetch({ status: 201, body: { id: 42, name: 'Test' } })
    const client = createClient({ config: CONFIG, opts: { fetchFn: fetch } })
    const result = await client.createDashboard({ name: 'Test', tags: [] })
    expect(result).toEqual({ id: 42, name: 'Test' })
  })
})

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

describe('posthog-client: 5xx does not retry', () => {
  it('throws PostHogError immediately on 500 without retry', async () => {
    const fetch = makeFetch({ status: 500, body: { detail: 'server error' } }, { status: 200, body: {} })
    const client = createClient({ config: CONFIG, opts: { fetchFn: fetch, retryDelayMs: 0 } })
    await expect(client.listDashboards()).rejects.toThrow(PostHogError)
    expect(fetch.calls).toHaveLength(1)
  })
})

describe('posthog-client: runQuery body shape', () => {
  it('sends correct HogQL query body with refresh:blocking', async () => {
    const sql = 'SELECT event, count() FROM events GROUP BY event'
    const fetch = makeFetch({ status: 200, body: { results: [] } })
    const client = createClient({ config: CONFIG, opts: { fetchFn: fetch } })
    await client.runQuery(sql)
    const body = JSON.parse(fetch.calls[0]!.options.body as string)
    expect(body).toEqual({
      query: { kind: 'HogQLQuery', query: sql },
      refresh: 'blocking',
    })
  })
})

describe('posthog-client: listFeatureFlags', () => {
  it('sends GET to /api/projects/:id/feature_flags/', async () => {
    const fetch = makeFetch({ status: 200, body: { count: 0, results: [] } })
    const client = createClient({ config: CONFIG, opts: { fetchFn: fetch } })
    await client.listFeatureFlags({})
    const url = fetch.calls[0]!.url
    expect(url).toContain('/api/projects/')
    expect(url).toContain('/feature_flags/')
  })

  it('passes search, active, type, and limit as query params', async () => {
    const fetch = makeFetch({ status: 200, body: { count: 0, results: [] } })
    const client = createClient({ config: CONFIG, opts: { fetchFn: fetch } })
    await client.listFeatureFlags({
      search: 'checkout',
      active: 'true',
      type: 'boolean',
      limit: 25,
    })
    const url = fetch.calls[0]!.url
    expect(url).toContain('search=checkout')
    expect(url).toContain('active=true')
    expect(url).toContain('type=boolean')
    expect(url).toContain('limit=25')
  })

  it('omits query params when not provided', async () => {
    const fetch = makeFetch({ status: 200, body: { count: 0, results: [] } })
    const client = createClient({ config: CONFIG, opts: { fetchFn: fetch } })
    await client.listFeatureFlags({})
    const url = fetch.calls[0]!.url
    expect(url).not.toContain('undefined')
    expect(url).not.toContain('null')
  })
})

describe('posthog-client: getFeatureFlag', () => {
  it('sends GET to /api/projects/:id/feature_flags/123/', async () => {
    const fetch = makeFetch({ status: 200, body: { id: 123, key: 'my-flag', active: true } })
    const client = createClient({ config: CONFIG, opts: { fetchFn: fetch } })
    await client.getFeatureFlag(123)
    const url = fetch.calls[0]!.url
    expect(url).toContain('/api/projects/')
    expect(url).toContain('/feature_flags/123/')
  })

  it('returns parsed JSON body', async () => {
    const flag = { id: 123, key: 'my-flag', active: true, name: 'My Flag' }
    const fetch = makeFetch({ status: 200, body: flag })
    const client = createClient({ config: CONFIG, opts: { fetchFn: fetch } })
    const result = await client.getFeatureFlag(123)
    expect(result).toEqual(flag)
  })
})

describe('posthog-client: patchFeatureFlag', () => {
  it('sends PATCH with JSON body', async () => {
    const fetch = makeFetch({ status: 200, body: { id: 123, active: false } })
    const client = createClient({ config: CONFIG, opts: { fetchFn: fetch } })
    await client.patchFeatureFlag({ id: 123, body: { active: false } })
    expect(fetch.calls[0]!.options.method).toBe('PATCH')
    const body = JSON.parse(fetch.calls[0]!.options.body as string)
    expect(body).toEqual({ active: false })
  })
})

describe('posthog-client: createFeatureFlag', () => {
  it('sends POST with key and additional fields', async () => {
    const fetch = makeFetch({ status: 201, body: { id: 5, key: 'my-flag' } })
    const client = createClient({ config: CONFIG, opts: { fetchFn: fetch } })
    await client.createFeatureFlag({ key: 'my-flag', body: { name: 'My Flag', active: true } })
    expect(fetch.calls[0]!.options.method).toBe('POST')
    const body = JSON.parse(fetch.calls[0]!.options.body as string)
    expect(body.key).toBe('my-flag')
    expect(body.name).toBe('My Flag')
    expect(body.active).toBe(true)
  })
})

describe('posthog-client: getFeatureFlagActivity', () => {
  it('sends GET to /feature_flags/123/activity/?limit=10', async () => {
    const fetch = makeFetch({ status: 200, body: { results: [] } })
    const client = createClient({ config: CONFIG, opts: { fetchFn: fetch } })
    await client.getFeatureFlagActivity({ id: 123, limit: 10 })
    const url = fetch.calls[0]!.url
    expect(url).toContain('/feature_flags/123/')
    expect(url).toContain('/activity/')
    expect(url).toContain('limit=10')
  })

  it('applies default limit when not provided', async () => {
    const fetch = makeFetch({ status: 200, body: { results: [] } })
    const client = createClient({ config: CONFIG, opts: { fetchFn: fetch } })
    await client.getFeatureFlagActivity({ id: 123 })
    const url = fetch.calls[0]!.url
    expect(url).toContain('limit=')
    expect(url).not.toContain('limit=undefined')
  })
})
