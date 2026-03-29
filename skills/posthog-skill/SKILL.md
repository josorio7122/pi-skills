---
name: posthog-skill
description: Automate PostHog analytics and feature flags for this project — inspect branch event availability, compare against the ACH reference insight, create or update the 7361 metrics dashboard idempotently, and manage feature flags (list, inspect, toggle, create, update, audit activity log). Use when working on analytics instrumentation, dashboards, PostHog event verification, or feature flag management.
metadata:
  author: josorio7122
  version: '1.0'
compatibility: 'Requires Node.js 18+ and tsx. Dependencies are managed at the repository root — run `pnpm install` from the repo root if needed.'
---

**IMPORTANT — Path Resolution:**
This is a project-local skill. `$SKILL_DIR` is the directory containing this SKILL.md file. Resolve it from where you loaded this file — do not hardcode an absolute path.

For brevity, examples below use `$RUN` as shorthand for `npx tsx $SKILL_DIR/scripts/run.ts`.

---

This skill is written in TypeScript and uses `tsx` for execution. All commands use `npx tsx` instead of `node`. Dependencies (`tsx`, `typescript`, `@types/node`) are installed at the repository root. Run `pnpm install` from the repo root if needed.

---

## Command Quick Reference

| Intent                                | Command                            |
| ------------------------------------- | ---------------------------------- |
| Check config and token status         | `status`                           |
| See all 9 branch events (offline)     | `inspect`                          |
| Verify events are arriving in PostHog | `inspect --live`                   |
| Fetch the ACH reference funnel        | `compare`                          |
| Provision the 7361 metrics dashboard  | `create`                           |
| List all feature flags                | `flags`                            |
| Inspect one flag in detail            | `flags get <id>`                   |
| Enable or disable a flag              | `flags toggle <id>`                |
| Set a flag to a specific state        | `flags update <id> --active false` |
| Create a new feature flag             | `flags create <key>`               |
| Check who changed a flag              | `flags activity <id>`              |

---

# PostHog Skill — Branch 7361 Analytics Automation

Zero-dependency Node.js skill for PostHog automation scoped to this project's branch-7361 instrumentation. All output is **JSON to stdout**; all diagnostics go to **stderr**. The token never leaves environment variables.

---

## Environment Variables

| Variable                   | Required For                                          | Default                                                        |
| -------------------------- | ----------------------------------------------------- | -------------------------------------------------------------- |
| `POSTHOG_PERSONAL_API_KEY` | `inspect --live`, `compare`, `create`, `flags` (live) | none                                                           |
| `POSTHOG_PROJECT_ID`       | all live commands                                     | `39507`                                                        |
| `POSTHOG_HOST`             | all live commands                                     | `https://us.posthog.com`                                       |
| `POSTHOG_ACH_INSIGHT_ID`   | `compare`                                             | none — short ID `drOq2lO5` is hardcoded in the dry-run fixture |
| `POSTHOG_DASHBOARD_NAME`   | `create`                                              | `7361 Purchase & Insurance Flow Metrics`                       |

All live commands (any command without `--dry-run`) require `POSTHOG_PERSONAL_API_KEY`.

**Required API key scopes** (PostHog → Settings → Personal API Keys): `feature_flag:read`, `feature_flag:write`, plus the existing analytics read/write scopes for dashboards and insights.

Set these in your shell before running any live command:

```bash
export POSTHOG_PERSONAL_API_KEY=phx_...
export POSTHOG_PROJECT_ID=39507
```

---

## Command Surface

```
$RUN <command> [options]
```

### `status`

Show resolved config. Token is masked. Never requires a token. Safe in CI.

```bash
$RUN status
```

Output:

```json
{
  "host": "https://us.posthog.com",
  "project_id": "39507",
  "token": "NOT SET",
  "token_present": false,
  "ach_insight_id": "NOT SET",
  "dashboard_name": "7361 Purchase & Insurance Flow Metrics"
}
```

