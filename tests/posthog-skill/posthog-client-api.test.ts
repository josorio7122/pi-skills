import { describe, expect, it } from 'vitest'
import { createClient } from '../../skills/posthog-skill/scripts/lib/posthog-client.js'
import { CONFIG, makeFetch } from './posthog-client-helpers.js'

describe('posthog-client: runQuery body shape', () => {
  it('sends correct HogQL query body with refresh:blocking', async () => {
    const sql = 'SELECT event, count() FROM events GROUP BY event'
    const { fetch, calls } = makeFetch({ status: 200, body: { results: [] } })
    const client = createClient({ config: CONFIG, opts: { fetchFn: fetch } })
    await client.runQuery(sql)
    const body = JSON.parse(calls[0]!.options.body as string)
    expect(body).toEqual({
      query: { kind: 'HogQLQuery', query: sql },
      refresh: 'blocking',
    })
  })
})

describe('posthog-client: listFeatureFlags', () => {
  it('sends GET to /api/projects/:id/feature_flags/', async () => {
    const { fetch, calls } = makeFetch({ status: 200, body: { count: 0, results: [] } })
    const client = createClient({ config: CONFIG, opts: { fetchFn: fetch } })
    await client.listFeatureFlags({})
    const url = calls[0]!.url
    expect(url).toContain('/api/projects/')
    expect(url).toContain('/feature_flags/')
  })

  it('passes search, active, type, and limit as query params', async () => {
    const { fetch, calls } = makeFetch({ status: 200, body: { count: 0, results: [] } })
    const client = createClient({ config: CONFIG, opts: { fetchFn: fetch } })
    await client.listFeatureFlags({
      search: 'checkout',
      active: 'true',
      type: 'boolean',
      limit: 25,
    })
    const url = calls[0]!.url
    expect(url).toContain('search=checkout')
    expect(url).toContain('active=true')
    expect(url).toContain('type=boolean')
    expect(url).toContain('limit=25')
  })

  it('omits query params when not provided', async () => {
    const { fetch, calls } = makeFetch({ status: 200, body: { count: 0, results: [] } })
    const client = createClient({ config: CONFIG, opts: { fetchFn: fetch } })
    await client.listFeatureFlags({})
    const url = calls[0]!.url
    expect(url).not.toContain('undefined')
    expect(url).not.toContain('null')
  })
})

describe('posthog-client: getFeatureFlag', () => {
  it('sends GET to /api/projects/:id/feature_flags/123/', async () => {
    const { fetch, calls } = makeFetch({ status: 200, body: { id: 123, key: 'my-flag', active: true } })
    const client = createClient({ config: CONFIG, opts: { fetchFn: fetch } })
    await client.getFeatureFlag(123)
    const url = calls[0]!.url
    expect(url).toContain('/api/projects/')
    expect(url).toContain('/feature_flags/123/')
  })

  it('returns parsed JSON body', async () => {
    const flag = { id: 123, key: 'my-flag', active: true, name: 'My Flag' }
    const { fetch } = makeFetch({ status: 200, body: flag })
    const client = createClient({ config: CONFIG, opts: { fetchFn: fetch } })
    const result = await client.getFeatureFlag(123)
    expect(result).toEqual(flag)
  })
})

describe('posthog-client: patchFeatureFlag', () => {
  it('sends PATCH with JSON body', async () => {
    const { fetch, calls } = makeFetch({ status: 200, body: { id: 123, active: false } })
    const client = createClient({ config: CONFIG, opts: { fetchFn: fetch } })
    await client.patchFeatureFlag({ id: 123, body: { active: false } })
    expect(calls[0]!.options.method).toBe('PATCH')
    const body = JSON.parse(calls[0]!.options.body as string)
    expect(body).toEqual({ active: false })
  })
})

describe('posthog-client: createFeatureFlag', () => {
  it('sends POST with key and additional fields', async () => {
    const { fetch, calls } = makeFetch({ status: 201, body: { id: 5, key: 'my-flag' } })
    const client = createClient({ config: CONFIG, opts: { fetchFn: fetch } })
    await client.createFeatureFlag({ key: 'my-flag', body: { name: 'My Flag', active: true } })
    expect(calls[0]!.options.method).toBe('POST')
    const body = JSON.parse(calls[0]!.options.body as string)
    expect(body.key).toBe('my-flag')
    expect(body.name).toBe('My Flag')
    expect(body.active).toBe(true)
  })
})

describe('posthog-client: patchFeatureFlag returns updated flag', () => {
  it('returns the full flag object from the PATCH response', async () => {
    const updated = { id: 101, key: 'my-flag', active: false, name: 'My Flag' }
    const { fetch } = makeFetch({ status: 200, body: updated })
    const client = createClient({ config: CONFIG, opts: { fetchFn: fetch } })
    const result = await client.patchFeatureFlag({ id: 101, body: { active: false } })
    expect(result.active).toBe(false)
    expect(result.id).toBe(101)
  })
})

describe('posthog-client: getFeatureFlagActivity', () => {
  it('sends GET to /feature_flags/123/activity/?limit=10', async () => {
    const { fetch, calls } = makeFetch({ status: 200, body: { results: [] } })
    const client = createClient({ config: CONFIG, opts: { fetchFn: fetch } })
    await client.getFeatureFlagActivity({ id: 123, limit: 10 })
    const url = calls[0]!.url
    expect(url).toContain('/feature_flags/123/')
    expect(url).toContain('/activity/')
    expect(url).toContain('limit=10')
  })

  it('applies default limit when not provided', async () => {
    const { fetch, calls } = makeFetch({ status: 200, body: { results: [] } })
    const client = createClient({ config: CONFIG, opts: { fetchFn: fetch } })
    await client.getFeatureFlagActivity({ id: 123 })
    const url = calls[0]!.url
    expect(url).toContain('limit=')
    expect(url).not.toContain('limit=undefined')
  })
})
