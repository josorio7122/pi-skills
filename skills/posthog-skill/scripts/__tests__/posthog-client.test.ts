import { describe, it } from 'node:test'
import assert from 'node:assert/strict'

import { createClient, PostHogError } from '../lib/posthog-client.js'

const CONFIG = {
  host: 'https://us.posthog.com',
  projectId: '39507',
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
  (
    url: string,
    options: RequestInit,
  ): Promise<{ status: number; ok: boolean; json: () => Promise<unknown> }>
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
    const client = createClient(CONFIG, fetch)
    await client.listDashboards()
    assert.strictEqual(
      (fetch.calls[0]!.options.headers as Record<string, string>)['Authorization'],
      `Bearer ${CONFIG.token}`,
      'Authorization header must be set',
    )
  })

  it('sets Authorization: Bearer <token> on POST requests', async () => {
    const fetch = makeFetch({ status: 201, body: { id: 1 } })
    const client = createClient(CONFIG, fetch)
    await client.createDashboard('Test', [])
    assert.strictEqual(
      (fetch.calls[0]!.options.headers as Record<string, string>)['Authorization'],
      `Bearer ${CONFIG.token}`,
    )
  })
})

describe('posthog-client: Content-Type header', () => {
  it('sets Content-Type: application/json on POST requests', async () => {
    const fetch = makeFetch({ status: 201, body: { id: 1 } })
    const client = createClient(CONFIG, fetch)
    await client.createDashboard('Test', [])
    assert.strictEqual(
      (fetch.calls[0]!.options.headers as Record<string, string>)['Content-Type'],
      'application/json',
    )
  })

  it('sets Content-Type: application/json on PATCH requests', async () => {
    const fetch = makeFetch({ status: 200, body: { id: 1 } })
    const client = createClient(CONFIG, fetch)
    await client.patchDashboard(1, { deleted: true })
    assert.strictEqual(
      (fetch.calls[0]!.options.headers as Record<string, string>)['Content-Type'],
      'application/json',
    )
  })
})

describe('posthog-client: success responses', () => {
  it('returns parsed JSON body on 200', async () => {
    const fetch = makeFetch({ status: 200, body: { count: 5, results: [] } })
    const client = createClient(CONFIG, fetch)
    const result = await client.listDashboards()
    assert.deepStrictEqual(result, { count: 5, results: [] })
  })

  it('returns parsed JSON body on 201', async () => {
    const fetch = makeFetch({ status: 201, body: { id: 42, name: 'Test' } })
    const client = createClient(CONFIG, fetch)
    const result = await client.createDashboard('Test', [])
    assert.deepStrictEqual(result, { id: 42, name: 'Test' })
  })
})

describe('posthog-client: 429 retry logic', () => {
  it('retries on 429 and eventually succeeds', async () => {
    const fetch = makeFetch(
      { status: 429, body: {} },
      { status: 429, body: {} },
      { status: 200, body: { results: [] } },
    )
    const client = createClient(CONFIG, fetch, { retryDelayMs: 0 })
    const result = await client.listDashboards()
    assert.strictEqual(fetch.calls.length, 3, 'should call fetch 3 times')
    assert.deepStrictEqual(result, { results: [] })
  })

  it('throws PostHogError after 3 attempts when all return 429', async () => {
    const fetch = makeFetch(
      { status: 429, body: {} },
      { status: 429, body: {} },
      { status: 429, body: {} },
    )
    const client = createClient(CONFIG, fetch, { retryDelayMs: 0 })
    await assert.rejects(
      () => client.listDashboards(),
      (err) => {
        const e = err as PostHogError
        assert.strictEqual(e.name, 'PostHogError', 'error must be PostHogError')
        assert.strictEqual(e.status, 429)
        return true
      },
    )
    assert.strictEqual(fetch.calls.length, 3, 'should call fetch exactly 3 times')
  })

  it('does not retry more than 3 times', async () => {
    const fetch = makeFetch(
      { status: 429, body: {} },
      { status: 429, body: {} },
      { status: 429, body: {} },
      { status: 429, body: {} },
    )
    const client = createClient(CONFIG, fetch, { retryDelayMs: 0 })
    await assert.rejects(() => client.listDashboards())
    assert.strictEqual(fetch.calls.length, 3, 'must not exceed 3 attempts')
  })
})