### `inspect`

List the 9 branch-7361 events from the local spec. Works offline with no env vars.

```bash
$RUN inspect
```

Output shape:

```json
{
  "source": "local-spec",
  "events": [
    { "name": "form_page_reached", "description": "...", "properties": ["page", "product_segment", ...] },
    ...
  ]
}
```

### `inspect --live`

Verify those events are arriving in PostHog. Runs one HogQL batch query for all 9 events.

```bash
POSTHOG_PERSONAL_API_KEY=phx_... $RUN inspect --live
```

Output shape:

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

### `compare`

Fetch the ACH reference insight (`drOq2lO5`) and print a structured summary.

Also writes the summary to `references/ach-reference-summary.json` for spec alignment.

```bash
POSTHOG_PERSONAL_API_KEY=phx_... $RUN compare
```

Output shape:

```json
{
  "id": "drOq2lO5",
  "name": "Purchases by Payment Method - ACH",
  "description": null,
  "query_kind": "InsightVizNode(FunnelsQuery)",
  "series": [...],
  "breakdown": null,
  "date_range": "-90d",
  "viz_type": "funnel:steps",
  "saved_to": "references/ach-reference-summary.json"
}
```

### `create`

Idempotently provision the 7361 dashboard + 8 insights in PostHog.

> ⚠️ **WRITE OPERATION.** Before executing live, announce:
> `WRITE: create — reason: [why]`
> Run `$RUN create --dry-run` first to preview. Do not add flags or modify the command.

```bash
POSTHOG_PERSONAL_API_KEY=phx_... $RUN create
```

Output shape:

```json
{
  "dashboard_id": 1353084,
  "dashboard_url": "https://us.posthog.com/project/39507/dashboard/1353084",
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

Idempotency: if a dashboard with the same name already exists, it is reused. If an insight with the same name already exists on the dashboard, it is skipped (`"status": "existing"`). Re-running when fully provisioned produces all `"status": "existing"` with zero new API writes.

**Recovery (orphaned insights):** If `create` fails mid-run (exit 3), orphaned insights remain in the project but are harmless. To recover, soft-delete the dashboard and re-run:

```bash
# Soft-delete (hard DELETE returns 405 — use PATCH)
curl -X PATCH -H "Authorization: Bearer $POSTHOG_PERSONAL_API_KEY" \
  -H "Content-Type: application/json" \
  "https://us.posthog.com/api/environments/39507/dashboards/<id>/" \
  -d '{"deleted": true}'

