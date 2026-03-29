# PostHog API Quirks, Exit Codes, and Error Patterns

## API Quirks

### Dashboards & Insights
- PostHog insights are attached to a dashboard by including `dashboards: [dashboard_id]` in the POST body — no separate PATCH tiles step is needed.
- `getDashboard(id)` returns tiles with nested `insight` objects — use this to check which insights are already on a dashboard.
- Newer insights use `InsightVizNode` wrapping the actual query — drill into `.source` to extract query metadata (kind, series, breakdownFilter, dateRange, etc.).

### Queries
- The `FunnelsQuery` spec uses `funnelsFilter: { funnelWindowInterval, funnelWindowIntervalUnit }` (nested) — these are not top-level fields.
- The `refresh` parameter for HogQL queries must be top-level in the request body, not inside the `query` object. The client handles this automatically.
- HogQL query results come back as `{ results: unknown[][] }` — each row is an array of column values.

### Feature Flags
- DELETE returns 405 on the flags API. Use `patchFeatureFlag(id, { deleted: true })` or `patchFeatureFlag(id, { active: false })` instead.
- Flag filters use `{ groups: [{ properties: [], rollout_percentage: N }] }` structure.

---

## Exit Codes

| Code | Meaning                                               |
| ---- | ----------------------------------------------------- |
| `0`  | Success                                               |
| `1`  | Auth/API error or token missing                       |
| `2`  | Bad arguments / unknown command                       |

---

## Error Output Examples

**Missing token (exit 1):**

```
Error: POSTHOG_PERSONAL_API_KEY is required for this command.
Set it in your environment: export POSTHOG_PERSONAL_API_KEY=phx_...
```

**Invalid token (exit 1):**

```
Error: PostHog returned 401 (Unauthorized) on /api/environments/<project-id>/dashboards/
Verify that POSTHOG_PERSONAL_API_KEY is valid and has not expired.
```

**Wrong scopes (exit 1):**

```
Error: PostHog returned 403 (Forbidden) on /api/environments/<project-id>/feature_flags/
Check that your API key has these scopes: dashboard:read, dashboard:write, insight:read, insight:write, query:read
```

**Rate limited after retries (exit 1):**

```
Error: PostHog rate limit exceeded on /api/projects/<project-id>/query/ — tried 3 times.
```

**Unknown command (exit 2):**

```
Unknown command: foo
Run with --help for usage.
```

**Missing required argument (exit 2):**

```
Error: flags get requires a flag ID.
Usage: flags get <id> [--dry-run]
```

---

## Command Output Shapes

### `status`

```json
{
  "host": "https://us.posthog.com",
  "project_id": "<POSTHOG_PROJECT_ID>",
  "token": "NOT SET",
  "token_present": false
}
```

### `flags`

**List:** `{ count: N, results: [{ id, key, name, active, created_at, tags }] }`

```bash
$RUN flags
$RUN flags --search checkout --active true --type boolean --limit 10
```

**Get:** full flag object with `id, key, name, active, deleted, filters, created_at, updated_at, version, tags, evaluation_runtime, is_remote_configuration`

**Toggle:** `{ id, key, active_before, active_after }`

**Create:**

```json
{
  "id": 201,
  "key": "my-new-flag",
  "name": "My New Flag",
  "active": true,
  "deleted": false,
  "created_at": "...",
  "filters": { "groups": [{ "properties": [], "rollout_percentage": 0 }] },
  "tags": []
}
```

**Update:** `{ id, key, name, active, deleted, updated_at, tags }`

**Activity:** `{ results: [{ id, activity, detail, created_at, user }] }`

> **Note — soft-delete:** DELETE returns 405. Use `flags update <id> --active false` or PATCH with `{ "deleted": true }`.
