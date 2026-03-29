Good — confirmed: `'status'` and `'inspect-live'` fixtures are never requested. Now I have complete understanding. Let me map the data flow and create the task plan.

## Data Flow Mapping

**Issue 2 (Dead exports):** No data flow — pure deletion. `DashboardSpec` interface exported but never imported. `patchDashboard` called only from tests (removing from client interface means removing test too). `'status'` and `'inspect-live'` fixture keys never called by `getFixture()` in run.ts.

**Issue 1 (Test helper extraction):** Data flows from 6 test files → duplicated `run()` helper → `spawnSync`. Extract to shared helpers.ts → all 6 files import from it.

**Issue 3 (exa-search common.ts):** Data flows: CLI args → `parseArgs` → `executeAndPrint`. `contents.ts` manually parses args instead of using `parseArgs`. `research.ts` manually calls `console.log(JSON.stringify(...))` instead of `executeAndPrint`.

**Issue 5 (Type insight response):** Data flows: PostHog API → untyped `Record<string, unknown>` → many casts in `cmdCompareLive`. Define typed interfaces → use them.

**Issue 4 (Split run.ts):** Data flows: CLI args → `main()` switch → command functions. Split into modules with imports.

**Issue 6 (exa-search tests):** Data flows: unit test → common.ts pure functions.

## Tasks for code-organization-cleanup

### 1a. Write tests for dead export removal in posthog-skill (RED)
**Agent:** test-writer
**Scope:** skills/posthog-skill/scripts/__tests__/dead-exports.test.ts
**Test criteria:**
- test_dashboard_spec_does_not_export_DashboardSpec_interface → MUST FAIL (verify by importing and checking exported keys — currently DashboardSpec IS exported)
- test_fixtures_type_does_not_include_status_key → MUST FAIL (the FixtureKey union currently includes 'status')
- test_fixtures_type_does_not_include_inspect_live_key → MUST FAIL (the FixtureKey union currently includes 'inspect-live')
**Note:** Testing `patchDashboard` removal is tricky since it's a method on the client interface. The existing `posthog-client.test.ts` has tests for `patchDashboard` — the GREEN task should remove those tests along with the dead method. The RED test here should verify the client interface does NOT expose `patchDashboard` (e.g., assert `!('patchDashboard' in client)`).
**Test tier:** unit
**Depends on:** none

### 1b. Remove dead exports in posthog-skill (GREEN)
**Agent:** builder
**Scope:** skills/posthog-skill/scripts/lib/dashboard-spec.ts, skills/posthog-skill/scripts/lib/posthog-client.ts, skills/posthog-skill/scripts/lib/fixtures.ts, skills/posthog-skill/scripts/__tests__/posthog-client.test.ts
**Test criteria:**
- test_dashboard_spec_does_not_export_DashboardSpec_interface → MUST PASS
- test_fixtures_type_does_not_include_status_key → MUST PASS
- test_fixtures_type_does_not_include_inspect_live_key → MUST PASS
- All existing tests still pass (`pnpm test`)
- `tsc --noEmit` passes
- `pnpm run lint` passes
**Changes:**
- Remove `DashboardSpec` interface from dashboard-spec.ts
- Remove `patchDashboard` from the `PostHogClient` interface, the implementation function, and the return object in posthog-client.ts
- Remove `patchDashboard` tests from posthog-client.test.ts (2 tests in "Content-Type header" describe + the PATCH test in "patchFeatureFlag" describe — careful: only remove the `patchDashboard`-specific tests)
- Remove `'status'` and `'inspect-live'` entries from the `FixtureKey` type union and the `FIXTURES` record in fixtures.ts
**Depends on:** 1a

