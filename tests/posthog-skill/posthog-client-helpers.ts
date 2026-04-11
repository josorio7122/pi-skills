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

export function makeFetch(...responses: MockResponse[]) {
  let call = 0
  const calls: MockCall[] = []
  const fetch = async (url: string, options: RequestInit): Promise<MinimalResponse> => {
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
  return { fetch, calls }
}
