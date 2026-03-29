// ---------------------------------------------------------------------------
// PostHogError — typed error for non-2xx HTTP responses
// ---------------------------------------------------------------------------

export class PostHogError extends Error {
	readonly status: number
	readonly endpoint: string

	constructor(opts: { status: number; message: string; endpoint: string }) {
		super(opts.message)
		this.name = 'PostHogError'
		this.status = opts.status
		this.endpoint = opts.endpoint
	}
}

// ---------------------------------------------------------------------------
// Config & client option types
// ---------------------------------------------------------------------------

export interface PostHogConfig {
	host: string
	projectId: string
	token: string
}

export interface ClientOptions {
	retryDelayMs?: number
}

// ---------------------------------------------------------------------------
// Fetch abstraction (permissive for test mocks)
// ---------------------------------------------------------------------------

export interface MinimalResponse {
	status: number
	ok: boolean
	json(): Promise<unknown>
}

export type FetchFn = (url: string, options: RequestInit) => Promise<MinimalResponse>

// ---------------------------------------------------------------------------
// Dashboard types
// ---------------------------------------------------------------------------

export interface DashboardSummary {
	id: number
	name: string
	deleted: boolean
	[key: string]: unknown
}

export interface DashboardListResponse {
	count: number
	results: DashboardSummary[]
}

export interface DashboardTile {
	insight: { id: number; name: string } | null
	[key: string]: unknown
}

export interface Dashboard {
	id: number
	name: string
	tiles: DashboardTile[]
	[key: string]: unknown
}

// ---------------------------------------------------------------------------
// Insight types
// ---------------------------------------------------------------------------

export interface InsightQuerySource {
	kind: string
	series?: unknown[]
	breakdownFilter?: Record<string, unknown>
	dateRange?: Record<string, unknown>
	funnelsFilter?: Record<string, unknown>
	trendsFilter?: Record<string, unknown>
	[key: string]: unknown
}

export interface InsightVizNode {
	kind: 'InsightVizNode'
	source: InsightQuerySource
	[key: string]: unknown
}

export interface Insight {
	id: number
	name: string
	short_id?: string
	description?: string | null
	query?: InsightVizNode | InsightQuerySource | Record<string, unknown>
	filters?: Record<string, unknown>
	[key: string]: unknown
}

export interface InsightListResponse {
	count: number
	results: Insight[]
}

export interface HogQLResult {
	results: unknown[][]
	is_cached?: boolean
	[key: string]: unknown
}

// ---------------------------------------------------------------------------
// Feature flag types
// ---------------------------------------------------------------------------

export interface FeatureFlagSummary {
	id: number
	name: string
	key: string
	active: boolean
	deleted: boolean
	created_at: string
	updated_at: string
	tags: string[]
	filters: Record<string, unknown>
	version: number
	created_by: { id: number; email: string } | null
	ensure_experience_continuity: boolean
	is_remote_configuration: boolean
	evaluation_runtime: string
	status: string
}

export interface FeatureFlagListResponse {
	count: number
	next: string | null
	previous: string | null
	results: FeatureFlagSummary[]
}

export interface FeatureFlagListParams {
	search?: string
	active?: string
	type?: string
	limit?: number
	offset?: number
}

export interface FeatureFlagActivity {
	id: string
	activity: string
	detail: Record<string, unknown>
	created_at: string
	user: Record<string, unknown>
}

export interface FeatureFlagActivityResponse {
	results: FeatureFlagActivity[]
	next: string | null
	previous: string | null
	total_count: number
}

// ---------------------------------------------------------------------------
// Client interface
// ---------------------------------------------------------------------------

export interface PostHogClient {
	request(url: string, options: RequestInit): Promise<unknown>
	listDashboards(limit?: number): Promise<DashboardListResponse>
	createDashboard(name: string, tags: string[]): Promise<Dashboard>
	getDashboard(id: number): Promise<Dashboard>
	createInsight(name: string, query: Record<string, unknown>): Promise<Insight>
	createInsightOnDashboard(
		name: string,
		query: Record<string, unknown>,
		dashboardId: number,
	): Promise<Insight>
	getInsightByShortId(shortId: string): Promise<InsightListResponse>
	runQuery(hogql: string): Promise<HogQLResult>
	listFeatureFlags(params?: FeatureFlagListParams): Promise<FeatureFlagListResponse>
	getFeatureFlag(id: number | string): Promise<FeatureFlagSummary>
	patchFeatureFlag(id: number | string, body: Record<string, unknown>): Promise<FeatureFlagSummary>
	createFeatureFlag(key: string, body?: Record<string, unknown>): Promise<FeatureFlagSummary>
	getFeatureFlagActivity(id: number | string, limit?: number): Promise<FeatureFlagActivityResponse>
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms))
}

// ---------------------------------------------------------------------------
// Client factory
// ---------------------------------------------------------------------------