describe('posthog-client: PostHogError on 4xx', () => {
  it('throws PostHogError with name "PostHogError" on 401', async () => {
    const fetch = makeFetch({ status: 401, body: { detail: 'Unauthorized' } })
    const client = createClient(CONFIG, fetch)
    await assert.rejects(
      () => client.listDashboards(),
      (err) => {
        const e = err as PostHogError
        assert.strictEqual(e.name, 'PostHogError')
        assert.strictEqual(e.status, 401)
        return true
      },
    )
  })

  it('throws PostHogError with status 403', async () => {
    const fetch = makeFetch({ status: 403, body: { detail: 'Forbidden' } })
    const client = createClient(CONFIG, fetch)
    await assert.rejects(
      () => client.listDashboards(),
      (err) => {
        const e = err as PostHogError
        assert.strictEqual(e.status, 403)
        return true
      },
    )
  })

  it('token does not appear in PostHogError.message', async () => {
    const fetch = makeFetch({ status: 401, body: { detail: 'bad token' } })
    const client = createClient(CONFIG, fetch)
    await assert.rejects(
      () => client.listDashboards(),
      (err) => {
        const e = err as PostHogError
        assert.ok(
          !e.message.includes(CONFIG.token),
          `token must not appear in error message: ${e.message}`,
        )
        return true
      },
    )
  })

  it('PostHogError has an endpoint property (path only, no token)', async () => {
    const fetch = makeFetch({ status: 404, body: {} })
    const client = createClient(CONFIG, fetch)
    await assert.rejects(
      () => client.getDashboard(999),
      (err) => {
        const e = err as PostHogError
        assert.ok(typeof e.endpoint === 'string', 'endpoint must be a string')
        assert.ok(!e.endpoint.includes(CONFIG.token), 'endpoint must not contain token')
        return true
      },
    )
  })
})

describe('posthog-client: 5xx does not retry', () => {
  it('throws PostHogError immediately on 500 without retry', async () => {
    const fetch = makeFetch(
      { status: 500, body: { detail: 'server error' } },
      { status: 200, body: {} },
    )
    const client = createClient(CONFIG, fetch, { retryDelayMs: 0 })
    await assert.rejects(
      () => client.listDashboards(),
      (err) => {
        const e = err as PostHogError
        assert.strictEqual(e.status, 500)
        return true
      },
    )
    assert.strictEqual(fetch.calls.length, 1, 'must not retry on 5xx')
  })
})

describe('posthog-client: runQuery body shape', () => {
  it('sends correct HogQL query body with refresh:blocking', async () => {
    const sql = 'SELECT event, count() FROM events GROUP BY event'
    const fetch = makeFetch({ status: 200, body: { results: [] } })
    const client = createClient(CONFIG, fetch)
    await client.runQuery(sql)
    const body = JSON.parse(fetch.calls[0]!.options.body as string) as {
      query: { kind: string; query: string }
      refresh: string
    }
    assert.deepStrictEqual(body, {
      query: {
        kind: 'HogQLQuery',
        query: sql,
      },
      refresh: 'blocking',
    })
  })
})

describe('posthog-client: getInsightByShortId URL', () => {
  it('uses /insights/?short_id= in the request URL', async () => {
    const fetch = makeFetch({ status: 200, body: { count: 1, results: [{ id: 1 }] } })
    const client = createClient(CONFIG, fetch)
    await client.getInsightByShortId('drOq2lO5')
    const url = fetch.calls[0]!.url
    assert.ok(url.includes('/insights/'), `URL must include /insights/: ${url}`)
    assert.ok(url.includes('short_id=drOq2lO5'), `URL must include short_id=drOq2lO5: ${url}`)
  })
})

describe('posthog-client: createInsight body shape', () => {
  it('POSTs name and query to /insights/', async () => {
    const query = { kind: 'TrendsQuery', series: [] }
    const fetch = makeFetch({ status: 201, body: { id: 10, name: 'My Insight' } })
    const client = createClient(CONFIG, fetch)
    await client.createInsight('My Insight', query)
    const url = fetch.calls[0]!.url
    const body = JSON.parse(fetch.calls[0]!.options.body as string) as {
      name: string
      query: Record<string, unknown>
    }
    assert.ok(url.includes('/insights/'), `URL must include /insights/: ${url}`)
    assert.strictEqual(body.name, 'My Insight')
    assert.deepStrictEqual(body.query, query)
  })
})

describe('posthog-client: listFeatureFlags URL and auth', () => {
  it('sends GET to /api/projects/:id/feature_flags/', async () => {
    const fetch = makeFetch({ status: 200, body: { count: 0, results: [] } })
    const client = createClient(CONFIG, fetch)
    await client.listFeatureFlags({})
    const url = fetch.calls[0]!.url
    assert.ok(url.includes('/api/projects/'), `must use projects base URL: ${url}`)
    assert.ok(!url.includes('/api/environments/'), `must NOT use environments base URL: ${url}`)
    assert.ok(url.includes('/feature_flags/'), `must include /feature_flags/: ${url}`)
  })

  it('sets Authorization Bearer header', async () => {
    const fetch = makeFetch({ status: 200, body: { count: 0, results: [] } })
    const client = createClient(CONFIG, fetch)
    await client.listFeatureFlags({})
    assert.strictEqual(
      (fetch.calls[0]!.options.headers as Record<string, string>)['Authorization'],
      `Bearer ${CONFIG.token}`,
    )
  })

  it('returns parsed JSON body', async () => {
    const body = { count: 2, results: [{ id: 1 }, { id: 2 }] }
    const fetch = makeFetch({ status: 200, body })
    const client = createClient(CONFIG, fetch)
    const result = await client.listFeatureFlags({})
    assert.deepStrictEqual(result, body)
  })
})

