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
