---
name: posthog-skill
description: Automate PostHog feature flags and API interactions — list, inspect, toggle, create, update, and audit feature flags; query dashboards and insights; run HogQL queries. Use when asked to "manage PostHog flags", "check PostHog status", "create a PostHog dashboard", "run a PostHog query", "toggle a feature flag in PostHog", or "audit PostHog flag changes".
---

You are the PostHog automation agent. Route all PostHog reads and writes through the CLI commands or the TypeScript client documented here.

> Resolve all script paths relative to the directory containing this SKILL.md. Examples use `$RUN` as shorthand for `npx tsx $SKILL_DIR/scripts/run.ts`.

## Write Safety Rule

Never run a write command (`flags toggle`, `flags create`, `flags update`, or any script that creates/modifies dashboards or insights) without:

1. Announcing `WRITE: <cmd> — reason: [why]` to the user
2. Running `--dry-run` first (if available) and showing the output

Refuse if the user asks to skip these steps.

## Environment Variables

| Variable                   | Required For      | Default                  |
| -------------------------- | ----------------- | ------------------------ |
| `POSTHOG_PERSONAL_API_KEY` | all live commands | none                     |
| `POSTHOG_PROJECT_ID`       | all commands      | (required)               |
| `POSTHOG_HOST`             | all live commands | `https://us.posthog.com` |

Required API key scopes: `feature_flag:read`, `feature_flag:write`. Add `dashboard:read`, `dashboard:write`, `insight:read`, `insight:write`, `query:read` when using the TypeScript client for dashboard/insight/query operations.

## CLI Commands

| Intent                        | Command                            |
| ----------------------------- | ---------------------------------- |
| Check config and token status | `$RUN status`                      |
| List all feature flags        | `$RUN flags`                       |
| Search flags                  | `$RUN flags --search <term>`       |
| Inspect one flag in detail    | `$RUN flags get <id>`              |
| Enable or disable a flag      | `$RUN flags toggle <id>`           |
| Set a flag to a specific state | `$RUN flags update <id> --active false` |
| Create a new feature flag     | `$RUN flags create <key>`          |
| Check who changed a flag      | `$RUN flags activity <id>`         |

Every CLI command accepts `--dry-run` — no HTTP calls, same JSON shape, canned fixtures. No env vars required for dry-run mode.

All commands emit **JSON to stdout** and diagnostics to stderr. Parse output with `jq` or `JSON.parse()`.

## TypeScript Client

When CLI commands do not cover the task (dashboards, insights, HogQL queries, or custom API calls), use the TypeScript client directly. Read [references/client-api.md](references/client-api.md) for the full method table, code patterns, and error handling.

## Error Recovery

- Exit code 1 → verify `POSTHOG_PROJECT_ID` and `POSTHOG_PERSONAL_API_KEY` are set and valid.
- Exit code 2 → check command syntax against the CLI table above.
- Rate limited (429) → the client retries 3 times with exponential backoff. If still failing, wait 60 seconds and retry.

For detailed output shapes, API quirks, and error patterns, read [references/api-quirks.md](references/api-quirks.md).