describe('posthog-client: listFeatureFlags query params', () => {
  it('passes search, active, type, and limit as query params when provided', async () => {
    const fetch = makeFetch({ status: 200, body: { count: 0, results: [] } })
    const client = createClient(CONFIG, fetch)
    await client.listFeatureFlags({
      search: 'checkout',
      active: 'true',
      type: 'boolean',
      limit: 25,
    })
    const url = fetch.calls[0]!.url
    assert.ok(url.includes('search=checkout'), `URL must include search=checkout: ${url}`)
    assert.ok(url.includes('active=true'), `URL must include active=true: ${url}`)
    assert.ok(url.includes('type=boolean'), `URL must include type=boolean: ${url}`)
    assert.ok(url.includes('limit=25'), `URL must include limit=25: ${url}`)
  })

  it('omits query params when not provided (no ?search=undefined)', async () => {
    const fetch = makeFetch({ status: 200, body: { count: 0, results: [] } })
    const client = createClient(CONFIG, fetch)
    await client.listFeatureFlags({})
    const url = fetch.calls[0]!.url
    assert.ok(!url.includes('undefined'), `URL must not contain "undefined": ${url}`)
    assert.ok(!url.includes('null'), `URL must not contain "null": ${url}`)
  })

  it('passes offset as query param when provided', async () => {
    const fetch = makeFetch({ status: 200, body: { count: 0, results: [] } })
    const client = createClient(CONFIG, fetch)
    await client.listFeatureFlags({ offset: 50, limit: 25 })
    const url = fetch.calls[0]!.url
    assert.ok(url.includes('offset=50'), `URL must include offset=50: ${url}`)
  })
})

describe('posthog-client: getFeatureFlag', () => {
  it('sends GET to /api/projects/:id/feature_flags/123/', async () => {
    const fetch = makeFetch({ status: 200, body: { id: 123, key: 'my-flag', active: true } })
    const client = createClient(CONFIG, fetch)
    await client.getFeatureFlag(123)
    const url = fetch.calls[0]!.url
    assert.ok(url.includes('/api/projects/'), `must use projects base URL: ${url}`)
    assert.ok(!url.includes('/api/environments/'), `must NOT use environments base URL: ${url}`)
    assert.ok(url.includes('/feature_flags/123/'), `must include /feature_flags/123/: ${url}`)
  })

  it('returns parsed JSON body (single flag object)', async () => {
    const flag = { id: 123, key: 'my-flag', active: true, name: 'My Flag' }
    const fetch = makeFetch({ status: 200, body: flag })
    const client = createClient(CONFIG, fetch)
    const result = await client.getFeatureFlag(123)
    assert.deepStrictEqual(result, flag)
  })

  it('sets Authorization Bearer header', async () => {
    const fetch = makeFetch({ status: 200, body: { id: 1 } })
    const client = createClient(CONFIG, fetch)
    await client.getFeatureFlag(1)
    assert.strictEqual(
      (fetch.calls[0]!.options.headers as Record<string, string>)['Authorization'],
      `Bearer ${CONFIG.token}`,
    )
  })
})

describe('posthog-client: patchFeatureFlag', () => {
  it('sends PATCH to /api/projects/:id/feature_flags/123/', async () => {
    const fetch = makeFetch({ status: 200, body: { id: 123, active: false } })
    const client = createClient(CONFIG, fetch)
    await client.patchFeatureFlag(123, { active: false })
    const url = fetch.calls[0]!.url
    assert.ok(url.includes('/api/projects/'), `must use projects base URL: ${url}`)
    assert.ok(!url.includes('/api/environments/'), `must NOT use environments base URL: ${url}`)
    assert.ok(url.includes('/feature_flags/123/'), `must include /feature_flags/123/: ${url}`)
    assert.strictEqual(fetch.calls[0]!.options.method, 'PATCH')
  })

  it('includes JSON body with provided fields', async () => {
    const fetch = makeFetch({ status: 200, body: { id: 123, active: false } })
    const client = createClient(CONFIG, fetch)
    await client.patchFeatureFlag(123, { active: false })
    const body = JSON.parse(fetch.calls[0]!.options.body as string) as { active: boolean }
    assert.deepStrictEqual(body, { active: false })
  })

  it('sets Content-Type: application/json', async () => {
    const fetch = makeFetch({ status: 200, body: { id: 1 } })
    const client = createClient(CONFIG, fetch)
    await client.patchFeatureFlag(1, { name: 'Updated' })
    assert.strictEqual(
      (fetch.calls[0]!.options.headers as Record<string, string>)['Content-Type'],
      'application/json',
    )
  })

  it('sets Authorization Bearer header', async () => {
    const fetch = makeFetch({ status: 200, body: { id: 1 } })
    const client = createClient(CONFIG, fetch)
    await client.patchFeatureFlag(1, { active: true })
    assert.strictEqual(
      (fetch.calls[0]!.options.headers as Record<string, string>)['Authorization'],
      `Bearer ${CONFIG.token}`,
    )
  })
})

