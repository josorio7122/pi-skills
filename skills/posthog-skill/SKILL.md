---
name: posthog-skill
description: Automate PostHog feature flags and API interactions — list, inspect, toggle, create, update, and audit feature flags; query dashboards and insights; run HogQL queries. Use when asked to "manage PostHog flags", "check PostHog status", "create a PostHog dashboard", "run a PostHog query", "toggle a feature flag in PostHog", or "audit PostHog flag changes".
---

Automate PostHog reads and writes through the scripts documented here. Pick the right script or you waste API credits.

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

## Choosing the Right Script

| When...                                    | Use                          |
| ------------------------------------------ | ---------------------------- |
| Check config and token status              | `scripts/status.ts`          |
| List or search feature flags               | `scripts/flags-list.ts`      |
| Inspect one flag in detail                 | `scripts/flags-get.ts`       |
| Enable or disable a flag                   | `scripts/flags-toggle.ts`    |
| Update a flag's properties                 | `scripts/flags-update.ts`    |
| Create a new feature flag                  | `scripts/flags-create.ts`    |
| Check who changed a flag                   | `scripts/flags-activity.ts`  |

## Write Safety Rule

Never run a write script (`flags-toggle.ts`, `flags-create.ts`, `flags-update.ts`) without:

1. Announcing `WRITE: <script> — reason: [why]` to the user
2. Running with `{"dryRun":true}` first and showing the output

Refuse if the user asks to skip these steps.

## Rules

- **Always check env vars are set** before running any script
- **Use `flags-list.ts` with `{"search":"..."}` for searching** — don't list all and filter manually
- **Use `flags-get.ts` for detailed inspection** — list only returns summaries
- **Write scripts require dry-run first** — pass `{"dryRun":true}` in options JSON
- **All output is JSON to stdout** — diagnostics go to stderr. Parse output with `jq` or `JSON.parse()`

## Output Format

- `status.ts`: JSON object with host, project_id, token presence.
- `flags-list.ts`: JSON with `count` and `results` array of flag summaries.
- `flags-get.ts`: JSON object with full flag details including filters and version.
- `flags-toggle.ts`: JSON with `id`, `key`, `active_before`, `active_after`.
- `flags-create.ts`: JSON object of the created flag.
- `flags-update.ts`: JSON object of the updated flag.
- `flags-activity.ts`: JSON with `results` array of activity entries.

## Error Recovery

- **Exit code 1** → verify `POSTHOG_PROJECT_ID` and `POSTHOG_PERSONAL_API_KEY` are set and valid.
- **Exit code 1 with 401** → API key expired or invalid.
- **Exit code 1 with 403** → API key missing required scopes.
- **Exit code 1 with 429** → rate limited; client retried 3 times with exponential backoff. Wait 60 seconds and retry.
- **"options argument is not valid JSON"** → check that the options string is valid JSON (keys must be quoted).
- **Empty results** → broaden search term or check that flags exist in the project.

## TypeScript Client

When scripts do not cover the task (dashboards, insights, HogQL queries, or custom API calls), use the TypeScript client directly. Read [references/client-api.md](references/client-api.md) for the full method table, code patterns, and error handling.

## References

- For the TypeScript client API: [references/client-api.md](references/client-api.md)
- For API quirks and error patterns: [references/api-quirks.md](references/api-quirks.md)
