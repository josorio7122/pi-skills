# PostHog API Quirks, Exit Codes, and Error Patterns

## API Quirks

- PostHog insights are attached to a dashboard by including `dashboards: [dashboard_id]` in the POST body — no separate PATCH tiles step is needed.
- The `FunnelsQuery` spec uses `funnelsFilter: { funnelWindowInterval, funnelWindowIntervalUnit }` (nested) — these are not top-level fields.
- The `refresh` parameter for HogQL queries must be top-level in the request body, not inside the `query` object.
- The ACH reference insight uses `InsightVizNode` wrapping a `FunnelsQuery` — the skill drills into `source` to extract the actual query metadata.

**Live dashboard:** The `create` command output includes `dashboard_url`.

---

## Exit Codes

| Code | Meaning                                               |
| ---- | ----------------------------------------------------- |
| `0`  | Success                                               |
| `1`  | Auth/API error or token missing                       |
| `2`  | Bad arguments / unknown command                       |
| `3`  | Partial failure (some resources created, some failed) |

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
  "token_present": false,
  "ach_insight_id": "NOT SET",
  "dashboard_name": "7361 Purchase & Insurance Flow Metrics"
}
```

### `inspect`

```json
{
  "source": "local-spec",
  "events": [
    {
      "name": "form_page_reached",
      "description": "...",
      "properties": ["page", "product_segment", "..."]
    }
  ]
}
```

### `inspect --live`

```json
{
  "source": "posthog-live",
  "queried_at": "2026-03-11T20:27:20.354Z",
  "events": [
    { "event": "form_page_reached", "count_30d": 0, "last_seen": null },
    { "event": "payment_method_selected", "count_30d": 1273, "last_seen": "2026-03-11T..." }
  ]
}
```

Events with zero occurrences in the past 30 days are returned with `count_30d: 0, last_seen: null`.

If 5 or more events have `count_30d: 0`, stop and ask the user whether to proceed.

### `compare`

```json
{
  "id": "<insight-short-id>",
  "name": "Purchases by Payment Method - ACH",
  "description": null,
  "query_kind": "InsightVizNode(FunnelsQuery)",
  "series": [],
  "breakdown": null,
  "date_range": "-90d",
  "viz_type": "funnel:steps",
  "saved_to": "references/ach-reference-summary.json"
}
```

### `create`

```json
{
  "dashboard_id": 1353084,
  "dashboard_url": "https://us.posthog.com/project/<project-id>/dashboard/1353084",
  "tiles": [
    { "name": "Page Funnel", "insight_id": 7305518, "insight_url": "...", "status": "created" },
    {
      "name": "Payment Method Preference",
      "insight_id": 7305519,
      "insight_url": "...",
      "status": "existing"
    }
  ]
}
```

Idempotency: dashboard reused if same name exists; insights skipped if already on the dashboard (`"status": "existing"`).

**Recovery (orphaned insights — exit 3):** Soft-delete the dashboard and re-run:

```bash
curl -X PATCH -H "Authorization: Bearer $POSTHOG_PERSONAL_API_KEY" \
  -H "Content-Type: application/json" \
  "https://us.posthog.com/api/environments/$POSTHOG_PROJECT_ID/dashboards/<id>/" \
  -d '{"deleted": true}'
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
