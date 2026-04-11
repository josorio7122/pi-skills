import type { MinimalResponse } from '../../skills/posthog-skill/scripts/lib/posthog-types.js'

export const CONFIG = {
  host: 'https://us.posthog.com',
  projectId: 'test-project-123',
  token: 'phx_test_token_abc123',
}

export interface MockCall {
  url: string
  options: RequestInit
}

export interface MockResponse {
  status?: number
  body?: Record<string, unknown>
}

export interface MockFetchFn {
  (url: string, options: RequestInit): Promise<MinimalResponse>
  calls: MockCall[]
}

export function makeFetch(...responses: MockResponse[]): MockFetchFn {
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
