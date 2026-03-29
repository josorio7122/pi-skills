# PostHog TypeScript Client API

Full API client at `scripts/lib/posthog-client.ts`. Use it in ad-hoc scripts for tasks beyond the CLI commands.

## Contents

- Creating a client
- Available methods
- Common patterns
- Error handling

## Creating a client

```typescript
import { createClient } from '$SKILL_DIR/scripts/lib/posthog-client.js'

const client = createClient({
  host: process.env.POSTHOG_HOST ?? 'https://us.posthog.com',
  projectId: process.env.POSTHOG_PROJECT_ID!,
  token: process.env.POSTHOG_PERSONAL_API_KEY!,
})
```

## Available methods

| Method | Description |
| ------ | ----------- |
| `listDashboards(limit?)` | List dashboards (default limit 100) |
| `getDashboard(id)` | Get a dashboard with its tiles and nested insights |
| `createDashboard(name, tags)` | Create a new dashboard |
| `createInsight(name, query)` | Create a standalone insight |
| `createInsightOnDashboard(name, query, dashboardId)` | Create an insight attached to a dashboard |
| `getInsightByShortId(shortId)` | Look up an insight by its short ID |
| `runQuery(hogql)` | Execute a HogQL query (SQL over PostHog events) |
| `listFeatureFlags(params?)` | List flags with optional search/active/type/limit/offset filters |
| `getFeatureFlag(id)` | Get full flag details |
| `patchFeatureFlag(id, body)` | Update flag fields (name, active, tags, filters, etc.) |
| `createFeatureFlag(key, body?)` | Create a new flag |
| `getFeatureFlagActivity(id, limit?)` | Audit log for a flag |
| `request(url, options)` | Raw authenticated request with 429 retry (3 attempts, exponential backoff) |

For endpoints not covered by a dedicated method, use `request()` directly. It handles authentication, Content-Type, and 429 retries automatically.

## Common patterns

**Check if events are arriving (HogQL):**
```typescript
const result = await client.runQuery(`
  SELECT event, count() AS cnt
  FROM events
  WHERE event IN ('my_event_a', 'my_event_b')
    AND timestamp >= now() - INTERVAL 30 DAY
  GROUP BY event
`)
// result.results = [['my_event_a', 42], ['my_event_b', 7]]
```

**Idempotent dashboard creation:**
```typescript
const dashboards = await client.listDashboards()
const existing = dashboards.results.find(d => d.name === 'My Dashboard' && !d.deleted)
const dashboard = existing ?? await client.createDashboard('My Dashboard', ['my-tag'])
```

**Attach an insight to a dashboard:**
```typescript
await client.createInsightOnDashboard('Conversion Funnel', funnelQuery, dashboard.id)
```

**Fetch and inspect an existing insight:**
```typescript
const response = await client.getInsightByShortId('abc123')
const insight = response.results[0]
// insight.query contains the InsightVizNode or raw query
```

## Error handling

All client methods throw `PostHogError` on non-2xx responses. Use helpers from `scripts/lib/common.ts`:

```typescript
import { handleError } from '$SKILL_DIR/scripts/lib/common.js'

try {
  await client.getDashboard(id)
} catch (err) {
  handleError(err)
}
```

`handleApiError` prints a human-readable message to stderr and exits with code 1. It handles 401, 403, 429, and 5xx specifically.
