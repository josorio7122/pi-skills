import { describe, expect, it } from 'vitest'
import { createClient } from '../../skills/posthog-skill/scripts/lib/posthog-client.js'
import { CONFIG, makeFetch } from './posthog-client-helpers.js'

describe('posthog-client: Authorization header', () => {
  it('sets Authorization: Bearer <token> on GET requests', async () => {
    const { fetch, calls } = makeFetch({ status: 200, body: { results: [] } })
    const client = createClient({ config: CONFIG, opts: { fetchFn: fetch } })
    await client.listDashboards()
    expect((calls[0]!.options.headers as Record<string, string>).Authorization).toBe(`Bearer ${CONFIG.token}`)
  })

  it('sets Authorization: Bearer <token> on POST requests', async () => {
    const { fetch, calls } = makeFetch({ status: 201, body: { id: 1 } })
    const client = createClient({ config: CONFIG, opts: { fetchFn: fetch } })
    await client.createDashboard({ name: 'Test', tags: [] })
    expect((calls[0]!.options.headers as Record<string, string>).Authorization).toBe(`Bearer ${CONFIG.token}`)
  })

  it('omits Authorization header when token is undefined', async () => {
    const { fetch, calls } = makeFetch({ status: 200, body: { results: [] } })
    const config = { ...CONFIG, token: undefined }
    const client = createClient({ config, opts: { fetchFn: fetch } })
    await client.listDashboards()
    expect((calls[0]!.options.headers as Record<string, string>).Authorization).toBeUndefined()
  })
})

describe('posthog-client: Content-Type header', () => {
  it('sets Content-Type: application/json on POST requests', async () => {
    const { fetch, calls } = makeFetch({ status: 201, body: { id: 1 } })
    const client = createClient({ config: CONFIG, opts: { fetchFn: fetch } })
    await client.createDashboard({ name: 'Test', tags: [] })
    expect((calls[0]!.options.headers as Record<string, string>)['Content-Type']).toBe('application/json')
  })
})

describe('posthog-client: success responses', () => {
  it('returns parsed JSON body on 200', async () => {
    const { fetch } = makeFetch({ status: 200, body: { count: 5, results: [] } })
    const client = createClient({ config: CONFIG, opts: { fetchFn: fetch } })
    const result = await client.listDashboards()
    expect(result).toEqual({ count: 5, results: [] })
  })

  it('returns parsed JSON body on 201', async () => {
    const { fetch } = makeFetch({ status: 201, body: { id: 42, name: 'Test' } })
    const client = createClient({ config: CONFIG, opts: { fetchFn: fetch } })
    const result = await client.createDashboard({ name: 'Test', tags: [] })
    expect(result).toEqual({ id: 42, name: 'Test' })
  })
})
