---
name: posthog-skill
description: Automate PostHog feature flags and API interactions — list, inspect, toggle, create, update, and audit feature flags; query dashboards and insights; run HogQL queries. Use when asked to "manage PostHog flags", "check PostHog status", "create a PostHog dashboard", "run a PostHog query", "toggle a feature flag in PostHog", "audit PostHog flag changes", "enable a feature flag", "disable a feature flag", "check feature flags", "set up PostHog SDK", "PostHog Python integration", or "query PostHog events".
---

Automate PostHog reads and writes through the scripts documented here. Pick the right script to avoid wasting API credits.

> Resolve all script paths relative to the directory containing this SKILL.md.

## Prerequisites

Verify before running any script:

```bash
node --version                    # Must be 18+
echo $POSTHOG_PROJECT_ID          # Must be set
echo $POSTHOG_PERSONAL_API_KEY    # Must be set (except for status)
```

## Environment Variables

| Variable                   | Required For      | Default                  |
| -------------------------- | ----------------- | ------------------------ |
| `POSTHOG_PERSONAL_API_KEY` | all live commands | none                     |
| `POSTHOG_PROJECT_ID`       | all commands      | (required)               |
| `POSTHOG_HOST`             | all live commands | `https://us.posthog.com` |

Required API key scopes: `feature_flag:read`, `feature_flag:write`. Add `dashboard:read`, `dashboard:write`, `insight:read`, `insight:write`, `query:read` when using the TypeScript client for dashboard/insight/query operations.

## API Key Types

PostHog uses three distinct key types — do not mix them up:

| Prefix | Name | Used for |
| ------ | ----------------------------- | --------------------------------------------------------- |
| `phx_` | Personal API key | REST API — managing flags, querying dashboards, this skill's scripts |
| `phc_` | Project token | SDKs (Python, JS) — capturing events, evaluating feature flags remotely |
| `phs_` | Feature flags secure key | SDK local evaluation — fetches flag definitions, evaluates in-process |

- The scripts in this skill use **`phx_` (personal API key)** via `POSTHOG_PERSONAL_API_KEY`.
- The Python/JS SDKs need **`phc_` (project token)** to call `feature_enabled()`. A `phx_` key will return 401.
- To find the project token via API: `curl -H "Authorization: Bearer $POSTHOG_PERSONAL_API_KEY" "$POSTHOG_HOST/api/projects/$POSTHOG_PROJECT_ID/"` → read `api_token` from the response.

## Choosing the Right Script

| When...                                    | Use                          | Identifier        |
| ------------------------------------------ | ---------------------------- | ------------------ |
| Check config and token status              | `scripts/status.ts`          | —                  |
| List or search feature flags               | `scripts/flags-list.ts`      | —                  |
| Inspect one flag in detail                 | `scripts/flags-get.ts`       | numeric ID         |
| Enable or disable a flag                   | `scripts/flags-toggle.ts`    | numeric ID         |
| Update a flag's properties                 | `scripts/flags-update.ts`    | numeric ID         |
| Create a new feature flag                  | `scripts/flags-create.ts`    | flag key (string)  |
| Check who changed a flag                   | `scripts/flags-activity.ts`  | numeric ID         |

**Identifier rules:**
- `flags-create.ts` takes the **flag key** as the first positional arg: `tsx scripts/flags-create.ts "my-flag" '{"name":"My Flag"}'`
- All other flag scripts take the **numeric flag ID** (not the key). Get the ID from `flags-list.ts` or the `id` field in `flags-create.ts` output.
- Passing a flag key to `flags-get.ts`, `flags-update.ts`, or `flags-toggle.ts` will return a 404.

## Rules

- **Write safety** — never run a write script (`flags-toggle.ts`, `flags-create.ts`, `flags-update.ts`) without announcing `WRITE: <script> — reason: [why]` to the user first. Refuse if the user asks to skip this step.
- **Always check env vars are set** before running any script
- **Use `flags-list.ts` with `{"search":"..."}` for searching** — don't list all and filter manually
- **Use `flags-get.ts` for detailed inspection** — list only returns summaries
- **All output is JSON to stdout** — diagnostics go to stderr. Parse output with `jq` or `JSON.parse()`

## Output Format

- `status.ts`: JSON object with host, project_id, token presence.
- `flags-list.ts`: JSON with `count` and `results` array of flag summaries.
- `flags-get.ts`: JSON object with full flag details including filters and version.
- `flags-toggle.ts`: JSON with `id`, `key`, `active_before`, `active_after`.
- `flags-create.ts`: JSON object of the created flag.
- `flags-update.ts`: JSON object of the updated flag.
- `flags-activity.ts`: JSON with `results` array of activity entries.

```json
// status.ts
{
  "host": "https://us.posthog.com",
  "project_id": "<POSTHOG_PROJECT_ID>",
  "token": "*** (present)",
  "token_present": true
}

// flags-toggle.ts
{
  "id": 101,
  "key": "my-feature-flag",
  "active_before": true,
  "active_after": false
}

// flags-create.ts
{
  "id": 201,
  "key": "my-new-flag",
  "name": "My New Flag",
  "active": true,
  "deleted": false,
  "created_at": "2024-01-15T10:30:00Z",
  "filters": { "groups": [{ "properties": [], "rollout_percentage": 0 }] },
  "tags": []
}
```

## Error Recovery

- **Exit code 1** → verify `POSTHOG_PROJECT_ID` and `POSTHOG_PERSONAL_API_KEY` are set and valid.
- **Exit code 1 with 401** → API key expired or invalid.
- **Exit code 1 with 403** → API key missing required scopes.
- **Exit code 1 with 429** → rate limited; client retried 3 times with exponential backoff. Wait 60 seconds and retry.
- **"options argument is not valid JSON"** → check that the options string is valid JSON (keys must be quoted).
- **Exit code 1 with 404 on flag operations** → a flag key was passed instead of a numeric ID. Use `flags-list.ts` to find the numeric ID first.
- **Exit code 1 with 401 on SDK `feature_enabled()`** → a personal API key (`phx_`) was used instead of the project token (`phc_`). See API Key Types.
- **Empty results** → broaden search term or check that flags exist in the project.

## TypeScript Client

When scripts do not cover the task (dashboards, insights, HogQL queries, or custom API calls), use the TypeScript client directly. Read [references/client-api.md](references/client-api.md) for the full method table, code patterns, and error handling.

## Python SDK Integration

When setting up feature flags in Python/Django code after creating them with this skill:

1. **Use the project token (`phc_`)**, not the personal API key (`phx_`).
2. **SDK v7+ requires the `Posthog()` constructor** — the old `posthog.project_api_key = ...` module-level pattern no longer works.
3. **`feature_enabled()` returns `None` for nonexistent flags** — always wrap with `bool()` and handle errors.

```python
from posthog import Posthog

posthog_client = Posthog("phc_...", host="https://us.i.posthog.com")
result = bool(posthog_client.feature_enabled("flag-key", "distinct-id"))
```

## References

- For the TypeScript client API: [references/client-api.md](references/client-api.md)
- For API quirks and error patterns: [references/api-quirks.md](references/api-quirks.md)