### 2a. Write tests for shared test helper in posthog-skill (RED)
**Agent:** test-writer
**Scope:** skills/posthog-skill/scripts/__tests__/helpers.test.ts
**Test criteria:**
- test_run_helper_returns_status_stdout_stderr → MUST FAIL (helpers.ts doesn't exist yet)
- test_run_helper_passes_env_override → MUST FAIL
- test_run_helper_accepts_timeout_option → MUST FAIL
- test_TSX_constant_points_to_tsx_binary → MUST FAIL
- test_RUN_constant_points_to_run_ts → MUST FAIL
- test_LIVE_constant_reads_POSTHOG_TEST_LIVE_env → MUST FAIL
**Test tier:** unit
**Depends on:** none

### 2b. Extract shared test helper and refactor test files (GREEN)
**Agent:** builder
**Scope:** skills/posthog-skill/scripts/__tests__/helpers.ts, skills/posthog-skill/scripts/__tests__/status.test.ts, skills/posthog-skill/scripts/__tests__/inspect.test.ts, skills/posthog-skill/scripts/__tests__/compare.test.ts, skills/posthog-skill/scripts/__tests__/create.test.ts, skills/posthog-skill/scripts/__tests__/flags.test.ts, skills/posthog-skill/scripts/__tests__/live.test.ts
**Test criteria:**
- test_run_helper_returns_status_stdout_stderr → MUST PASS
- test_run_helper_passes_env_override → MUST PASS
- test_run_helper_accepts_timeout_option → MUST PASS
- test_TSX_constant_points_to_tsx_binary → MUST PASS
- test_RUN_constant_points_to_run_ts → MUST PASS
- test_LIVE_constant_reads_POSTHOG_TEST_LIVE_env → MUST PASS
- All existing tests still pass (`pnpm test`)
- `tsc --noEmit` passes
- `pnpm run lint` passes
**Changes:**
- Create helpers.ts exporting: `TSX`, `RUN`, `LIVE` constants and `run(args, env?, options?)` function
- `run()` supports optional `options` param with `timeout` (for live.test.ts variant)
- Refactor all 6 test files to import from `./helpers.js` and remove duplicated `run()`, `TSX`, `RUN`, `LIVE`, `__dirname`
- Each test file should only retain its own `describe`/`it` blocks
**Depends on:** 2a

### 3a. Write tests for exa-search contents.ts and research.ts using common.ts (RED)
**Agent:** test-writer
**Scope:** skills/exa-search/scripts/__tests__/refactor-validation.test.ts
**Test criteria:**
- test_contents_ts_imports_parseArgs_from_common → MUST FAIL (contents.ts currently manually re-implements parseArgs)
- test_research_ts_imports_executeAndPrint_from_common → MUST FAIL (research.ts uses inline console.log)
- test_research_ts_does_not_contain_raw_JSON_stringify_console_log → MUST FAIL (research.ts has 5 occurrences of `console.log(JSON.stringify(result, null, 2))`)
**Note:** These are static analysis tests — they read the source files and check import statements / string patterns. This is appropriate because the behavior (CLI output format) doesn't change; only the implementation pattern does.
**Test tier:** unit
**Depends on:** none

### 3b. Refactor contents.ts and research.ts to use common.ts helpers (GREEN)
**Agent:** builder
**Scope:** skills/exa-search/scripts/contents.ts, skills/exa-search/scripts/research.ts
**Test criteria:**
- test_contents_ts_imports_parseArgs_from_common → MUST PASS
- test_research_ts_imports_executeAndPrint_from_common → MUST PASS
- test_research_ts_does_not_contain_raw_JSON_stringify_console_log → MUST PASS
- `tsc --noEmit` passes
- `pnpm run lint` passes
**Changes:**
- Refactor contents.ts to use `parseArgs(import.meta.url)` from common.ts instead of manual arg parsing. Handle the special case where contents.ts first arg is a URL (not a query) — `parseArgs` returns `{ query, opts }` which maps to `{ url, opts }` by destructuring with rename.
- Refactor research.ts to use `executeAndPrint` for all `console.log(JSON.stringify(result, null, 2))` calls. The streaming case in `get` subcommand can stay manual since it writes individual chunks. The `run` subcommand's `console.error` for progress stays manual.
**Depends on:** 3a

### 4a. Write tests for PostHog insight response types (RED)
**Agent:** test-writer
**Scope:** skills/posthog-skill/scripts/__tests__/insight-types.test.ts
**Test criteria:**
- test_InsightVizNode_type_is_exported_from_posthog_client → MUST FAIL (type doesn't exist yet)
- test_InsightQuerySource_type_is_exported_from_posthog_client → MUST FAIL
- test_InsightSummary_type_is_exported_from_posthog_client → MUST FAIL
**Note:** TypeScript type exports can be verified by importing them and using `satisfies` or constructing objects that conform to the type — if the import fails at compile time, the test fails. These tests import the new types and construct sample objects to verify the shape compiles.
**Test tier:** unit
**Depends on:** 1b (depends on dead export cleanup being done first so posthog-client.ts is clean)

### 4b. Define typed interfaces for PostHog insight response (GREEN)
**Agent:** builder
**Scope:** skills/posthog-skill/scripts/lib/posthog-client.ts
**Test criteria:**
- test_InsightVizNode_type_is_exported_from_posthog_client → MUST PASS
- test_InsightQuerySource_type_is_exported_from_posthog_client → MUST PASS
- test_InsightSummary_type_is_exported_from_posthog_client → MUST PASS
- `tsc --noEmit` passes
- `pnpm run lint` passes
**Changes:**
- Add `InsightQuerySource` interface with typed fields: `kind`, `series`, `breakdownFilter`, `dateRange`, `funnelsFilter`, `trendsFilter`
- Add `InsightVizNode` interface wrapping `kind: 'InsightVizNode'` + `source: InsightQuerySource`
- Add `InsightSummary` interface for the summary output shape of `cmdCompareLive`
- Extend existing `Insight` interface's `query` field to be `InsightVizNode | InsightQuerySource | Record<string, unknown>` (or keep as `Record<string, unknown>` and have the command module narrow it)
- Export all new types
**Depends on:** 4a

### 5a. Write tests for run.ts split into command modules (RED)
**Agent:** test-writer
**Scope:** skills/posthog-skill/scripts/__tests__/cmd-modules.test.ts
**Test criteria:**
- test_lib_config_ts_exports_resolveConfig → MUST FAIL (file doesn't exist yet)
- test_lib_config_ts_exports_AppConfig_type → MUST FAIL
- test_lib_config_ts_exports_out_and_info_helpers → MUST FAIL
- test_lib_cmd_status_ts_exports_cmdStatus → MUST FAIL
- test_lib_cmd_inspect_ts_exports_cmdInspect → MUST FAIL
- test_lib_cmd_compare_ts_exports_cmdCompare → MUST FAIL
- test_lib_cmd_create_ts_exports_cmdCreate → MUST FAIL
- test_lib_cmd_flags_ts_exports_cmdFlags → MUST FAIL
- test_run_ts_is_under_80_lines → MUST FAIL (currently 502 lines)
**Note:** These tests verify the module structure exists and exports the expected functions. All existing CLI tests (status, inspect, compare, create, flags, live) must continue to pass — they test via subprocess so they're unaffected by internal restructuring.
**Test tier:** unit
**Depends on:** 4b (types must be defined before splitting, since cmd-compare.ts will use them)

### 5b. Split run.ts into command modules (GREEN)
**Agent:** builder
**Scope:** skills/posthog-skill/scripts/run.ts, skills/posthog-skill/scripts/lib/config.ts, skills/posthog-skill/scripts/lib/cmd-status.ts, skills/posthog-skill/scripts/lib/cmd-inspect.ts, skills/posthog-skill/scripts/lib/cmd-compare.ts, skills/posthog-skill/scripts/lib/cmd-create.ts, skills/posthog-skill/scripts/lib/cmd-flags.ts
**Test criteria:**
- test_lib_config_ts_exports_resolveConfig → MUST PASS
- test_lib_config_ts_exports_AppConfig_type → MUST PASS
- test_lib_config_ts_exports_out_and_info_helpers → MUST PASS
- test_lib_cmd_status_ts_exports_cmdStatus → MUST PASS
- test_lib_cmd_inspect_ts_exports_cmdInspect → MUST PASS
- test_lib_cmd_compare_ts_exports_cmdCompare → MUST PASS
- test_lib_cmd_create_ts_exports_cmdCreate → MUST PASS
- test_lib_cmd_flags_ts_exports_cmdFlags → MUST PASS
- test_run_ts_is_under_80_lines → MUST PASS
- All existing CLI tests pass (`pnpm test`)
- `tsc --noEmit` passes
- `pnpm run lint` passes
**Changes:**
- Create lib/config.ts: move `AppConfig` interface (extends `PostHogConfig`), `resolveConfig()`, `requireToken()`, `out()`, `info()`, `handleApiError()` from run.ts
- Create lib/cmd-status.ts: move `cmdStatus()`, import config helpers
- Create lib/cmd-inspect.ts: move `cmdInspect()`, `cmdInspectLive()`, import config helpers + fixtures + dashboard-spec + posthog-client
- Create lib/cmd-compare.ts: move `cmdCompare()`, `cmdCompareLive()`, use the new typed interfaces from 4b instead of `Record<string, unknown>` casts. Import config helpers + fixtures + posthog-client
- Create lib/cmd-create.ts: move `cmdCreate()`, `cmdCreateLive()`, import config helpers + fixtures + dashboard-spec + posthog-client
- Create lib/cmd-flags.ts: move `FlagsOptions`, `parseFlagsOptions()`, `cmdFlags()`, import config helpers + fixtures + posthog-client
- Slim run.ts to: imports + `cmdHelp()` + `main()` with switch dispatching to imported command functions. Target: under 80 lines.
**Depends on:** 5a

### 6a. Write tests for exa-search common.ts utilities (RED)
**Agent:** test-writer
**Scope:** skills/exa-search/scripts/__tests__/common.test.ts
**Test criteria:**
- test_requireArg_returns_value_when_present → MUST FAIL (test file doesn't exist yet)
- test_requireArg_exits_when_undefined → MUST FAIL
- test_filterOptions_picks_specified_keys → MUST FAIL
- test_filterOptions_skips_undefined_values → MUST FAIL
- test_filterOptions_returns_empty_when_no_keys_match → MUST FAIL
- test_buildContentsOptions_text_true → MUST FAIL
- test_buildContentsOptions_text_object → MUST FAIL
- test_buildContentsOptions_highlights_true → MUST FAIL
- test_buildContentsOptions_summary_true → MUST FAIL
- test_buildContentsOptions_contents_object_merges → MUST FAIL
- test_buildContentsOptions_empty_opts → MUST FAIL
- test_handleError_exits_with_code_1 → MUST FAIL
- test_createClient_returns_Exa_instance → MUST FAIL (requires EXA_API_KEY mock)
**Test tier:** unit
**Depends on:** none

### 6b. Implement exa-search test infrastructure and pass tests (GREEN)
**Agent:** builder
**Scope:** skills/exa-search/scripts/__tests__/common.test.ts (adjust if needed), package.json (via `npm pkg set`)
**Test criteria:**
- All tests from 6a → MUST PASS
- `pnpm test` passes (now includes exa-search tests)
- `tsc --noEmit` passes
- `pnpm run lint` passes
**Changes:**
- Update root package.json test script via `npm pkg set` to include exa-search tests: `tsx --test skills/posthog-skill/scripts/__tests__/*.test.ts skills/exa-search/scripts/__tests__/*.test.ts`
- Adjust test implementations if needed to handle `process.exit` mocking (use `node:test` mock utilities or test via subprocess like posthog tests do)
- No production code changes — common.ts already works, we're just adding test coverage
**Depends on:** 6a, 3b (exa-search refactoring should be done before adding tests to avoid testing stale code)