# Re-run
$RUN create
```

---

### `flags`

Manage PostHog feature flags. Six subcommands cover listing, inspecting, toggling, creating, updating, and auditing flags.

**List all flags**

```bash
$RUN flags
$RUN flags --search checkout --active true --type boolean --limit 10
```

Output shape: `{ count: N, results: [{ id, key, name, active, created_at, tags }] }`

**Get a single flag**

```bash
$RUN flags get 123
```

Output shape: full flag object with `id, key, name, active, deleted, filters, created_at, updated_at, version, tags, evaluation_runtime, is_remote_configuration`

**Toggle active state**

> ⚠️ **WRITE OPERATION.** Before executing live, announce:
> `WRITE: flags toggle <id> — reason: [why]`
> Run `$RUN flags toggle <id> --dry-run` first to preview. Do not add flags or modify the command.

```bash
$RUN flags toggle 123
```

Output shape: `{ id, key, active_before, active_after }`. Flips the `active` field via PATCH.

**Create a new flag**

> ⚠️ **WRITE OPERATION.** Before executing live, announce:
> `WRITE: flags create <key> — reason: [why]`
> Run `$RUN flags create <key> --dry-run` first to preview. Do not add flags or modify the command.

```bash
$RUN flags create my-new-flag
$RUN flags create my-new-flag --name 'My New Flag'
```

Output shape:

```json
{
  "id": 201,
  "key": "my-new-flag",
  "name": "My New Flag",
  "active": true,
  "deleted": false,
  "created_at": "2026-03-29T12:00:00Z",
  "filters": { "groups": [{ "properties": [], "rollout_percentage": 0 }] },
  "tags": []
}
```

**Update a flag**

> ⚠️ **WRITE OPERATION.** Before executing live, announce:
> `WRITE: flags update <id> — reason: [why]`
> Run `$RUN flags update <id> --dry-run` first to preview. Do not add flags or modify the command.

```bash
$RUN flags update 123 --name 'New Name' --active false --tags release,v2
```

Output shape:

```json
{
  "id": 101,
  "key": "enable-new-checkout",
  "name": "Updated Name",
  "active": true,
  "deleted": false,
  "updated_at": "2026-03-29T12:00:00Z",
  "tags": ["release", "updated"]
}
```

**View activity log**

```bash
$RUN flags activity 123 --limit 20
```

Output shape: `{ results: [{ id, activity, detail, created_at, user }] }`

> **Note — soft-delete:** DELETE returns 405 on the PostHog flags API. To soft-delete a flag, use
> `flags update <id> --active false` or PATCH directly with `{ "deleted": true }` via curl.

---

## Dry-Run Mode

Every command accepts `--dry-run`. No HTTP calls are made. Returns the same JSON shape as the live command, populated from canned fixtures. Exit 0.

```bash
# All of these work without any env vars or token:
$RUN status
$RUN inspect
$RUN inspect --dry-run
$RUN compare --dry-run
$RUN create --dry-run
$RUN flags --dry-run
$RUN flags get 123 --dry-run
$RUN flags toggle 123 --dry-run
$RUN flags create my-flag --dry-run
$RUN flags update 123 --dry-run
$RUN flags activity 123 --dry-run
```

---

## First Use (No Token Yet)

You can fully explore the skill and the dashboard spec today without a PostHog token:

**Step 0: Install dependencies (first time only)**

```bash
# Dependencies are at the repo root — run from the repo root:
pnpm install
```

**Step 1: Check what the skill knows**

```bash
$RUN status
```

**Step 2: View all 9 branch events and their properties**

```bash
$RUN inspect
```

**Step 3: Preview what the ACH compare output will look like**

```bash
$RUN compare --dry-run
```

**Step 4: Preview the full dashboard create output (8 tiles)**

```bash
$RUN create --dry-run
```

**Step 5: Run all tests (no token needed)**

```bash
npx tsx --test $SKILL_DIR/scripts/__tests__/*.test.ts
```

**Step 6: Preview feature flags list**

```bash
$RUN flags --dry-run
```

---

## Dashboard Spec

The 8-tile dashboard spec lives in `scripts/lib/dashboard-spec.ts`. It defines:

- **Tile 1 — Page Funnel** (`FunnelsQuery`): `form_page_reached` filtered to 5 key pages
- **Tile 2 — Payment Method Preference** (`TrendsQuery`): `payment_method_selected` by `product_segment`
- **Tile 3 — Payment Mode Selection** (`TrendsQuery`): `payment_mode_selected` by `product_segment`
- **Tile 4 — FCF Selection Rate** (`TrendsQuery`): `fcf_amount_selected` + `fcf_more_info_clicked`
- **Tile 5 — Travel Protection Selection** (`TrendsQuery`): `travel_protection_selected`
- **Tile 6 — Signing Completion** (`TrendsQuery`): `signing_completed` by `form_type`
- **Tile 7 — Purchase Completions Over Time** (`TrendsQuery`): `payment_completed` by `product_segment`
- **Tile 8 — Top Counties** (`HogQLQuery`): `form_page_reached` GROUP BY `county_id`

Layout: 2-column grid, `w:6, h:5` per tile (full-width for funnel + top counties, `w:12`).

---

## Branch Events Catalog

All 9 events introduced or changed on branch 7361:

| Event                        | Key Properties                                             |
| ---------------------------- | ---------------------------------------------------------- |
| `form_page_reached`          | `page`, `product_segment`, `county_id`, `form_type`, `uid` |
| `purchase_started`           | `product_segment`, `county_id`, `uid`                      |
| `soil_donation_selected`     | `product_segment`, `county_id`, `uid`                      |
| `travel_protection_selected` | `selected`, `product_segment`, `county_id`, `uid`          |
| `fcf_amount_selected`        | `amount`, `product_segment`, `county_id`, `uid`            |
| `fcf_more_info_clicked`      | `product_segment`, `county_id`, `uid`                      |
| `payment_method_selected`    | `method`, `product_segment`, `county_id`, `uid`            |
| `payment_mode_selected`      | `mode`, `product_segment`, `county_id`, `uid`              |
| `payment_completed`          | `product_segment`, `county_id`, `form_type`, `uid`         |
| `signing_completed`          | `form_type`, `product_segment`, `county_id`, `uid`         |

---

## API Quirks

- PostHog insights are attached to a dashboard by including `dashboards: [dashboard_id]` in the POST body — no separate PATCH tiles step is needed.
- The `FunnelsQuery` spec uses `funnelsFilter: { funnelWindowInterval, funnelWindowIntervalUnit }` (nested) — these are not top-level fields.
- The `refresh` parameter for HogQL queries must be top-level in the request body, not inside the `query` object.
- The ACH reference insight (`drOq2lO5`) uses `InsightVizNode` wrapping a `FunnelsQuery` — the skill drills into `source` to extract the actual query metadata.

**Live dashboard:** [https://us.posthog.com/project/39507/dashboard/1353084](https://us.posthog.com/project/39507/dashboard/1353084)

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
Error: PostHog returned 401 (Unauthorized) on /api/environments/39507/dashboards/
Verify that POSTHOG_PERSONAL_API_KEY is valid and has not expired.
```

**Wrong scopes (exit 1):**

```
Error: PostHog returned 403 (Forbidden) on /api/environments/39507/feature_flags/
Check that your API key has these scopes: dashboard:read, dashboard:write, insight:read, insight:write, query:read
```

**Rate limited after retries (exit 1):**

```
Error: PostHog rate limit exceeded on /api/projects/39507/query/ — tried 3 times.
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

## File Structure

```
.pi/skills/posthog-skill/
├── SKILL.md                          # This file
├── package.json
├── tsconfig.json
├── scripts/
│   ├── run.ts                        # Subcommand router + live command implementations
│   ├── lib/
│   │   ├── dashboard-spec.ts         # Static 8-tile spec + 9 branch events (no token needed)
│   │   ├── fixtures.ts               # Canned dry-run responses for all commands
│   │   └── posthog-client.ts         # Fetch wrapper: Bearer auth, 429 retry, PostHogError
│   └── __tests__/
│       ├── status.test.ts
│       ├── inspect.test.ts           # Offline + live tests (--live describe block)
│       ├── compare.test.ts           # Offline + live tests
│       ├── create.test.ts            # Offline + live + idempotency tests
│       ├── flags.test.ts             # Offline + live tests for all flags subcommands
│       ├── dashboard-spec.test.ts
│       ├── posthog-client.test.ts    # Unit tests for the client factory (mock fetchFn)
│       └── live.test.ts              # Integration sequence (POSTHOG_TEST_LIVE=1 only)
└── references/
    ├── POSTHOG_API.md                # PostHog REST API reference (endpoints, auth, rate limits)
    └── ach-reference-summary.json    # Written by `compare` — ACH funnel insight metadata
```

For PostHog API details, see [`references/POSTHOG_API.md`](references/POSTHOG_API.md).

**Running live tests:**

```bash
source ~/.zshrc && POSTHOG_TEST_LIVE=1 npx tsx --test $SKILL_DIR/scripts/__tests__/*.test.ts
```