describe('posthog-client: createFeatureFlag', () => {
  it('sends POST to /api/projects/:id/feature_flags/', async () => {
    const fetch = makeFetch({ status: 201, body: { id: 5, key: 'new-flag', active: false } })
    const client = createClient(CONFIG, fetch)
    await client.createFeatureFlag('new-flag', { name: 'New Flag' })
    const url = fetch.calls[0]!.url
    assert.ok(url.includes('/api/projects/'), `must use projects base URL: ${url}`)
    assert.ok(!url.includes('/api/environments/'), `must NOT use environments base URL: ${url}`)
    assert.ok(url.includes('/feature_flags/'), `must include /feature_flags/: ${url}`)
    assert.strictEqual(fetch.calls[0]!.options.method, 'POST')
  })

  it('body includes key and additional fields from body param', async () => {
    const fetch = makeFetch({ status: 201, body: { id: 5, key: 'my-flag' } })
    const client = createClient(CONFIG, fetch)
    await client.createFeatureFlag('my-flag', { name: 'My Flag', active: true })
    const body = JSON.parse(fetch.calls[0]!.options.body as string) as {
      key: string
      name: string
      active: boolean
    }
    assert.strictEqual(body.key, 'my-flag')
    assert.strictEqual(body.name, 'My Flag')
    assert.strictEqual(body.active, true)
  })

  it('sets Content-Type: application/json', async () => {
    const fetch = makeFetch({ status: 201, body: { id: 5 } })
    const client = createClient(CONFIG, fetch)
    await client.createFeatureFlag('flag-key', {})
    assert.strictEqual(
      (fetch.calls[0]!.options.headers as Record<string, string>)['Content-Type'],
      'application/json',
    )
  })

  it('sets Authorization Bearer header', async () => {
    const fetch = makeFetch({ status: 201, body: { id: 5 } })
    const client = createClient(CONFIG, fetch)
    await client.createFeatureFlag('flag-key', {})
    assert.strictEqual(
      (fetch.calls[0]!.options.headers as Record<string, string>)['Authorization'],
      `Bearer ${CONFIG.token}`,
    )
  })
})

describe('posthog-client: getFeatureFlagActivity', () => {
  it('sends GET to /api/projects/:id/feature_flags/123/activity/?limit=10', async () => {
    const fetch = makeFetch({ status: 200, body: { results: [] } })
    const client = createClient(CONFIG, fetch)
    await client.getFeatureFlagActivity(123, 10)
    const url = fetch.calls[0]!.url
    assert.ok(url.includes('/api/projects/'), `must use projects base URL: ${url}`)
    assert.ok(!url.includes('/api/environments/'), `must NOT use environments base URL: ${url}`)
    assert.ok(url.includes('/feature_flags/123/'), `must include /feature_flags/123/: ${url}`)
    assert.ok(url.includes('/activity/'), `must include /activity/: ${url}`)
    assert.ok(url.includes('limit=10'), `must include limit=10: ${url}`)
  })

  it('returns parsed JSON body', async () => {
    const body = { results: [{ id: 1, activity: 'created' }] }
    const fetch = makeFetch({ status: 200, body })
    const client = createClient(CONFIG, fetch)
    const result = await client.getFeatureFlagActivity(123, 10)
    assert.deepStrictEqual(result, body)
  })

  it('applies default limit when not provided', async () => {
    const fetch = makeFetch({ status: 200, body: { results: [] } })
    const client = createClient(CONFIG, fetch)
    await client.getFeatureFlagActivity(123)
    const url = fetch.calls[0]!.url
    assert.ok(url.includes('limit='), `URL must include a limit param: ${url}`)
    assert.ok(!url.includes('limit=undefined'), `limit must not be undefined: ${url}`)
  })

  it('sets Authorization Bearer header', async () => {
    const fetch = makeFetch({ status: 200, body: { results: [] } })
    const client = createClient(CONFIG, fetch)
    await client.getFeatureFlagActivity(123, 10)
    assert.strictEqual(
      (fetch.calls[0]!.options.headers as Record<string, string>)['Authorization'],
      `Bearer ${CONFIG.token}`,
    )
  })
})
