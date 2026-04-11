import { PostHogError } from './posthog-error.js'
import type {
  ClientOptions,
  CreateInsightOnDashboardParams,
  Dashboard,
  DashboardListResponse,
  FeatureFlagActivityResponse,
  FeatureFlagListParams,
  FeatureFlagListResponse,
  FeatureFlagSummary,
  FetchFn,
  HogQLResult,
  Insight,
  InsightListResponse,
  PostHogClient,
  PostHogConfig,
} from './posthog-types.js'

function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms))
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function parseErrorDetail(response: { json(): Promise<unknown> }) {
  return response
    .json()
    .then((body) => {
      if (!isRecord(body)) return ''
      return (
        (typeof body.detail === 'string' && body.detail) || (typeof body.message === 'string' && body.message) || ''
      )
    })
    .catch(() => '')
}

interface RequestContext {
  readonly fetchFn: FetchFn
  readonly token: string | undefined
  readonly host: string
  readonly baseDelayMs: number
}

async function requestWithRetry(ctx: RequestContext, req: { url: string; options: RequestInit }) {
  const { url, options } = req
  const endpoint = url.replace(ctx.host, '').split('?')[0] ?? url
  const MAX_ATTEMPTS = 3

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const response = await ctx.fetchFn(url, {
      ...options,
      headers: {
        ...(ctx.token ? { Authorization: `Bearer ${ctx.token}` } : {}),
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
        ...(options.headers ?? {}),
      },
    })

    if (response.ok) return response.json()

    if (response.status === 429) {
      if (attempt < MAX_ATTEMPTS - 1) {
        await sleep(ctx.baseDelayMs * Math.pow(2, attempt))
        continue
      }
      throw new PostHogError({
        status: 429,
        message: 'PostHog rate limit exceeded (retries exhausted)',
        endpoint,
      })
    }

    if (response.status >= 500) {
      throw new PostHogError({
        status: response.status,
        message: `PostHog server error (${response.status}) on ${endpoint}`,
        endpoint,
      })
    }

    const detail = await parseErrorDetail(response)
    throw new PostHogError({
      status: response.status,
      message: `PostHog returned ${response.status} on ${endpoint}${detail ? ': ' + detail : ''}`,
      endpoint,
    })
  }

  // Unreachable — the loop always returns or throws — but satisfies the type checker
  throw new PostHogError({ status: 429, message: 'PostHog rate limit exceeded (retries exhausted)', endpoint: url })
}

export function createClient({
  config,
  opts,
}: {
  readonly config: PostHogConfig
  readonly opts?: ClientOptions
}): PostHogClient {
  const fetchFn: FetchFn = opts?.fetchFn ?? (globalThis.fetch as FetchFn)
  const baseDelayMs = opts?.retryDelayMs ?? 1000

  const { host, projectId, token } = config
  const envBase = `${host}/api/environments/${projectId}`
  const projBase = `${host}/api/projects/${projectId}`
  const ctx: RequestContext = { fetchFn, token, host, baseDelayMs }

  // Returns Promise<unknown>. Each client method casts the result to a concrete API type.
  // This is an intentional trade-off: the PostHog API contract is trusted at this boundary.
  // If runtime validation becomes needed, add a validate() wrapper per method.
  function request(url: string, options: RequestInit) {
    return requestWithRetry(ctx, { url, options })
  }

  return {
    request,

    listDashboards: (limit = 100) =>
      request(`${envBase}/dashboards/?limit=${limit}`, { method: 'GET' }) as Promise<DashboardListResponse>,

    createDashboard: ({ name, tags }) =>
      request(`${envBase}/dashboards/`, {
        method: 'POST',
        body: JSON.stringify({ name, tags }),
      }) as Promise<Dashboard>,

    getDashboard: (id) => request(`${envBase}/dashboards/${id}/`, { method: 'GET' }) as Promise<Dashboard>,

    createInsight: ({ name, query }) =>
      request(`${envBase}/insights/`, {
        method: 'POST',
        body: JSON.stringify({ name, query }),
      }) as Promise<Insight>,

    createInsightOnDashboard: ({ name, query, dashboardId }: CreateInsightOnDashboardParams) =>
      request(`${envBase}/insights/`, {
        method: 'POST',
        body: JSON.stringify({ name, query, dashboards: [dashboardId] }),
      }) as Promise<Insight>,

    getInsightByShortId: (shortId) =>
      request(`${envBase}/insights/?short_id=${encodeURIComponent(shortId)}`, {
        method: 'GET',
      }) as Promise<InsightListResponse>,

    runQuery: (hogql) =>
      request(`${projBase}/query/`, {
        method: 'POST',
        body: JSON.stringify({ query: { kind: 'HogQLQuery', query: hogql }, refresh: 'blocking' }),
      }) as Promise<HogQLResult>,

    listFeatureFlags: (params: FeatureFlagListParams = {}) => {
      const qs = new URLSearchParams()
      if (params.search) qs.append('search', params.search)
      if (params.active) qs.append('active', params.active)
      if (params.type) qs.append('type', params.type)
      if (params.limit != null) qs.append('limit', String(params.limit))
      if (params.offset != null) qs.append('offset', String(params.offset))
      const suffix = qs.size > 0 ? `?${qs.toString()}` : ''
      return request(`${projBase}/feature_flags/${suffix}`, { method: 'GET' }) as Promise<FeatureFlagListResponse>
    },

    getFeatureFlag: (id) =>
      request(`${projBase}/feature_flags/${id}/`, { method: 'GET' }) as Promise<FeatureFlagSummary>,

    patchFeatureFlag: ({ id, body }) =>
      request(`${projBase}/feature_flags/${id}/`, {
        method: 'PATCH',
        body: JSON.stringify(body),
      }) as Promise<FeatureFlagSummary>,

    createFeatureFlag: ({ key, body = {} }) =>
      request(`${projBase}/feature_flags/`, {
        method: 'POST',
        body: JSON.stringify({ key, ...body }),
      }) as Promise<FeatureFlagSummary>,

    getFeatureFlagActivity: ({ id, limit }) =>
      request(`${projBase}/feature_flags/${id}/activity/?limit=${limit ?? 10}`, {
        method: 'GET',
      }) as Promise<FeatureFlagActivityResponse>,
  }
}
