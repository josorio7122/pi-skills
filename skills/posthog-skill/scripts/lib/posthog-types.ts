// ---------------------------------------------------------------------------
// Config & client option types
// ---------------------------------------------------------------------------

export interface PostHogConfig {
  readonly host: string
  readonly projectId: string
  readonly token: string | undefined
}

export interface ClientOptions {
  readonly fetchFn?: FetchFn
  readonly retryDelayMs?: number
}

// ---------------------------------------------------------------------------
// Fetch abstraction (permissive for test mocks)
// ---------------------------------------------------------------------------

export interface MinimalResponse {
  readonly status: number
  readonly ok: boolean
  json(): Promise<unknown>
}

export type FetchFn = (url: string, options: RequestInit) => Promise<MinimalResponse>

// ---------------------------------------------------------------------------
// Dashboard types
// ---------------------------------------------------------------------------

export interface DashboardSummary {
  readonly id: number
  readonly name: string
  readonly deleted: boolean
  readonly [key: string]: unknown
}

export interface DashboardListResponse {
  readonly count: number
  readonly results: readonly DashboardSummary[]
}

export interface DashboardTile {
  readonly insight: { readonly id: number; readonly name: string } | null
  readonly [key: string]: unknown
}

export interface Dashboard {
  readonly id: number
  readonly name: string
  readonly tiles: readonly DashboardTile[]
  readonly [key: string]: unknown
}

// ---------------------------------------------------------------------------
// Insight types
// ---------------------------------------------------------------------------

export interface InsightQuerySource {
  readonly kind: string
  readonly series?: readonly unknown[]
  readonly breakdownFilter?: Readonly<Record<string, unknown>>
  readonly dateRange?: Readonly<Record<string, unknown>>
  readonly funnelsFilter?: Readonly<Record<string, unknown>>
  readonly trendsFilter?: Readonly<Record<string, unknown>>
  readonly [key: string]: unknown
}

export interface InsightVizNode {
  readonly kind: 'InsightVizNode'
  readonly source: InsightQuerySource
  readonly [key: string]: unknown
}

export interface Insight {
  readonly id: number
  readonly name: string
  readonly short_id?: string
  readonly description?: string | null
  readonly query?: InsightVizNode | InsightQuerySource | Readonly<Record<string, unknown>>
  readonly filters?: Readonly<Record<string, unknown>>
  readonly [key: string]: unknown
}

export interface InsightListResponse {
  readonly count: number
  readonly results: readonly Insight[]
}

export interface HogQLResult {
  readonly results: readonly unknown[][]
  readonly is_cached?: boolean
  readonly [key: string]: unknown
}

// ---------------------------------------------------------------------------
// Feature flag types
// ---------------------------------------------------------------------------

export interface FeatureFlagSummary {
  readonly id: number
  readonly name: string
  readonly key: string
  readonly active: boolean
  readonly deleted: boolean
  readonly created_at: string
  readonly updated_at: string
  readonly tags: readonly string[]
  readonly filters: Readonly<Record<string, unknown>>
  readonly version: number
  readonly created_by: { readonly id: number; readonly email: string } | null
  readonly ensure_experience_continuity: boolean
  readonly is_remote_configuration: boolean
  readonly evaluation_runtime: string
  readonly status: string
}

export interface FeatureFlagListResponse {
  readonly count: number
  readonly next: string | null
  readonly previous: string | null
  readonly results: readonly FeatureFlagSummary[]
}

export interface FeatureFlagListParams {
  readonly search?: string
  readonly active?: string
  readonly type?: string
  readonly limit?: number
  readonly offset?: number
}

export interface FeatureFlagActivity {
  readonly id: string
  readonly activity: string
  readonly detail: Readonly<Record<string, unknown>>
  readonly created_at: string
  readonly user: Readonly<Record<string, unknown>>
}

export interface FeatureFlagActivityResponse {
  readonly results: readonly FeatureFlagActivity[]
  readonly next: string | null
  readonly previous: string | null
  readonly total_count: number
}

// ---------------------------------------------------------------------------
// Insight creation params
// ---------------------------------------------------------------------------

export interface CreateInsightOnDashboardParams {
  readonly name: string
  readonly query: Readonly<Record<string, unknown>>
  readonly dashboardId: number
}

// ---------------------------------------------------------------------------
// Client interface
// ---------------------------------------------------------------------------

export interface PostHogClient {
  request(url: string, options: RequestInit): Promise<unknown>
  listDashboards(limit?: number): Promise<DashboardListResponse>
  createDashboard(params: { readonly name: string; readonly tags: readonly string[] }): Promise<Dashboard>
  getDashboard(id: number): Promise<Dashboard>
  createInsight(params: { readonly name: string; readonly query: Readonly<Record<string, unknown>> }): Promise<Insight>
  createInsightOnDashboard(params: CreateInsightOnDashboardParams): Promise<Insight>
  getInsightByShortId(shortId: string): Promise<InsightListResponse>
  runQuery(hogql: string): Promise<HogQLResult>
  listFeatureFlags(params?: FeatureFlagListParams): Promise<FeatureFlagListResponse>
  getFeatureFlag(id: number | string): Promise<FeatureFlagSummary>
  patchFeatureFlag(params: {
    readonly id: number | string
    readonly body: Readonly<Record<string, unknown>>
  }): Promise<FeatureFlagSummary>
  createFeatureFlag(params: {
    readonly key: string
    readonly body?: Readonly<Record<string, unknown>>
  }): Promise<FeatureFlagSummary>
  getFeatureFlagActivity(params: {
    readonly id: number | string
    readonly limit?: number
  }): Promise<FeatureFlagActivityResponse>
}