export function createClient(
	config: PostHogConfig,
	fetchFn?: FetchFn,
	opts?: ClientOptions,
): PostHogClient {
	const fetch: FetchFn = fetchFn ?? (globalThis.fetch as FetchFn)
	const baseDelayMs = opts?.retryDelayMs ?? 1000

	const { host, projectId, token } = config
	const envBase = `${host}/api/environments/${projectId}`
	const projBase = `${host}/api/projects/${projectId}`

	// -------------------------------------------------------------------------
	// Core request method with 429 retry / error handling
	// -------------------------------------------------------------------------

	async function request(url: string, options: RequestInit): Promise<unknown> {
		const endpoint = url.replace(host, '').split('?')[0] ?? url

		const MAX_ATTEMPTS = 3
		let lastError: PostHogError | undefined

		for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
			const response = await fetch(url, {
				...options,
				headers: {
					Authorization: `Bearer ${token}`,
					...(options.body ? { 'Content-Type': 'application/json' } : {}),
					...(options.headers ?? {}),
				},
			})

			if (response.ok) {
				return response.json()
			}

			// 429 — rate limited: retry with exponential backoff
			if (response.status === 429) {
				const delayMs = baseDelayMs * Math.pow(2, attempt)
				lastError = new PostHogError({
					status: 429,
					message: `PostHog rate limit exceeded (attempt ${attempt + 1} of ${MAX_ATTEMPTS})`,
					endpoint,
				})
				if (attempt < MAX_ATTEMPTS - 1) {
					await sleep(delayMs)
					continue
				}
				throw lastError
			}

			// 5xx — server error: throw immediately, no retry
			if (response.status >= 500) {
				throw new PostHogError({
					status: response.status,
					message: `PostHog server error (${response.status}) on ${endpoint}`,
					endpoint,
				})
			}

			// 4xx (not 429) — client error: throw immediately
			let detail = ''
			try {
				const body = (await response.json()) as { detail?: string; message?: string }
				detail = body.detail ?? body.message ?? ''
			} catch (_) {
				// ignore parse error
			}
			throw new PostHogError({
				status: response.status,
				message: `PostHog returned ${response.status} on ${endpoint}${detail ? ': ' + detail : ''}`,
				endpoint,
			})
		}

		// Exhausted retries (always set when we reach this point via 429 path)
		throw lastError!
	}

	// -------------------------------------------------------------------------
	// Public API methods
	// -------------------------------------------------------------------------

	function listDashboards(limit = 100): Promise<DashboardListResponse> {
		return request(`${envBase}/dashboards/?limit=${limit}`, {
			method: 'GET',
		}) as Promise<DashboardListResponse>
	}

	function createDashboard(name: string, tags: string[]): Promise<Dashboard> {
		return request(`${envBase}/dashboards/`, {
			method: 'POST',
			body: JSON.stringify({ name, tags }),
		}) as Promise<Dashboard>
	}

	function getDashboard(id: number): Promise<Dashboard> {
		return request(`${envBase}/dashboards/${id}/`, {
			method: 'GET',
		}) as Promise<Dashboard>
	}

	function createInsight(name: string, query: Record<string, unknown>): Promise<Insight> {
		return request(`${envBase}/insights/`, {
			method: 'POST',
			body: JSON.stringify({ name, query }),
		}) as Promise<Insight>
	}

	function createInsightOnDashboard(
		name: string,
		query: Record<string, unknown>,
		dashboardId: number,
	): Promise<Insight> {
		return request(`${envBase}/insights/`, {
			method: 'POST',
			body: JSON.stringify({ name, query, dashboards: [dashboardId] }),
		}) as Promise<Insight>
	}

	function getInsightByShortId(shortId: string): Promise<InsightListResponse> {
		return request(`${envBase}/insights/?short_id=${encodeURIComponent(shortId)}`, {
			method: 'GET',
		}) as Promise<InsightListResponse>
	}

	function runQuery(hogql: string): Promise<HogQLResult> {
		return request(`${projBase}/query/`, {
			method: 'POST',
			body: JSON.stringify({
				query: {
					kind: 'HogQLQuery',
					query: hogql,
				},
				refresh: 'blocking',
			}),
		}) as Promise<HogQLResult>
	}

	function listFeatureFlags(params: FeatureFlagListParams = {}): Promise<FeatureFlagListResponse> {
		const qs = new URLSearchParams()
		if (params.search != null && params.search !== '') qs.append('search', params.search)
		if (params.active != null && params.active !== '') qs.append('active', params.active)
		if (params.type != null && params.type !== '') qs.append('type', params.type)
		if (params.limit != null) qs.append('limit', String(params.limit))
		if (params.offset != null) qs.append('offset', String(params.offset))
		const query = qs.toString() ? `?${qs.toString()}` : ''
		return request(`${projBase}/feature_flags/${query}`, {
			method: 'GET',
		}) as Promise<FeatureFlagListResponse>
	}

	function getFeatureFlag(id: number | string): Promise<FeatureFlagSummary> {
		return request(`${projBase}/feature_flags/${id}/`, {
			method: 'GET',
		}) as Promise<FeatureFlagSummary>
	}

	function patchFeatureFlag(
		id: number | string,
		body: Record<string, unknown>,
	): Promise<FeatureFlagSummary> {
		return request(`${projBase}/feature_flags/${id}/`, {
			method: 'PATCH',
			body: JSON.stringify(body),
		}) as Promise<FeatureFlagSummary>
	}

	function createFeatureFlag(
		key: string,
		body: Record<string, unknown> = {},
	): Promise<FeatureFlagSummary> {
		return request(`${projBase}/feature_flags/`, {
			method: 'POST',
			body: JSON.stringify({ key, ...body }),
		}) as Promise<FeatureFlagSummary>
	}

	function getFeatureFlagActivity(
		id: number | string,
		limit?: number,
	): Promise<FeatureFlagActivityResponse> {
		return request(`${projBase}/feature_flags/${id}/activity/?limit=${limit ?? 10}`, {
			method: 'GET',
		}) as Promise<FeatureFlagActivityResponse>
	}

	return {
		request,
		listDashboards,
		createDashboard,
		getDashboard,
		createInsight,
		createInsightOnDashboard,
		getInsightByShortId,
		runQuery,
		listFeatureFlags,
		getFeatureFlag,
		patchFeatureFlag,
		createFeatureFlag,
		getFeatureFlagActivity,
	}
}
