---
name: posthog-skill
description: Automate PostHog analytics and feature flags for this project — inspect branch event availability, compare against the ACH reference insight, create or update the 7361 metrics dashboard idempotently, and manage feature flags (list, inspect, toggle, create, update, audit activity log). Use when working on analytics instrumentation, dashboards, PostHog event verification, or feature flag management.
---

You are the PostHog automation agent for this project. All PostHog reads and writes go through the commands below.

> Path resolution: this is a project-local skill. Resolve script paths relative to the directory containing this SKILL.md.

For brevity, examples below use `$RUN` as shorthand for `npx tsx $SKILL_DIR/scripts/run.ts`.

## Write Safety Rule

**Never run a WRITE command (`create`, `flags toggle`, `flags create`, `flags update`) without:**

1. Announcing `WRITE: <cmd> — reason: [why]` to the user
2. Running `--dry-run` first and showing the output

These are mandatory pre-conditions. If the user asks to skip them, refuse.

## Requirements

Requires Node.js 18+ and tsx. Run `pnpm install` from the repo root.

## Command Quick Reference

| Intent                                    | Command                            |
| ----------------------------------------- | ---------------------------------- |
| Check config and token status             | `status`                           |
| See all 9 branch events (local spec only) | `inspect`                          |
| Verify events are arriving in PostHog     | `inspect --live`                   |
| Fetch the ACH reference funnel            | `compare`                          |
| Preview ACH reference fetch (no HTTP)     | `compare --dry-run`                |
| Provision the 7361 metrics dashboard      | `create`                           |
| List all feature flags                    | `flags`                            |
| Inspect one flag in detail                | `flags get <id>`                   |
| Enable or disable a flag                  | `flags toggle <id>`                |
| Set a flag to a specific state            | `flags update <id> --active false` |
| Create a new feature flag                 | `flags create <key>`               |
| Check who changed a flag                  | `flags activity <id>`              |

## Recommended Workflow

1. Run `status` to confirm config
2. Run `inspect --live` to verify events are firing
3. If events have data, run `compare --dry-run` then `compare`
4. Run `create --dry-run` then `create`

## Error Recovery

- Exit code 1 (config error) → check `POSTHOG_PROJECT_ID` and `POSTHOG_PERSONAL_API_KEY` are set.
- Exit code 2 (usage error) → check command syntax against the Quick Reference table.
- Exit code 3 (partial failure on `create`) → some tiles failed. Soft-delete the dashboard (`PATCH {"deleted": true}`) and re-run.
- `compare` returns empty → verify `POSTHOG_ACH_INSIGHT_ID` is set and the insight exists.
- Rate limited (429) → wait 60 seconds and retry.

## Output Format

All commands emit **JSON to stdout** and diagnostics to stderr. Parse output with `jq` or `JSON.parse()`. Key shapes:

- `status`: `{ project_id, host, token: "*** (present)", ach_insight_id }`
- `inspect`: `{ events: [{ event, properties, count_30d? }] }`
- `compare`: `{ id, name, query, tiles_count }`
- `create`: `{ dashboard_id, dashboard_url, tiles: [...] }`
- `flags list`: `{ results: [{ id, key, active }] }`

For detailed output shapes, see [references/api-quirks.md](references/api-quirks.md).

---

# PostHog Skill — Branch 7361 Analytics Automation

Zero-dependency Node.js skill for PostHog automation scoped to this project's branch-7361 instrumentation. All output is **JSON to stdout**; all diagnostics go to **stderr**. The token never leaves environment variables.

## Environment Variables

| Variable                   | Required For                                          | Default                                  |
| -------------------------- | ----------------------------------------------------- | ---------------------------------------- |
| `POSTHOG_PERSONAL_API_KEY` | `inspect --live`, `compare`, `create`, `flags` (live) | none                                     |
| `POSTHOG_PROJECT_ID`       | all live commands                                     | (required)                               |
| `POSTHOG_HOST`             | all live commands                                     | `https://us.posthog.com`                 |
| `POSTHOG_ACH_INSIGHT_ID`   | `compare`                                             | (optional)                               |
| `POSTHOG_DASHBOARD_NAME`   | `create`                                              | `7361 Purchase & Insurance Flow Metrics` |

All live commands (any command without `--dry-run`) require `POSTHOG_PERSONAL_API_KEY`.

**Required API key scopes**: `feature_flag:read`, `feature_flag:write`, plus analytics read/write scopes for dashboards and insights.

```bash
export POSTHOG_PERSONAL_API_KEY=phx_...
export POSTHOG_PROJECT_ID=<your-project-id>
```

## Command Surface

```
$RUN <command> [options]
```

### `status`

Requires `POSTHOG_PROJECT_ID`. Token is optional (only needed for `--live`).

### `inspect`

List the 9 branch-7361 events from the local spec or verify them against PostHog with `--live`. Requires `POSTHOG_PROJECT_ID`. The `--live` flag additionally requires `POSTHOG_PERSONAL_API_KEY`.

If 5 or more events have `count_30d: 0` on `--live`, stop and ask whether to proceed. Do not run `compare` or `create` automatically.

### `compare`

Fetch the ACH reference insight (set via `POSTHOG_ACH_INSIGHT_ID`) and print a structured summary. Also writes the summary to `references/ach-reference-summary.json`.

### `create`

Idempotently provision the 7361 dashboard + 8 insights. Dashboard is reused if it already exists; insights already on the dashboard are skipped (`"status": "existing"`). If it fails mid-run (exit 3), soft-delete the dashboard and re-run.

### `flags`

Six subcommands: `flags`, `flags get <id>`, `flags toggle <id>`, `flags create <key>`, `flags update <id> [options]`, `flags activity <id>`.

> **Note — soft-delete:** DELETE returns 405 on the PostHog flags API. Use `flags update <id> --active false` or PATCH with `{ "deleted": true }`.

## Dry-Run Mode

Every command accepts `--dry-run` — no HTTP calls, same JSON shape, canned fixtures. No env vars required.

Branch events and tile definitions are defined in `scripts/lib/dashboard-spec.ts`. Read that file if you need property lists or query shapes.

For API quirks, error patterns, exit codes, and full output shapes, read [references/api-quirks.md](references/api-quirks.md).
