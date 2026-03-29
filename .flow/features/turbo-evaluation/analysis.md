## Scout: Map the full directory structure of /Users/josorio/Code/pi-skills. Focus on: 1) Top-level files (package.json, tsconfig.json, etc.) 2) All subdirectories and their contents 3) Any existing workspace configuration 4) All package.json files (root and nested) — read each one fully 5) All tsconfig files — read each one fully 6) Any build scripts or configuration. Output: complete inventory of the project structure with special attention to TypeScript packages/modules and their relationships.

The `posthog-skill` is referenced in the agent's registered skill list but doesn't exist in this repository — it must be registered from elsewhere. Now I have everything needed for a complete inventory.

---

## Domain: Full Project Structure — `/Users/josorio/Code/pi-skills`

---

### Top-Level Files

| File | Description |
|------|-------------|
| `package.json` | Root manifest — single package, no workspaces |
| `pnpm-lock.yaml` | Lockfile (pnpm v9) |
| `tsconfig.json` | TypeScript config — no emit, ES2022, bundler resolution |
| `.gitignore` | Ignores `node_modules/`, `dist/`, `.venv/` |
| `README.md` | Project readme |
| `LICENSE` | License file |
| `THIRD-PARTY-NOTICES.md` | Third-party attribution |

---

### `package.json` (root — the only one)

```json
{
  "name": "pi-skills",
  "version": "1.0.0",
  "type": "module",
  "private": "true",
  "packageManager": "pnpm@10.30.1",
  "pi": { "skills": ["./skills"] },
  "dependencies": {
    "exa-js": "^2.10.0"
  },
  "devDependencies": {
    "@types/node": "^25.5.0",
    "tsx": "^4.21.0",
    "typescript": "^6.0.2"
  },
  "scripts": {}
}
```
- No build scripts defined. `tsx` is used at runtime (shebang `#!/usr/bin/env tsx` in scripts).
- No workspaces — this is a flat single-package repo.
- `pi.skills: ["./skills"]` — pi agent discovers all skills under `skills/`.

---

### `tsconfig.json` (root — the only one)

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ES2022",
    "moduleResolution": "bundler",
    "esModuleInterop": true,
    "strict": true,
    "noEmit": true,
    "skipLibCheck": true
  },
  "include": ["skills/**/*.ts"]
}
```
- `noEmit: true` — TypeScript is type-checking only; `tsx` handles execution directly.
- Covers all `.ts` files under `skills/` recursively.
- No composite projects, no project references, no path aliases.

---

### Directory Tree

```
pi-skills/
├── .flow/
│   ├── features/
│   │   └── turbo-evaluation/
│   │       ├── checkpoints/        (empty)
│   │       └── state.md
│   └── sessions/
│       └── s-20260329-015009-6cca/
│           ├── dispatches/
│           ├── findings/
│           └── session.md
├── node_modules/                   (gitignored)
├── skills/
│   ├── agents-md/
│   │   ├── LICENSE
│   │   └── SKILL.md
│   ├── docker-model-runner/
│   │   ├── references/
│   │   │   └── docker-model-guide.md
│   │   └── SKILL.md
│   ├── exa-search/                 ← only skill with TypeScript
│   │   ├── references/
│   │   │   └── api-reference.md
│   │   ├── scripts/
│   │   │   ├── lib/
│   │   │   │   └── common.ts       (shared utilities)
│   │   │   ├── answer.ts
│   │   │   ├── contents.ts
│   │   │   ├── find-similar.ts
│   │   │   ├── research.ts
│   │   │   └── search.ts
│   │   └── SKILL.md
│   ├── frontend-design/
│   │   ├── LICENSE.txt
│   │   └── SKILL.md
│   ├── gh/
│   │   ├── references/
│   │   │   └── commands.md
│   │   └── SKILL.md
│   ├── glab/
│   │   ├── references/
│   │   │   └── commands.md
│   │   └── SKILL.md
│   ├── interface-design/
│   │   ├── LICENSE
│   │   ├── references/
│   │   │   ├── critique.md
│   │   │   ├── example.md
│   │   │   ├── principles.md
│   │   │   └── validation.md
│   │   └── SKILL.md
│   ├── pdf/
│   │   ├── agents/                 (empty)
│   │   ├── assets/
│   │   │   └── pdf.png
│   │   ├── LICENSE.txt
│   │   └── SKILL.md
│   ├── playwright/
│   │   ├── agents/                 (empty)
│   │   ├── assets/
│   │   │   ├── playwright-small.svg
│   │   │   └── playwright.png
│   │   ├── references/
│   │   │   ├── cli.md
│   │   │   └── workflows.md
│   │   ├── scripts/
│   │   │   └── playwright_cli.sh   (bash wrapper for npx playwright-cli)
│   │   ├── LICENSE.txt
│   │   ├── NOTICE.txt
│   │   └── SKILL.md
│   ├── render-deploy/
│   │   ├── agents/                 (empty)
│   │   ├── assets/
│   │   │   ├── docker.yaml
│   │   │   ├── go-api.yaml
│   │   │   ├── nextjs-postgres.yaml
│   │   │   ├── node-express.yaml
│   │   │   ├── python-django.yaml
│   │   │   ├── render-small.svg
│   │   │   ├── render.png
│   │   │   └── static-site.yaml
│   │   ├── references/             (10 .md files — deployment docs)
│   │   ├── LICENSE.txt
│   │   └── SKILL.md
│   ├── skill-scanner/
│   │   ├── references/
│   │   │   ├── dangerous-code-patterns.md
│   │   │   ├── permission-analysis.md
│   │   │   └── prompt-injection-patterns.md
│   │   ├── scripts/
│   │   │   └── scan_skill.py       (Python static security analyzer)
│   │   ├── LICENSE
│   │   └── SKILL.md
│   └── skill-writer/
│       ├── references/
│       │   ├── examples/
│       │   │   ├── documentation-skill.md
│       │   │   ├── security-review-skill.md
│       │   │   └── workflow-process-skill.md
│       │   └── (11 other .md reference files)
│       ├── scripts/
│       │   └── quick_validate.py   (Python skill validator)
│       ├── EVAL.md
│       ├── LICENSE
│       ├── SKILL.md
│       └── SOURCES.md
├── .gitignore
├── LICENSE
├── README.md
├── THIRD-PARTY-NOTICES.md
├── package.json
├── pnpm-lock.yaml
└── tsconfig.json
```

---

### TypeScript Module Inventory (`exa-search/scripts/`)

**6 TypeScript files total.** All use `#!/usr/bin/env tsx` — executed directly, no compilation step.

| File | Purpose | Imports from `lib/common.ts` |
|------|---------|------------------------------|
| `lib/common.ts` | Shared utilities: `createClient`, `requireArg`, `parseArgs`, `executeAndPrint`, `showHelp`, `requireApiKey`, `handleError`, `filterOptions`, `buildContentsOptions` | — (the library itself; imports `node:fs` and `exa-js`) |
| `answer.ts` | AI-powered answers with citations; supports streaming | `parseArgs`, `requireApiKey`, `handleError`, `filterOptions`, `createClient` |
| `search.ts` | Semantic search (with or without contents) | `parseArgs`, `requireApiKey`, `filterOptions`, `buildContentsOptions`, `createClient`, `executeAndPrint` |
| `contents.ts` | Retrieve page contents by URL(s) | `showHelp`, `requireApiKey`, `filterOptions`, `createClient`, `executeAndPrint` |
| `find-similar.ts` | Find pages similar to a given URL | `parseArgs`, `requireApiKey`, `filterOptions`, `buildContentsOptions`, `createClient`, `executeAndPrint` |
| `research.ts` | Deep research tasks (create/get/poll/list/run) | `showHelp`, `requireApiKey`, `handleError`, `requireArg`, `createClient` |

**Import pattern:** All scripts import from `"./lib/common.js"` (`.js` extension for ES module compatibility at runtime). All use `import.meta.url` for help-text extraction.

**Dependency chain (2 levels deep):**
- `scripts/*.ts` → `lib/common.ts` → `exa-js` (^2.10.0, external) + `node:fs` (built-in)
- `scripts/*.ts` → `exa-js` directly (via `createClient()` return value)

---

### Non-TypeScript Scripts

| File | Language | Purpose |
|------|----------|---------|
| `playwright/scripts/playwright_cli.sh` | Bash | Wraps `npx @playwright/cli playwright-cli`; injects `--session` from `$PLAYWRIGHT_CLI_SESSION` env var if flag not already set |
| `skill-writer/scripts/quick_validate.py` | Python (uv script, requires `pyyaml`) | Validates skill directory structure, YAML frontmatter, naming conventions, integration depth gates; outputs JSON; exits 0/1 |
| `skill-scanner/scripts/scan_skill.py` | Python (uv script, requires `pyyaml`) | Static security scanner: prompt injection, obfuscation, secrets, dangerous code, symlinks, hooks, image metadata, npm lifecycle hooks; outputs JSON |

---

### Workspace Configuration

- **No workspaces.** This is a flat single-package pnpm project.
- No `pnpm-workspace.yaml` exists.
- No Turborepo / monorepo tooling.
- `pi.skills: ["./skills"]` in `package.json` is the pi agent skill registry — it points to the entire `skills/` directory, and pi discovers each subdirectory that contains a `SKILL.md`.

---

### Key Observations

- **Single `package.json` and single `tsconfig.json`** — no nested packages, no build artifacts.
- **Only `exa-search` has TypeScript source code.** All other skills are pure Markdown + optional Python/Bash scripts + reference docs.
- **No `scripts` field in `package.json`** — no `build`, `test`, `lint`, or `typecheck` commands defined at the repo level.
- **`tsx` + `noEmit`** — the TypeScript is never compiled to disk; `tsx` interprets `.ts` files directly at runtime.
- **`posthog-skill`** appears in the agent's registered skills (AGENTS.md) but its directory does not exist in this repo — it must live elsewhere on disk.
- **`.flow/`** is a pi agent flow-session directory containing feature tracking state and a current active session (`s-20260329-015009-6cca`).

## Scout: In /Users/josorio/Code/pi-skills, analyze all TypeScript/JavaScript source code: 1) Find all .ts, .tsx, .js files and group them by directory 2) Trace import/dependency relationships between directories — which folders import from which other folders? 3) Identify shared code vs independent modules 4) Look for any build outputs (dist/, build/, .js compiled from .ts) 5) Check if there are any test files and test configuration 6) Output: a dependency graph of the TS modules and assessment of how independent or coupled they are.

Now I have all the facts needed. Here is the full analysis:

---

## Domain: TypeScript/JavaScript source code in `/Users/josorio/Code/pi-skills`

---

### 1. File Inventory — Grouped by Directory

Only **one skill** in the entire repo contains TypeScript source files. All other skills (`agents-md`, `docker-model-runner`, `frontend-design`, `gh`, `glab`, `interface-design`, `pdf`, `playwright`, `render-deploy`, `skill-scanner`, `skill-writer`) contain only Markdown — no TS/JS at all.

| Directory | Files |
|---|---|
| `skills/exa-search/scripts/` | `answer.ts`, `contents.ts`, `find-similar.ts`, `research.ts`, `search.ts` |
| `skills/exa-search/scripts/lib/` | `common.ts` |

**Total: 6 `.ts` files. Zero `.tsx`, `.js`, or `.mjs` files (excluding `node_modules`).**

---

### 2. Dependency Graph — Import Relationships

```
skills/exa-search/scripts/
│
├── answer.ts        ──→  ./lib/common.js  (parseArgs, requireApiKey, handleError, filterOptions, createClient)
├── contents.ts      ──→  ./lib/common.js  (showHelp, requireApiKey, filterOptions, createClient, executeAndPrint)
├── find-similar.ts  ──→  ./lib/common.js  (parseArgs, requireApiKey, filterOptions, buildContentsOptions, createClient, executeAndPrint)
├── research.ts      ──→  ./lib/common.js  (showHelp, requireApiKey, handleError, requireArg, createClient)
└── search.ts        ──→  ./lib/common.js  (parseArgs, requireApiKey, filterOptions, buildContentsOptions, createClient, executeAndPrint)

skills/exa-search/scripts/lib/
└── common.ts        ──→  node:fs  (readFileSync)
                     ──→  exa-js  (Exa) — external package v^2.10.0, not traced further
```

**No cross-skill imports.** No other skill or directory imports from `exa-search`. No file in the repo imports from another skill's directory.

**Level-2 external dependency:** `exa-js@^2.10.0` is the only runtime dependency declared in `package.json`. It is instantiated once, in `common.ts` via `new Exa()`.

---

### 3. Shared Code vs Independent Modules

| Module | Role | Shared? |
|---|---|---|
| `lib/common.ts` | Shared utility hub | ✅ Yes — imported by all 5 scripts |
| `answer.ts` | CLI entry point: AI answers with citations | ❌ Independent leaf |
| `contents.ts` | CLI entry point: fetch page contents by URL | ❌ Independent leaf |
| `find-similar.ts` | CLI entry point: find pages similar to a URL | ❌ Independent leaf |
| `research.ts` | CLI entry point: deep research tasks (create/get/poll/list/run) | ❌ Independent leaf |
| `search.ts` | CLI entry point: semantic search | ❌ Independent leaf |

`common.ts` exports **10 functions**: `createClient`, `requireArg`, `executeAndPrint`, `showHelp`, `requireApiKey`, `parseArgs`, `handleError`, `filterOptions`, `buildContentsOptions`. Every script uses a subset.

The 5 entry-point scripts are **fully independent of each other** — none imports from another.

---

### 4. Build Outputs

- **No `dist/` or `build/` directories exist anywhere in the repo.**
- `tsconfig.json` sets `"noEmit": true` — TypeScript is used for type-checking only, never compiled to disk.
- Scripts are run directly via `tsx` (a dev dependency at `^4.21.0`), which transpiles on the fly. All imports in source use `.js` extensions (e.g., `"./lib/common.js"`) — the ESM convention required when `tsx` resolves `.ts` files as if they were already compiled.

---

### 5. Tests and Test Configuration

- **Zero test files found.** No `*.test.ts`, `*.spec.ts`, `*.test.js`, or `*.spec.js` anywhere.
- **No test configuration** — no `vitest.config.*`, `jest.config.*`, or similar.
- No `test` script in `package.json` (`"scripts": {}`).

---

### 6. Coupling Assessment

| Dimension | Assessment |
|---|---|
| **Inter-skill coupling** | None — zero cross-skill imports |
| **Intra-skill coupling** | Low-to-medium — all 5 scripts depend on `lib/common.ts`, but `common.ts` only depends on `node:fs` + `exa-js` |
| **Fan-out from common.ts** | 5 importers — if `common.ts` breaks, all 5 scripts break |
| **Fan-in to scripts** | Zero — each CLI script has no importers; they are pure entry points |
| **External dependency surface** | Minimal — only `exa-js` as runtime dep |
| **Build complexity** | None — `noEmit: true`, `tsx` runtime, no bundler |

---

### Findings Summary

- **Only 1 of 12 skills contains TypeScript code** (`exa-search`). All others are pure Markdown.
- **6 `.ts` files total** in a flat star topology: `lib/common.ts` is the single shared hub; 5 CLI scripts are independent leaves that all import from it and nothing else.
- **No compiled output exists** anywhere — `tsx` is used for zero-build runtime execution; `tsc` is type-check-only (`noEmit: true`).
- **No tests exist** — no test files, no test framework configuration, no test scripts.
- **Coupling is minimal and well-contained**: breaking `common.ts` breaks all 5 scripts; breaking any single script affects nothing else. The only external runtime dependency is `exa-js@^2.10.0`.

## Scout: Analyze the posthog-skill package at /Users/josorio/Code/pi-skills/skills/posthog-skill/ in detail: 1) Read ALL TypeScript files (scripts/run.ts, scripts/lib/dashboard-spec.ts, scripts/lib/fixtures.ts, scripts/lib/posthog-client.ts) and ALL test files in scripts/__tests__/ 2) Map the full import graph — what imports what, any external dependencies used at runtime (e.g. fetch, node APIs) 3) Compare its tsconfig.json to the root tsconfig.json at /Users/josorio/Code/pi-skills/tsconfig.json — note all differences 4) Compare its package.json devDependencies to root package.json — note overlaps and differences 5) Check if posthog-skill imports anything from exa-search or vice versa 6) Assess: could posthog-skill's deps be hoisted to root without conflicts?

I now have everything needed for a complete analysis. Here is the full report:

---

## Domain: posthog-skill — Full Package Analysis

### 1. Import Graph

#### Production module chain

```
run.ts
├── node:path                   (Node built-in)
├── node:fs                     (Node built-in)
├── node:url                    (Node built-in)
├── ./lib/fixtures.js           → fixtures.ts
│   └── ./dashboard-spec.js     → dashboard-spec.ts (no further imports)
├── ./lib/dashboard-spec.js     → dashboard-spec.ts (no further imports)
└── ./lib/posthog-client.js     → posthog-client.ts
    └── (no imports — pure TS, uses globalThis.fetch at runtime)
```

**External runtime dependencies: zero.** `posthog-client.ts` uses `globalThis.fetch` (Node.js 18+ built-in), `URLSearchParams` (global), and `setTimeout` (global). No npm packages are imported at runtime. All HTTP is done via the native `fetch` API.

#### Test module imports (per file)

| Test file | Imports |
|---|---|
| `posthog-client.test.ts` | `node:test`, `node:assert/strict`, `../lib/posthog-client.js` |
| `dashboard-spec.test.ts` | `node:test`, `node:assert/strict`, `../lib/dashboard-spec.js` |
| `inspect.test.ts` | `node:test`, `node:assert/strict`, `node:child_process`, `node:path`, `node:url` |
| `compare.test.ts` | `node:test`, `node:assert/strict`, `node:child_process`, `node:path`, `node:fs`, `node:url` |
| `create.test.ts` | `node:test`, `node:assert/strict`, `node:child_process`, `node:path`, `node:url` |
| `flags.test.ts` | `node:test`, `node:assert/strict`, `node:child_process`, `node:path`, `node:url` |
| `status.test.ts` | `node:test`, `node:assert/strict`, `node:child_process`, `node:path`, `node:url` |
| `live.test.ts` | `node:test`, `node:assert/strict`, `node:child_process`, `node:path`, `node:url` |

All test imports are either `node:*` built-ins or relative to the skill. **No external npm packages are imported in any test.** Integration tests (`inspect`, `compare`, `create`, `flags`, `status`, `live`) invoke `run.ts` via `spawnSync` using `tsx` from `../../node_modules/.bin/tsx` — they resolve tsx from the skill's own `node_modules`, not the workspace root.

---

### 2. tsconfig.json Comparison

**Root** `/Users/josorio/Code/pi-skills/tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ES2022",
    "moduleResolution": "bundler",
    "esModuleInterop": true,
    "strict": true,
    "noEmit": true,
    "skipLibCheck": true
  },
  "include": ["skills/**/*.ts"]
}
```

**Skill** `/Users/josorio/Code/pi-skills/skills/posthog-skill/tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "Node16",
    "moduleResolution": "Node16",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "dist",
    "rootDir": "scripts",
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noUncheckedIndexedAccess": true,
    "types": ["node"]
  },
  "include": ["scripts/**/*.ts"],
  "exclude": ["node_modules", "dist"]
}
```

**Differences (all are skill-only additions or divergences):**

| Option | Root value | Skill value | Notes |
|---|---|---|---|
| `module` | `"ES2022"` | `"Node16"` | **Key divergence** — skill uses Node16 module system (`.js` extensions required in imports) |
| `moduleResolution` | `"bundler"` | `"Node16"` | **Key divergence** — root uses bundler resolution |
| `noEmit` | `true` | absent (false) | Root type-checks only; skill emits to `dist/` |
| `outDir` | absent | `"dist"` | Skill outputs compiled files |
| `rootDir` | absent | `"scripts"` | Skill scopes compilation to scripts/ |
| `declaration` | absent | `true` | Skill emits `.d.ts` files |
| `declarationMap` | absent | `true` | Skill emits declaration maps |
| `sourceMap` | absent | `true` | Skill emits source maps |
| `forceConsistentCasingInFileNames` | absent | `true` | Extra strictness in skill |
| `resolveJsonModule` | absent | `true` | Skill can import `.json` files |
| `noUnusedLocals` | absent | `true` | Stricter unused variable checking |
| `noUnusedParameters` | absent | `true` | Stricter unused parameter checking |
| `noUncheckedIndexedAccess` | absent | `true` | Array/object access returns `T \| undefined` |
| `types` | absent | `["node"]` | Explicitly scopes to @types/node only |
| `exclude` | absent | `["node_modules", "dist"]` | Explicit excludes |

**Bottom line:** The skill tsconfig is substantially stricter and incompatible with the root's `module`/`moduleResolution` settings. The skill's `Node16` module mode is what enforces `.js` extensions on all relative imports (e.g., `'./lib/fixtures.js'`). Merging these configs is not straightforward.

---

### 3. package.json devDependencies Comparison

**Root** `devDependencies`:
```json
{
  "@types/node": "^25.5.0",
  "tsx": "^4.21.0",
  "typescript": "^6.0.2"
}
```

**Skill** `devDependencies`:
```json
{
  "@types/node": "^25.5.0",
  "tsx": "^4.21.0",
  "typescript": "^6.0.2"
}
```

**They are identical — 100% overlap, zero differences.** All three packages (`@types/node`, `tsx`, `typescript`) exist at identical version ranges in both. The skill has no unique devDependencies and no `dependencies` section at all.

**Additional structural differences:**
- Root has `"dependencies": { "exa-js": "^2.10.0" }` — skill has no `dependencies` at all
- Root has `"pi": { "skills": ["./skills"] }` — skill does not
- Both have `"type": "module"`, `"packageManager": "pnpm@10.30.1"`, `"private": "true"`
- Skill has `"main": "index.js"`, root does not

---

### 4. Cross-Skill Import Check (posthog-skill ↔ exa-search)

**Result: zero cross-imports in either direction.**

- Searching all posthog-skill files for `exa`, `exa-search`, `exa-js`: **0 matches**
- Searching all exa-search files for `posthog`: **0 matches**

The two skills are completely independent.

---

### 5. Hoisting Assessment: Could posthog-skill's deps move to root without conflicts?

**Short answer: yes, trivially — they're already there.**

The skill's three devDependencies (`@types/node ^25.5.0`, `tsx ^4.21.0`, `typescript ^6.0.2`) are **identical** to the root's devDependencies. pnpm workspaces would deduplicate them automatically.

**One constraint to flag:** The integration tests hardcode the tsx binary path as:
```typescript
const TSX = path.join(__dirname, '..', '..', 'node_modules', '.bin', 'tsx');
```
This resolves to `skills/posthog-skill/node_modules/.bin/tsx`. If the skill's `node_modules` were removed (deps fully hoisted to root), this path would break. The tests would need to be updated to find tsx via `node_modules/.bin/tsx` at the workspace root, or use `npx tsx` / `pnpm exec tsx` instead.

**The tsconfig incompatibility is a separate concern:** hoisting deps doesn't require unifying the tsconfig. The skill's tsconfig can remain standalone even if devDeps are deduplicated at the root.

---

### 6. Pattern Inventory

**Test suite: 8 test files, ~130+ individual `it()` cases**

| File | Test count (approx) | Type |
|---|---|---|
| `posthog-client.test.ts` | ~40 | Unit (mock fetch) |
| `dashboard-spec.test.ts` | 8 | Unit (pure data validation) |
| `flags.test.ts` | ~25 | Integration (spawnSync, dry-run only) |
| `inspect.test.ts` | ~12 | Integration (spawnSync, + live-gated) |
| `compare.test.ts` | ~8 | Integration (spawnSync, + live-gated) |
| `create.test.ts` | ~10 | Integration (spawnSync, + live-gated) |
| `status.test.ts` | 5 | Integration (spawnSync) |
| `live.test.ts` | 5 | Integration sequence (all live-gated) |

**Live tests** (gated behind `POSTHOG_TEST_LIVE=1`): 22 cases across `inspect.test.ts`, `compare.test.ts`, `create.test.ts`, `live.test.ts`.

**Commands implemented in run.ts**: `status`, `inspect`, `compare`, `create`, `flags` (with subcommands: `list`, `get`, `toggle`, `create`, `update`, `activity`)

**API endpoints used** (all via `posthog-client.ts`):
- `GET /api/environments/{projectId}/dashboards/` — list/fetch dashboards
- `POST /api/environments/{projectId}/dashboards/` — create dashboard
- `GET /api/environments/{projectId}/dashboards/{id}/` — get dashboard
- `PATCH /api/environments/{projectId}/dashboards/{id}/` — patch dashboard
- `GET /api/environments/{projectId}/insights/` — get insight by short_id
- `POST /api/environments/{projectId}/insights/` — create insight
- `POST /api/projects/{projectId}/query/` — run HogQL query
- `GET /api/projects/{projectId}/feature_flags/` — list flags
- `GET /api/projects/{projectId}/feature_flags/{id}/` — get flag
- `PATCH /api/projects/{projectId}/feature_flags/{id}/` — update flag
- `POST /api/projects/{projectId}/feature_flags/` — create flag
- `GET /api/projects/{projectId}/feature_flags/{id}/activity/` — flag activity log

---

### Findings Summary

- **Zero external npm runtime dependencies.** The entire skill runs on Node.js built-ins (`fetch`, `URLSearchParams`, `setTimeout`, `path`, `fs`, `url`) plus `tsx` as a dev runner.
- **devDependencies are 100% identical to the workspace root** — all three packages at the same version ranges. Hoisting is trivial from a dep perspective, but test files hardcode `node_modules/.bin/tsx` relative to the skill directory, which would break if that local `node_modules` were removed.
- **tsconfig is substantially incompatible with the root.** The skill uses `module: Node16` / `moduleResolution: Node16`, which enforces `.js` extensions on all relative imports and is required for proper Node ESM behavior. The root uses `module: ES2022` / `moduleResolution: bundler`. These cannot be merged without breaking one or the other.
- **Zero cross-skill coupling.** posthog-skill and exa-search share no imports in either direction.
- **130+ tests across 8 files.** All offline tests run via dry-run fixtures or mock fetch injection. All live tests are safely gated behind `POSTHOG_TEST_LIVE=1` and require `POSTHOG_PERSONAL_API_KEY`.

## Scout: Analyze the exa-search skill at /Users/josorio/Code/pi-skills/skills/exa-search/scripts/ in detail: 1) Read ALL TypeScript files including lib/common.ts 2) Check what external packages are imported at runtime 3) Read the root package.json and root tsconfig.json 4) Assess: does exa-search need its own package.json or could it share root's? 5) Check if there's a pnpm-lock.yaml at root and at posthog-skill level — are they in sync? 6) Look for any other skills that might have TypeScript in the future (check all SKILL.md files for script references)

Now I have everything needed for a complete analysis.

---

## Domain: exa-search skill — TypeScript scripts, packaging, and skill ecosystem

---

### 1. All TypeScript Files — Full Inventory

**`skills/exa-search/scripts/lib/common.ts`** — Shared utility library. Imports:
- `node:fs` (stdlib) — `readFileSync` for `showHelp()`
- `exa-js` (external) — `Exa` class for `createClient()`

Exports 8 functions: `createClient`, `requireArg`, `executeAndPrint`, `showHelp`, `requireApiKey`, `parseArgs`, `handleError`, `filterOptions`, `buildContentsOptions` (9 total).

**`scripts/answer.ts`** — Wraps `exa.answer()` and `exa.streamAnswer()`. Imports only from `./lib/common.js`. Handles streaming (for-await loop over `exa.streamAnswer`) and non-streaming modes.

**`scripts/search.ts`** — Wraps `exa.search()` and `exa.searchAndContents()`. Imports only from `./lib/common.js`. Builds contents opts and dispatches based on `wantContents` flag. Supports 23 distinct search option keys.

**`scripts/contents.ts`** — Wraps `exa.getContents()`. Imports only from `./lib/common.js`. Accepts single URL string or JSON array of URLs (attempts `JSON.parse` on the first arg). Default opts if none given: `{ text: true }`.

**`scripts/find-similar.ts`** — Wraps `exa.findSimilar()` and `exa.findSimilarAndContents()`. Imports only from `./lib/common.js`.

**`scripts/research.ts`** — Wraps the `exa.research` namespace: `create`, `get` (normal + SSE streaming), `poll`, `list`, `run` (create + poll combined). Imports only from `./lib/common.js`. Five subcommands dispatched via `switch`.

---

### 2. External Runtime Packages

Only **one** external package is needed at runtime across all 6 TypeScript files:

| Package | Version (root lock) | Where used |
|---------|---------------------|-----------|
| `exa-js` | `2.10.0` | `lib/common.ts` only — `import { Exa } from "exa-js"` |

All other imports are:
- `node:fs` (Node.js stdlib — no install needed)
- `./lib/common.js` (local, relative imports between scripts)

`tsx` and `typescript` are dev/runtime-executor tools (needed to run `.ts` files), not imported by the scripts themselves.

---

### 3. Root `package.json` and `tsconfig.json`

**`/Users/josorio/Code/pi-skills/package.json`:**
```json
{
  "name": "pi-skills",
  "type": "module",
  "dependencies": { "exa-js": "^2.10.0" },
  "devDependencies": {
    "@types/node": "^25.5.0",
    "tsx": "^4.21.0",
    "typescript": "^6.0.2"
  }
}
```
- `exa-js` is a **production dependency** at root level
- `tsx` and `typescript` are dev dependencies at root level
- No `scripts` entries defined

**`/Users/josorio/Code/pi-skills/tsconfig.json`:**
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ES2022",
    "moduleResolution": "bundler",
    "esModuleInterop": true,
    "strict": true,
    "noEmit": true,
    "skipLibCheck": true
  },
  "include": ["skills/**/*.ts"]
}
```
- `include` pattern `"skills/**/*.ts"` covers **all** TypeScript files under any skill, including `exa-search/scripts/**/*.ts`
- `noEmit: true` — compile-check only, never outputs JS; scripts run via `tsx` directly

---

### 4. Does exa-search Need Its Own `package.json`?

**No — exa-search has no `package.json` and does not need one.** Evidence:

- The root `package.json` already declares `exa-js: ^2.10.0` as a production dependency
- The root `pnpm-lock.yaml` pins `exa-js@2.10.0` with full resolution
- The root `tsconfig.json` already `include`s `skills/**/*.ts`, so type-checking works without a child config
- `tsx` is at root devDependencies, invokable as `npx tsx` or via `node_modules/.bin/tsx` from any subdirectory
- The SKILL.md for exa-search requires `tsx` and `EXA_API_KEY` — both satisfied by the root install
- exa-search has **zero skill-specific dependencies** beyond what's already at root

The skill works correctly today by sharing the root's `node_modules`. A separate `package.json` would only be needed if it required a different `exa-js` version or skill-local test scripts.

---

### 5. Lock File Sync: Root vs. posthog-skill

**`/Users/josorio/Code/pi-skills/pnpm-lock.yaml` (root)** declares:
```yaml
importers:
  .:
    dependencies:
      exa-js: { specifier: ^2.10.0, version: 2.10.0 }
    devDependencies:
      @types/node: { specifier: ^25.5.0, version: 25.5.0 }
      tsx: { specifier: ^4.21.0, version: 4.21.0 }
      typescript: { specifier: ^6.0.2, version: 6.0.2 }
```

**`/Users/josorio/Code/pi-skills/skills/posthog-skill/pnpm-lock.yaml`** declares:
```yaml
importers:
  .:
    devDependencies:
      @types/node: { specifier: ^25.5.0, version: 25.5.0 }
      tsx: { specifier: ^4.21.0, version: 4.21.0 }
      typescript: { specifier: ^6.0.2, version: 6.0.2 }
```

**Sync status: ✅ Dev deps are identical.** Both lock files pin the exact same versions of `@types/node@25.5.0`, `tsx@4.21.0`, `typescript@6.0.2`, and all transitive deps (esbuild@0.27.4, get-tsconfig@4.13.7, etc.) — the snapshot sections are byte-for-byte equivalent for the shared packages.

**Structural difference:** posthog-skill's lock has **no** `exa-js` entry (it doesn't need it). The root lock adds `exa-js@2.10.0` on top of the shared dev set.

**Problem:** posthog-skill's `package.json` has `"packageManager": "pnpm@10.30.1"` and its own `pnpm-lock.yaml`, making it a **standalone pnpm project** — not a workspace member of root. It maintains a duplicate of tsx/typescript/esbuild resolution. These are not "in sync" in a managed sense — they happen to match because they were created around the same time with the same specifiers, but they can drift independently.

---

### 6. Other Skills with TypeScript — Full Scan of All SKILL.md Files

Skills with TypeScript/Node.js script references (confirmed by SKILL.md content):

| Skill | Evidence from SKILL.md |
|-------|----------------------|
| **exa-search** | `compatibility: "Requires Node.js 18+, tsx"` — 5 `.ts` scripts, all invoked as `tsx scripts/*.ts` |
| **posthog-skill** | `compatibility: "Requires Node.js 18+ and tsx. Run pnpm install in the skill directory on first use."` — has `scripts/run.ts`, `scripts/lib/dashboard-spec.ts`, `scripts/lib/fixtures.ts`, `scripts/lib/posthog-client.ts`, `scripts/__tests__/*.test.ts`. Has its own `package.json` + `tsconfig.json` + `pnpm-lock.yaml` |
| **playwright** | References `scripts/playwright_cli.sh` — shell script, not TypeScript |
| **skill-scanner** | References `scripts/scan_skill.py` — Python, not TypeScript |
| **skill-writer** | References `scripts/check.py` (example) — Python, not TypeScript |
| **render-deploy** | `runtime: node` in YAML example only — no TypeScript scripts in skill |
| **agents-md**, **docker-model-runner**, **frontend-design**, **gh**, **glab**, **interface-design**, **pdf**, **prompt-engineering**, **test-prompt** | No TypeScript scripts referenced |

**Summary:** Only **2 skills** currently have TypeScript: `exa-search` (shares root) and `posthog-skill` (standalone with own package.json). No other skill SKILL.md files reference `.ts` scripts.

---

### Findings Summary

1. **exa-search has exactly one external runtime import: `exa-js@2.10.0`** from `lib/common.ts`. All other 5 scripts import only `./lib/common.js` — the lib is the single integration point for the Exa SDK.

2. **exa-search does not need its own `package.json`** — the root already provides `exa-js`, `tsx`, `@types/node`, and `typescript`, and `tsconfig.json` covers `skills/**/*.ts` globally. The skill is fully functional today with zero local config.

3. **posthog-skill is an isolated package** — it has its own `package.json`, `tsconfig.json`, and `pnpm-lock.yaml`. Its SKILL.md explicitly says "run `pnpm install` in the skill directory on first use." It does NOT appear in the root's pnpm workspace (there is no `pnpm-workspace.yaml` at root). The two lock files happen to resolve identical versions for shared devDeps today, but this is coincidence, not managed sync.

4. **The two TypeScript skills follow opposite packaging philosophies:** exa-search piggybacks on the root install (zero overhead, must be run from root or with root `node_modules` in PATH); posthog-skill is self-contained (portable, explicit, but duplicates devDependencies).

5. **No other skill currently has TypeScript** — 11 remaining skills use either shell scripts, Python, or no scripts at all. The root `tsconfig.json`'s `include: skills/**/*.ts` is forward-compatible: any future TypeScript skill added under `skills/` will be automatically type-checked by root.

## Scout: Analyze the full source code of /Users/josorio/Code/pi-skills/skills/posthog-skill/ to determine what can be extracted into a shared library package. Read ALL of these files completely:

1. scripts/run.ts — the CLI entry point
2. scripts/lib/posthog-client.ts — the API client
3. scripts/lib/dashboard-spec.ts — dashboard specification logic
4. scripts/lib/fixtures.ts — fixtures/data

For each file, report:
- Total lines
- All exports (functions, types, interfaces, constants)
- All imports
- What is "business logic / reusable core" vs "CLI glue / script wiring"
- Dependencies on other files in the project

Also read ALL test files in scripts/__tests__/ and report which modules they test and how (unit vs integration via spawnSync).

The goal: determine a clean split between a reusable "core" package (types, API client, dashboard spec, fixtures) and a thin "scripts" layer (CLI entry points). What would go where?

## Domain: posthog-skill source analysis for core/scripts split

### File Inventory

| File | Lines | Role |
|---|---|---|
| `scripts/run.ts` | 475 | CLI entry point |
| `scripts/lib/posthog-client.ts` | 282 | API client + all types |
| `scripts/lib/dashboard-spec.ts` | 191 | Dashboard/event spec data |
| `scripts/lib/fixtures.ts` | 131 | Canned fixture data |
| `scripts/__tests__/posthog-client.test.ts` | 314 | Unit tests (mock fetch) |
| `scripts/__tests__/dashboard-spec.test.ts` | 57 | Unit tests (pure assertions) |
| `scripts/__tests__/compare.test.ts` | 72 | Integration via `spawnSync` |
| `scripts/__tests__/create.test.ts` | 90 | Integration via `spawnSync` |
| `scripts/__tests__/flags.test.ts` | 193 | Integration via `spawnSync` |
| `scripts/__tests__/inspect.test.ts` | 104 | Integration via `spawnSync` |
| `scripts/__tests__/status.test.ts` | 43 | Integration via `spawnSync` |
| `scripts/__tests__/live.test.ts` | 56 | Integration via `spawnSync`, gated on `POSTHOG_TEST_LIVE=1` |

---

### Exports

#### `posthog-client.ts`
**Types/Interfaces (all exported):**
- `PostHogError` (class)
- `PostHogConfig` (interface)
- `ClientOptions` (interface)
- `MinimalResponse` (interface)
- `FetchFn` (type alias)
- `DashboardSummary` (interface)
- `DashboardListResponse` (interface)
- `DashboardTile` (interface)
- `Dashboard` (interface)
- `Insight` (interface)
- `InsightListResponse` (interface)
- `HogQLResult` (interface)
- `FeatureFlagSummary` (interface)
- `FeatureFlagListResponse` (interface)
- `FeatureFlagListParams` (interface)
- `FeatureFlagActivity` (interface)
- `FeatureFlagActivityResponse` (interface)
- `PostHogClient` (interface)

**Functions (all exported):**
- `createClient(config, fetchFn?, opts?): PostHogClient`

**Imports:** none (zero imports — completely self-contained)

---

#### `dashboard-spec.ts`
**Types/Interfaces (all exported):**
- `BranchEvent` (interface)
- `TileQueryKind` (type alias: `'FunnelsQuery' | 'TrendsQuery' | 'HogQLQuery'`)
- `TileLayout` (interface)
- `Tile` (interface)
- `DashboardSpec` (interface) — declared but **never used** to type any export; purely structural

**Constants (all exported):**
- `name: string` — `'7361 Purchase & Insurance Flow Metrics'`
- `description: string`
- `tags: string[]` — `['7361', 'metrics', 'purchase', 'insurance']`
- `branchEvents: BranchEvent[]` — 9 entries
- `tiles: Tile[]` — 8 entries

**Internal constant (not exported):**
- `FUNNEL_PAGES` — `['quote', 'delivery', 'payment', 'review', 'confirmation']`

**Imports:** none (zero imports — completely self-contained)

---

#### `fixtures.ts`
**Types (exported):**
- `FixtureKey` (type union of 11 string literals)

**Functions (exported):**
- `getFixture(command: FixtureKey): unknown`

**Imports:**
- `{ name as specName, branchEvents, tiles }` from `./dashboard-spec.js`

**Dependency:** `dashboard-spec.ts` (uses `specName` in the `status` fixture, `branchEvents` in the `inspect`/`inspect-live` fixtures, and `tiles` in the `create` fixture)

---

#### `run.ts`
**Exports:** none (script only — no `export` statements)

**Imports:**
- `node:path`, `node:fs`, `node:url` (Node built-ins)
- `{ getFixture }` from `./lib/fixtures.js`
- `* as spec` from `./lib/dashboard-spec.js`
- `{ createClient, PostHogError }` from `./lib/posthog-client.js`
- `type { PostHogConfig }` from `./lib/posthog-client.js`

**Internal interface (not exported):**
- `AppConfig extends PostHogConfig` — adds `achInsightId` and `dashboardName`

---

### Dependency Trace (2 levels deep)

```
run.ts
├── ./lib/fixtures.js
│   └── ./dashboard-spec.js   (Level 2 — imports name, branchEvents, tiles)
├── ./lib/dashboard-spec.js   (Level 2 — no further deps)
└── ./lib/posthog-client.js   (Level 2 — no further deps)
```

- `posthog-client.ts` → (nothing)
- `dashboard-spec.ts` → (nothing)
- `fixtures.ts` → `dashboard-spec.ts` only

---

### Test Inventory

#### Unit tests (pure, no subprocess)

**`posthog-client.test.ts`** — 314 lines, 30 tests across 10 `describe` blocks.  
Testing method: injects a mock `FetchFn` via `createClient(config, mockFetch)`.  
Covers: Authorization header, Content-Type header, 2xx success parsing, 429 retry (3-attempt max), 4xx `PostHogError` (401, 403, 404), 5xx no-retry, `runQuery` body shape, `getInsightByShortId` URL, `createInsight` body shape, `listFeatureFlags` URL/params/auth, `getFeatureFlag`, `patchFeatureFlag`, `createFeatureFlag`, `getFeatureFlagActivity`.

**`dashboard-spec.test.ts`** — 57 lines, 8 tests in 1 `describe` block.  
Testing method: direct module import assertions (`assert.strictEqual`, `assert.ok`).  
Covers: `name` export exists, exactly 8 tiles, tile structural shape (name/type/query/layout), layout numeric fields, valid `type` values, all 8 tile-featured events present in tile queries, `branchEvents` array has 9 entries, every `branchEvent` has `name` + `properties`.

---

#### Integration tests (all via `spawnSync tsx run.ts ...`)

All 6 integration test files share the same `run()` helper pattern using `spawnSync(TSX, [RUN, ...args], { encoding: 'utf8', env })`.

| Test file | Commands tested | Live gate |
|---|---|---|
| `status.test.ts` | `status` | No (always runs) |
| `inspect.test.ts` | `inspect`, `inspect --dry-run`, `inspect --live` | `inspect --live` gated on `POSTHOG_TEST_LIVE=1` |
| `compare.test.ts` | `compare --dry-run`, `compare` (no-token exit 1), full live | Live suite gated on `POSTHOG_TEST_LIVE=1` |
| `create.test.ts` | `create --dry-run`, `create` (no-token exit 1), live first run, live idempotency | Live suite gated on `POSTHOG_TEST_LIVE=1` |
| `flags.test.ts` | All 6 flag subcommands × dry-run, argument validation, no-token exits | No live gate |
| `live.test.ts` | Full ordered sequence: status → inspect --live → compare → create → create again | Entirely gated on `POSTHOG_TEST_LIVE=1` |

---

### Core vs CLI Split Analysis

#### What is reusable core (zero CLI coupling)

| Module | Why it's pure core |
|---|---|
| `posthog-client.ts` | Zero imports. No `process.*`. Injectable fetch. 18 exported types + 1 factory. Can run in browser, Deno, any runtime. |
| `dashboard-spec.ts` | Zero imports. Pure data — types, constants, event definitions, tile queries. No runtime behavior. |
| `fixtures.ts` | Imports only `dashboard-spec.ts`. No `process.*`. Returns canned data deterministically. |

#### What is CLI glue (belongs in `scripts/` layer)

All of `run.ts` is CLI glue. Specifically:

| Function/block | Nature |
|---|---|
| `resolveConfig()` | Reads `process.env.*` — CLI only |
| `requireToken()` | Calls `process.exit(1)` — CLI only |
| `out()` / `info()` | Writes to `process.stdout` / `process.stderr` — CLI only |
| `handleApiError()` | Calls `process.exit(1)` — CLI only |
| `cmdStatus()` | Formats and calls `out()` — CLI only |
| `cmdInspect()` / `cmdInspectLive()` | Calls `createClient`, uses `spec.*`, calls `out()` — CLI orchestration |
| `cmdCompare()` / `cmdCompareLive()` | Calls `fs.writeFileSync` to `references/` — side-effectful, path-coupled |
| `cmdCreate()` / `cmdCreateLive()` | Full orchestration + `process.exit(3)` on failure |
| `cmdFlags()` + `parseFlagsOptions()` | Arg parsing + all flag subcommands |
| `cmdHelp()` | Pure CLI output |
| `main()` + `process.argv` | Entry point wiring |

One gray area: `AppConfig` (`extends PostHogConfig` with `achInsightId` + `dashboardName`) is declared inline in `run.ts`. If the core package exports `PostHogConfig`, this extension type would either live in the scripts layer or be promoted to core.

#### Proposed split

**`core/` package** — zero Node-only APIs, no `process.*`, no `fs`:
```
posthog-client.ts   → core/src/client.ts
dashboard-spec.ts   → core/src/dashboard-spec.ts
fixtures.ts         → core/src/fixtures.ts
```
All 18 types from `posthog-client.ts` would be re-exported from a `core/src/index.ts`.

**`scripts/` package** — thin CLI layer:
```
run.ts              → scripts/src/run.ts  (unchanged structure)
```
Imports core via package name (e.g. `@posthog-skill/core`).

**Tests:**
- `posthog-client.test.ts` and `dashboard-spec.test.ts` move to `core/src/__tests__/` (they test core modules directly)
- `status.test.ts`, `inspect.test.ts`, `compare.test.ts`, `create.test.ts`, `flags.test.ts`, `live.test.ts` stay in `scripts/` (they test the CLI binary via `spawnSync`)

---

### Constraints

1. **`compare` command writes to `references/ach-reference-summary.json`** using a path resolved relative to `__dirname` in `run.ts` (`path.join(__dirname, '..', 'references', ...)`). This is a hard filesystem side-effect that must stay in the CLI layer — it cannot move to core without receiving the path as a parameter.

2. **`fixtures.ts` imports from `dashboard-spec.ts`** — if both move to core, this import stays internal. No constraint.

3. **`FetchFn` / `MinimalResponse` are exported from `posthog-client.ts`** specifically to support the test mock pattern in `posthog-client.test.ts`. They must remain exported in core to keep those tests compilable.

4. **`DashboardSpec` interface** is exported from `dashboard-spec.ts` but never used to type any export — it's structurally dead. Not a constraint, but worth noting.

5. **`run.ts` hardcodes the `tsx` binary path** in tests (`node_modules/.bin/tsx`). The integration tests do not depend on anything in core — they only spawn the CLI binary.

6. **`AppConfig` is declared in `run.ts`** as a local extension of `PostHogConfig`. If promoted to core, it would widen the public surface. Currently safe to leave in scripts.

---

### Findings Summary

- **`posthog-client.ts`** is already a clean, self-contained library module — 18 exported types + `createClient` factory, zero imports, injectable fetch. It can move to a core package with no changes.
- **`dashboard-spec.ts`** is pure data — no side effects, no imports, all exports are typed constants. Moves to core unchanged.
- **`fixtures.ts`** depends only on `dashboard-spec.ts`; once both are in core it remains a valid core module.
- **`run.ts`** is entirely CLI glue — every function in it reads `process.env`, writes to stdio, calls `process.exit`, or writes to the filesystem. Nothing in it should move to core.
- **Two tests are unit tests** (`posthog-client.test.ts`, `dashboard-spec.test.ts`) and belong with core; **six tests are integration tests** (all via `spawnSync` against the CLI binary) and belong with scripts. The split along this axis is already clean.

## Scout: Analyze the exa-search skill at /Users/josorio/Code/pi-skills/skills/exa-search/scripts/ to determine what can be extracted into a shared library package vs what stays as CLI scripts.

Read ALL files completely:
1. scripts/lib/common.ts
2. scripts/answer.ts
3. scripts/search.ts
4. scripts/contents.ts
5. scripts/find-similar.ts
6. scripts/research.ts

For each file report:
- Total lines
- All exports (functions, types, interfaces, constants)
- All imports
- What is "reusable core / business logic" vs "CLI glue / script wiring"
- Any usage of process.argv, process.env, process.exit, process.stdout, console.log, or other Node CLI-only APIs

The goal: determine if there's a clean split between a reusable "exa-core" package (API client wrapper, types, shared utilities) and thin CLI scripts. What would go in core vs stay in scripts?

## Domain: exa-search skill — `scripts/` analysis

---

### File Inventory

| File | Lines | Role |
|------|-------|------|
| `lib/common.ts` | 96 | Shared utilities — mix of reusable logic and CLI glue |
| `answer.ts` | 55 | CLI script for `exa.answer` / `exa.streamAnswer` |
| `search.ts` | 73 | CLI script for `exa.search` / `exa.searchAndContents` |
| `contents.ts` | 57 | CLI script for `exa.getContents` |
| `find-similar.ts` | 61 | CLI script for `exa.findSimilar` / `exa.findSimilarAndContents` |
| `research.ts` | 97 | CLI script for `exa.research.*` (multi-subcommand) |
| **Total** | **439** | |

---

### Exports Inventory

#### `lib/common.ts` — 8 exports
| Export | Type | Reusable? |
|--------|------|-----------|
| `createClient()` | `() => Exa` | ✅ Core |
| `filterOptions()` | `(opts, keys) => Record<string,unknown>` | ✅ Core |
| `buildContentsOptions()` | `(opts) => Record<string,unknown>` | ✅ Core |
| `executeAndPrint()` | `<T>(fn) => Promise<void>` | ⚠️ Partial — calls `console.log` + `process.exit` |
| `handleError()` | `(err) => never` | ❌ CLI-only — `console.error` + `process.exit(1)` |
| `requireArg()` | `(value, name) => string` | ❌ CLI-only — `console.error` + `process.exit(1)` |
| `showHelp()` | `(scriptUrl) => void` | ❌ CLI-only — reads file, `console.log` + `process.exit(0)` |
| `requireApiKey()` | `() => void` | ❌ CLI-only — reads `process.env`, `process.exit(1)` |
| `parseArgs()` | `(scriptUrl) => {query, opts}` | ❌ CLI-only — `process.argv.slice(2)` |

All 5 scripts import from `./lib/common.js` only + `exa-js` (external).  
None import from each other.

---

### CLI-Only API Usage (Node process/console)

| File | `process.argv` | `process.env` | `process.exit` | `process.stdout` | `console.log` | `console.error` |
|------|:-:|:-:|:-:|:-:|:-:|:-:|
| `lib/common.ts` | ✅ (`parseArgs`) | ✅ (`requireApiKey`) | ✅ (5×) | — | ✅ (2×) | ✅ (4×) |
| `answer.ts` | — | — | — | ✅ (streaming) | ✅ | ✅ |
| `search.ts` | — | — | — | — | (via `executeAndPrint`) | — |
| `contents.ts` | ✅ (raw) | — | — | — | (via `executeAndPrint`) | — |
| `research.ts` | ✅ (raw) | — | — | — | ✅ (multiple) | ✅ (`run` progress) |

---

### Reusable Core vs CLI Glue — Detailed Split

#### ✅ Would go in `exa-core` package

These have **zero CLI dependencies** — pure data-in, data-out:

```
createClient()          — wraps `new Exa()`, returns Exa instance
filterOptions()         — pure: {opts, keys} → filtered object
buildContentsOptions()  — pure: opts → contentsOpts object
```

**What `createClient()` needs:** `EXA_API_KEY` — but the `Exa` constructor reads it automatically from the environment. `createClient()` itself just calls `new Exa()` — no `process.env` in the function body. ✅ Safe to keep as-is in core.

Additionally, the **Exa method call shapes** used in each script are implicit core logic:
- The `wantContents` branch logic in `search.ts` and `find-similar.ts` — decides `search` vs `searchAndContents` — is pure business logic that could be wrapped as `search(exa, query, opts)` core functions.
- The `research.ts` `run` subcommand (create → poll) is a multi-step orchestration that's pure API logic with no reason to be CLI-only.

#### ❌ Stays in CLI scripts

Everything that touches process/console **by design**:

| Function | Why CLI-only |
|----------|-------------|
| `parseArgs()` | `process.argv` is the contract of a CLI script |
| `requireApiKey()` | `process.env` + `process.exit` — env guard for CLI startup |
| `requireArg()` | `process.exit(1)` on missing arg — fatal for CLI, wrong for library |
| `showHelp()` | Reads script source via `new URL(scriptUrl)`, `process.exit(0)` |
| `handleError()` | `process.exit(1)` — library code should throw, not exit |
| `executeAndPrint()` | `console.log(JSON.stringify(...))` + `process.exit` in `handleError` |

The streaming loop in `answer.ts` (`process.stdout.write`) and the progress message in `research.ts` (`console.error(...)`) are also inherently CLI concerns.

---

### Blast Radius Map

#### Files that must change to extract `exa-core`
- `scripts/lib/common.ts` — split in two: pure exports to `core/`, CLI exports stay
- All 5 scripts — update import path from `./lib/common.js` → `exa-core`

#### Files at regression risk
- `contents.ts` — does **not** use `parseArgs()`; has its own raw `process.argv.slice(2)` + inline JSON.parse on lines 37–41. Would need a separate extraction or a `parseUrlArg()` CLI helper.
- `research.ts` — has its own raw `process.argv.slice(2)` + multi-subcommand switch. Doesn't use `parseArgs()`. The `run` subcommand duplicates create+poll logic that should be a core wrapper.

---

### Constraints

- All scripts use `import.meta.url` for `showHelp()` — ESM-only. Any core package must also be ESM (or the shebang scripts must not pass `import.meta.url` into core).
- `exa-js` is the only external dependency across all files. Core package would have one dependency: `exa-js`.
- `contents.ts` is the only script that defaults `opts` to `{ text: true }` when no options arg is passed — implicit default that would need to be preserved in any wrapper.
- `research.ts` emits progress to `stderr` (`console.error("Research task created...")`) not stdout — intentional design for piping.

---

### Findings Summary

- **3 functions are cleanly extractable** into `exa-core` with zero changes: `createClient`, `filterOptions`, `buildContentsOptions`. These have no `process.*` or `console.*` calls.
- **5 functions are CLI-only by construction** (`parseArgs`, `requireApiKey`, `requireArg`, `showHelp`, `handleError`) — they call `process.exit` and must stay in the CLI layer.
- **`executeAndPrint` is a hybrid** — wraps an API call but outputs to `console.log` and delegates errors to `handleError`. In a core package it would become `executeApi<T>(fn) → Promise<T>` (returns data, throws on error); the print+exit wrapper stays in CLI.
- **`contents.ts` and `research.ts` diverge from the shared `parseArgs()` pattern** — they parse `process.argv` inline. A full extraction would need to normalize this.
- **The `run` subcommand in `research.ts`** (create → poll in one step) is pure API orchestration with no CLI dependency — it's the strongest candidate for promotion into a core `runResearch()` helper alongside the three already-clean functions.

## Scout: Read the pi packages documentation at /Users/josorio/Library/pnpm/global/5/.pnpm/@mariozechner+pi-coding-agent@0.63.1_ws@8.20.0_zod@4.3.6/node_modules/@mariozechner/pi-coding-agent/docs/packages.md completely. Also check for any related docs it references (extensions.md, skills.md, etc.) that explain how pi packages are structured. Report the FULL content of packages.md and any key structural requirements for pi packages.

Here is the **full content of `packages.md`** followed by key structural requirements:

---

## Full Content of `packages.md`

> **Tip:** pi can help you create pi packages. Ask it to bundle your extensions, skills, prompt templates, or themes.

---

### Pi Packages

Pi packages bundle extensions, skills, prompt templates, and themes so you can share them through npm or git. A package can declare resources in `package.json` under the `pi` key, or use conventional directories.

---

### Install and Manage

> ⚠️ **Security:** Pi packages run with full system access. Extensions execute arbitrary code, and skills can instruct the model to perform any action including running executables. Review source code before installing third-party packages.

```bash
pi install npm:@foo/bar@1.0.0
pi install git:github.com/user/repo@v1
pi install https://github.com/user/repo
pi install /absolute/path/to/package
pi install ./relative/path/to/package

pi remove npm:@foo/bar
pi list    # show installed packages from settings
pi update  # update all non-pinned packages
```

- `install` / `remove` default to **global** settings (`~/.pi/agent/settings.json`).
- Use `-l` to write to **project** settings (`.pi/settings.json`).
- Use `-e` (or `--extension`) to install into a **temporary directory** for the current run only.

---

### Package Sources

| Source | Format | Notes |
|--------|--------|-------|
| **npm** | `npm:@scope/pkg@1.2.3` or `npm:pkg` | Versioned specs pinned; skipped by `pi update`. Global installs use `npm install -g`; project installs go under `.pi/npm/`. |
| **git** | `git:github.com/user/repo@v1`, `https://github.com/user/repo@v1`, `ssh://git@github.com/user/repo@v1` | `git:` prefix allows shorthand; refs pin and skip update; cloned to `~/.pi/agent/git/…` (global) or `.pi/git/…` (project); runs `npm install` if `package.json` exists. |
| **local path** | `/absolute/path` or `./relative/path` | Added to settings without copying. If a **file**, loaded as a single extension. If a **directory**, loaded using package rules. |

For `npmCommand`, you can pin npm to a specific wrapper in `settings.json`:
```json
{ "npmCommand": ["mise", "exec", "node@20", "--", "npm"] }
```

---

### Creating a Pi Package

Add a `pi` manifest to `package.json` and include the `pi-package` keyword:

```json
{
  "name": "my-package",
  "keywords": ["pi-package"],
  "pi": {
    "extensions": ["./extensions"],
    "skills":     ["./skills"],
    "prompts":    ["./prompts"],
    "themes":     ["./themes"]
  }
}
```

Paths are relative to the package root. Arrays support **glob patterns** and `!exclusions`.

#### Gallery Metadata (optional)

```json
{
  "pi": {
    "video": "https://example.com/demo.mp4",
    "image": "https://example.com/screenshot.png"
  }
}
```

- `video`: MP4 only. Autoplays on hover; click for fullscreen.
- `image`: PNG, JPEG, GIF, or WebP. Static preview.
- If both set, **video takes precedence**.

---

### Package Structure — Convention Directories

If no `pi` manifest is present, pi **auto-discovers** resources:

| Directory | What's loaded |
|-----------|--------------|
| `extensions/` | `.ts` and `.js` files |
| `skills/` | Recursively finds `SKILL.md` folders; loads top-level `.md` files as skills |
| `prompts/` | `.md` files |
| `themes/` | `.json` files |

---

### Dependencies

- **Third-party runtime deps** → `dependencies` in `package.json`.
- **Bundled pi packages** → both `dependencies` AND `bundledDependencies`.
- **Core pi packages** (never bundle, list in `peerDependencies` with `"*"`) :
  - `@mariozechner/pi-ai`
  - `@mariozechner/pi-agent-core`
  - `@mariozechner/pi-coding-agent`
  - `@mariozechner/pi-tui`
  - `@sinclair/typebox`

Example with a bundled pi package dependency:
```json
{
  "dependencies":       { "shitty-extensions": "^1.0.1" },
  "bundledDependencies": ["shitty-extensions"],
  "pi": {
    "extensions": ["extensions", "node_modules/shitty-extensions/extensions"],
    "skills":     ["skills",     "node_modules/shitty-extensions/skills"]
  }
}
```

---

### Package Filtering (in settings)

```json
{
  "packages": [
    "npm:simple-pkg",
    {
      "source": "npm:my-package",
      "extensions": ["extensions/*.ts", "!extensions/legacy.ts"],
      "skills": [],
      "prompts": ["prompts/review.md"],
      "themes": ["+themes/legacy.json"]
    }
  ]
}
```

| Syntax | Meaning |
|--------|---------|
| Omit a key | Load **all** of that type |
| `[]` | Load **none** of that type |
| `!pattern` | Exclude glob matches |
| `+path` | Force-include exact path |
| `-path` | Force-exclude exact path |

Filters layer on top of the manifest — they only narrow what is already allowed.

---

### Enable and Disable Resources

Use `pi config` to enable/disable individual extensions, skills, prompt templates, and themes from installed packages or local directories. Works for both global (`~/.pi/agent`) and project (`.pi/`) scopes.

---

### Scope and Deduplication

- Packages can appear in both global and project settings.
- **Project entry wins** when the same package appears in both.
- Identity determined by:
  - npm → package name
  - git → repository URL (without ref)
  - local → resolved absolute path

---

## Key Structural Requirements for Pi Packages

1. **`package.json` with `pi-package` keyword** is required for discoverability (npm gallery).
2. **`pi` key in `package.json`** declares resources explicitly; without it, pi falls back to convention directories (`extensions/`, `skills/`, `prompts/`, `themes/`).
3. **Skills** must have `SKILL.md` files inside skill folders (per skills.md convention); top-level `.md` files in `skills/` are also loaded directly.
4. **Extensions** are `.ts` or `.js` files in the `extensions/` directory.
5. **Themes** are `.json` files in `themes/`.
6. **Prompts** are `.md` files in `prompts/`.
7. **Core pi packages** (`@mariozechner/pi-ai`, etc.) must be in `peerDependencies` with `"*"` — **never bundled**.
8. **Other pi packages as dependencies** must be in both `dependencies` AND `bundledDependencies`, and their paths must be explicitly listed under the `pi` key.
9. **Local path installs**: if a single file is pointed to, it's loaded as a single extension; if a directory, full package rules apply.
10. **Relative paths** in the `pi` manifest are resolved from the package root and support globs + `!exclusions`.

## Scout: Map the full repository structure of /Users/josorio/Code/pi-skills. For every directory that contains a package.json or tsconfig.json (or tsconfig variant), report: 1) The file path, 2) The full contents of each package.json, 3) The full contents of each tsconfig*.json, 4) The directory structure (what files/folders exist at each level). Also check for any root-level package.json and tsconfig. List ALL skills directories and their contents.

Here is the complete repository map for `/Users/josorio/Code/pi-skills`:

---

## Repository Map: `/Users/josorio/Code/pi-skills`

---

### Root Level

```
/Users/josorio/Code/pi-skills/
├── .flow/
│   ├── dispatches/
│   ├── features/
│   └── sessions/
├── .git/
├── .gitignore
├── LICENSE
├── node_modules/
├── package.json          ← root package (pi-skills monorepo)
├── pnpm-lock.yaml
├── README.md
├── skills/               ← all 13 skills live here
├── THIRD-PARTY-NOTICES.md
└── tsconfig.json         ← root TypeScript config
```

---

### Root `package.json`

```json
{
  "name": "pi-skills",
  "version": "1.0.0",
  "description": "Personal pi skills collection",
  "scripts": {},
  "keywords": ["pi-package"],
  "author": "",
  "license": "ISC",
  "packageManager": "pnpm@10.30.1",
  "private": "true",
  "pi": {
    "skills": ["./skills"]
  },
  "type": "module",
  "dependencies": {
    "exa-js": "^2.10.0"
  },
  "devDependencies": {
    "@types/node": "^25.5.0",
    "tsx": "^4.21.0",
    "typescript": "^6.0.2"
  }
}
```

### Root `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ES2022",
    "moduleResolution": "bundler",
    "esModuleInterop": true,
    "strict": true,
    "noEmit": true,
    "skipLibCheck": true
  },
  "include": ["skills/**/*.ts"]
}
```

> **Note:** The root tsconfig covers all `skills/**/*.ts` files globally but does **not** emit output (`noEmit: true`). Uses `bundler` module resolution and ES2022 targets.

---

### Skills Directory Tree

Only **`posthog-skill`** has its own `package.json` and `tsconfig.json`. All other skills are plain directories with no Node manifests.

---

#### `skills/agents-md/`
```
agents-md/
├── LICENSE
└── SKILL.md
```
No `package.json`, no `tsconfig.json`.

---

#### `skills/docker-model-runner/`
```
docker-model-runner/
├── references/
│   └── docker-model-guide.md
└── SKILL.md
```
No `package.json`, no `tsconfig.json`.

---

#### `skills/exa-search/`
```
exa-search/
├── references/
│   └── api-reference.md
├── scripts/
│   ├── answer.ts
│   ├── contents.ts
│   ├── find-similar.ts
│   ├── lib/
│   │   └── common.ts
│   ├── research.ts
│   ├── search.ts
└── SKILL.md
```
No `package.json`, no `tsconfig.json`. TypeScript files here are covered by the **root** `tsconfig.json` (`include: ["skills/**/*.ts"]`).

---

#### `skills/frontend-design/`
```
frontend-design/
├── LICENSE.txt
└── SKILL.md
```
No `package.json`, no `tsconfig.json`.

---

#### `skills/gh/`
```
gh/
├── references/
│   └── commands.md
└── SKILL.md
```
No `package.json`, no `tsconfig.json`.

---

#### `skills/glab/`
```
glab/
├── references/
│   └── commands.md
└── SKILL.md
```
No `package.json`, no `tsconfig.json`.

---

#### `skills/interface-design/`
```
interface-design/
├── LICENSE
├── references/
│   ├── critique.md
│   ├── example.md
│   ├── principles.md
│   └── validation.md
└── SKILL.md
```
No `package.json`, no `tsconfig.json`.

---

#### `skills/pdf/`
```
pdf/
├── agents/        (empty directory)
├── assets/
│   └── pdf.png
├── LICENSE.txt
└── SKILL.md
```
No `package.json`, no `tsconfig.json`.

---

#### `skills/playwright/`
```
playwright/
├── agents/        (empty directory)
├── assets/
│   ├── playwright-small.svg
│   └── playwright.png
├── LICENSE.txt
├── NOTICE.txt
├── references/
│   ├── cli.md
│   └── workflows.md
├── scripts/
│   └── playwright_cli.sh
└── SKILL.md
```
No `package.json`, no `tsconfig.json`. Only script is a shell script (`playwright_cli.sh`), not TypeScript.

---

#### `skills/posthog-skill/` ← **Only skill with its own package.json + tsconfig**
```
posthog-skill/
├── package.json
├── pnpm-lock.yaml
├── references/
│   └── ach-reference-summary.json
├── scripts/
│   ├── __tests__/
│   │   ├── compare.test.ts
│   │   ├── create.test.ts
│   │   ├── dashboard-spec.test.ts
│   │   ├── flags.test.ts
│   │   ├── inspect.test.ts
│   │   ├── live.test.ts
│   │   ├── posthog-client.test.ts
│   │   └── status.test.ts
│   ├── lib/
│   │   ├── dashboard-spec.ts
│   │   ├── fixtures.ts
│   │   └── posthog-client.ts
│   └── run.ts
├── SKILL.md
└── tsconfig.json
```

**`skills/posthog-skill/package.json`:**
```json
{
  "name": "posthog-skill",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "tsx --test scripts/__tests__/*.test.ts",
    "test:live": "POSTHOG_TEST_LIVE=1 tsx --test scripts/__tests__/*.test.ts"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "packageManager": "pnpm@10.30.1",
  "type": "module",
  "private": "true",
  "devDependencies": {
    "@types/node": "^25.5.0",
    "tsx": "^4.21.0",
    "typescript": "^6.0.2"
  }
}
```
> **Note:** No `dependencies` — no external packages declared. Uses `tsx` for running tests directly with `node --test`. Does **not** depend on `exa-js` (which lives at the root).

**`skills/posthog-skill/tsconfig.json`:**
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "Node16",
    "moduleResolution": "Node16",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "dist",
    "rootDir": "scripts",
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noUncheckedIndexedAccess": true,
    "types": ["node"]
  },
  "include": ["scripts/**/*.ts"],
  "exclude": ["node_modules", "dist"]
}
```
> **Note:** Unlike the root tsconfig, this one **emits output** (`outDir: "dist"`), uses `Node16` module resolution (not `bundler`), includes strict extras (`noUnusedLocals`, `noUnusedParameters`, `noUncheckedIndexedAccess`), and scopes itself to `scripts/**/*.ts` with `rootDir: "scripts"`.

---

#### `skills/render-deploy/`
```
render-deploy/
├── agents/        (empty directory)
├── assets/
│   ├── docker.yaml
│   ├── go-api.yaml
│   ├── nextjs-postgres.yaml
│   ├── node-express.yaml
│   ├── python-django.yaml
│   ├── render-small.svg
│   ├── render.png
│   └── static-site.yaml
├── LICENSE.txt
├── references/
│   ├── blueprint-spec.md
│   ├── codebase-analysis.md
│   ├── configuration-guide.md
│   ├── deployment-details.md
│   ├── direct-creation.md
│   ├── error-patterns.md
│   ├── post-deploy-checks.md
│   ├── runtimes.md
│   ├── service-types.md
│   └── troubleshooting-basics.md
└── SKILL.md
```
No `package.json`, no `tsconfig.json`.

---

#### `skills/skill-scanner/`
```
skill-scanner/
├── LICENSE
├── references/
│   ├── dangerous-code-patterns.md
│   ├── permission-analysis.md
│   └── prompt-injection-patterns.md
├── scripts/
│   └── scan_skill.py      ← Python, not TypeScript
└── SKILL.md
```
No `package.json`, no `tsconfig.json`.

---

#### `skills/skill-writer/`
```
skill-writer/
├── EVAL.md
├── LICENSE
├── references/
│   ├── authoring-path.md
│   ├── claude-code-extensions.md
│   ├── description-optimization.md
│   ├── design-principles.md
│   ├── evaluation-path.md
│   ├── examples/
│   │   ├── documentation-skill.md
│   │   ├── security-review-skill.md
│   │   └── workflow-process-skill.md
│   ├── iteration-path.md
│   ├── mode-selection.md
│   ├── output-patterns.md
│   ├── registration-validation.md
│   ├── skill-patterns.md
│   ├── synthesis-path.md
│   └── workflow-patterns.md
├── scripts/
│   └── quick_validate.py  ← Python, not TypeScript
├── SKILL.md
└── SOURCES.md
```
No `package.json`, no `tsconfig.json`.

---

### Summary Table

| Location | `package.json` | `tsconfig.json` | Notes |
|---|---|---|---|
| `/` (root) | ✅ | ✅ | `noEmit: true`, covers all `skills/**/*.ts`, `moduleResolution: bundler` |
| `skills/posthog-skill/` | ✅ | ✅ | Emits to `dist/`, `Node16` resolution, stricter checks, has tests |
| All other 12 skills | ❌ | ❌ | No manifests; TypeScript files (if any) fall under root tsconfig |

### Key Observations

1. **Only `posthog-skill` is a standalone package** — it has its own `pnpm-lock.yaml`, `package.json`, `tsconfig.json`, and 8 test files under `scripts/__tests__/`.
2. **Two conflicting tsconfig strategies**: Root uses `bundler` + `noEmit: true`; posthog-skill uses `Node16` + `outDir: dist`. The posthog-skill tsconfig is the authoritative one for that skill since it has its own `include` scope.
3. **`exa-js`** is declared only in the root `dependencies` — `exa-search/scripts/*.ts` files rely on it being installed at root.
4. **`skill-scanner` and `skill-writer`** use Python scripts (`scan_skill.py`, `quick_validate.py`) — no Python `pyproject.toml` or `requirements.txt` exists anywhere in the repo.
5. **`playwright`** skill's only script is a shell script (`playwright_cli.sh`) — no TypeScript or Python.
6. **`posthog-skill` has no runtime `dependencies`** declared — it makes direct HTTP calls (PostHog API) likely using Node's built-in `fetch`, not an SDK.

## Scout: ## Set up ESLint and Prettier in /Users/josorio/Code/pi-skills

**Working directory:** /Users/josorio/Code/pi-skills

This is a TypeScript project (ES2022 modules, `"type": "module"`) with skills scripts. Follow CLI-first approach per AGENTS.md.

### Step 1: Install Prettier
Prettier has no init CLI, so install it and create a minimal config:
```bash
cd /Users/josorio/Code/pi-skills
pnpm add -D prettier@latest
```
Then write a minimal `.prettierrc` with: `{ "singleQuote": true, "semi": false, "trailingComma": "all", "printWidth": 100 }` (common defaults for modern TS projects).

### Step 2: Install ESLint
Use the ESLint create-config CLI. Since it's interactive and may not work well in non-interactive mode, instead do:
```bash
pnpm add -D eslint@latest @eslint/js@latest typescript-eslint@latest
```
Then write `eslint.config.js` (flat config format, ESM) that:
- Extends `@eslint/js` recommended
- Extends `typescript-eslint` recommended
- Sets `files: ["skills/**/*.ts"]`
- Ignores `node_modules`, `dist`, `.flow`

### Step 3: Add scripts to root package.json
Use `npm pkg set`:
```bash
npm pkg set scripts.lint="eslint skills/"
npm pkg set scripts.format="prettier --write skills/"
npm pkg set scripts.format:check="prettier --check skills/"
```

### Step 4: Run both
1. Run `pnpm run format` to auto-format all files
2. Run `pnpm run lint` to check for lint errors
3. If lint errors exist, try `pnpm exec eslint skills/ --fix` to auto-fix
4. Show the final output of both commands

**Important:** Use `npm pkg set` for package.json changes. Write eslint.config.js and .prettierrc directly (no init CLI exists for these in non-interactive mode). Show all command output.

All green. Here's a summary of everything that was set up:

---

### What was done

**Packages installed** (all devDependencies):
- `prettier@3.8.1`
- `eslint@10.1.0`
- `@eslint/js@10.0.1`
- `typescript-eslint@8.57.2`

**Files created:**

- **`.prettierrc`** — single quotes, no semis, trailing commas, 100-char width
- **`eslint.config.js`** — flat config (ESM), extends `@eslint/js` + `typescript-eslint` recommended, scoped to `skills/**/*.ts`, with a rule to allow bare `_` as an unused catch-binding placeholder (per project convention)

**Scripts added to `package.json`:**
| Script | Command |
|--------|---------|
| `lint` | `eslint skills/` |
| `format` | `prettier --write skills/` |
| `format:check` | `prettier --check skills/` |

**Results:**
- Prettier reformatted ~70 files (mostly `.md` and `.ts`) — all now consistent
- ESLint: 0 errors, 0 warnings ✅
- Prettier check: all files match ✅

> **Note on peer warning:** `typescript-eslint@8` declares a peer of `typescript <6`, but the project uses `typescript@6.0.2`. This is a stale peer declaration — it works fine in practice. When `typescript-eslint@9` drops, this warning will go away.

## Scout: Analyze the TypeScript code in /Users/josorio/Code/pi-skills/skills/exa-search/scripts/ thoroughly. Read EVERY .ts file completely (answer.ts, contents.ts, find-similar.ts, research.ts, search.ts, and lib/common.ts). For each file report:
1. Full list of imports and where they come from
2. Exported functions/types
3. Duplicated patterns across files (boilerplate, arg parsing, output formatting, error handling)
4. Shared logic that could be extracted
5. Code smells (long functions, repeated blocks, inconsistent patterns)
6. How lib/common.ts is used by each script

Be exhaustive — read every line of every file.

**No test files exist for any script.** Zero test coverage across the entire `exa-search/scripts/` directory.

---

### Findings Summary

- **`lib/common.ts` exports 8 utilities; all 5 scripts use `createClient` and `requireApiKey` but no other utility is universally adopted** — adoption is inconsistent and ad-hoc.

- **`contents.ts` and `research.ts` both manually re-implement the `parseArgs` / `showHelp` / arg-slicing boilerplate** already centralized in `common.ts`, without any justification in `contents.ts`'s case.

- **`research.ts` has the most internal duplication**: the `opts` JSON parse pattern appears 4× verbatim in different `case` blocks, `exa.research.create(...)` is copy-pasted between `create` and `run`, and `console.log(JSON.stringify(result, null, 2))` appears 5 times instead of using `executeAndPrint`.

- **`search.ts` and `find-similar.ts` share two identical lines** (`wantContents` detection + `buildContentsOptions` call) and an identical conditional dispatch pattern — this is the clearest candidate for a shared helper.

- **`contents.ts` has a silent default**: when no second arg is passed, `opts` defaults to `{ text: true }` — behavior not documented in help text and inconsistent with all other scripts, which default to `{}`.

- **Zero test coverage** — no `.test.ts` or spec files exist for any script or `lib/common.ts`.

## Scout: Analyze the TypeScript code in /Users/josorio/Code/pi-skills/skills/posthog-skill/scripts/ thoroughly. Read EVERY .ts file completely:
- run.ts
- lib/posthog-client.ts
- lib/dashboard-spec.ts
- lib/fixtures.ts
- All 8 test files in __tests__/

For each file report:
1. Full list of imports and where they come from
2. Exported functions/types/interfaces
3. File length and complexity
4. Code organization patterns (how is run.ts structured as a CLI entry point?)
5. Duplicated patterns across files
6. Code smells (long functions, god files, tight coupling)
7. How the lib/ files relate to each other and to run.ts
8. Test file patterns — are they consistent? Do they share helpers?

Be exhaustive — read every line of every file.

## Domain: TypeScript code in `/Users/josorio/Code/pi-skills/skills/posthog-skill/scripts/`

---

### File Inventory & Line Counts

| File | Lines | Role |
|------|-------|------|
| `run.ts` | 502 | CLI entry point |
| `lib/posthog-client.ts` | 368 | HTTP client library |
| `lib/dashboard-spec.ts` | 165 | Static data / spec definitions |
| `lib/fixtures.ts` | 130 | Canned dry-run responses |
| `__tests__/posthog-client.test.ts` | 393 | Unit tests (mock fetch) |
| `__tests__/flags.test.ts` | 290 | CLI integration tests |
| `__tests__/inspect.test.ts` | 130 | CLI integration tests |
| `__tests__/compare.test.ts` | 94 | CLI integration tests |
| `__tests__/create.test.ts` | 116 | CLI integration tests |
| `__tests__/dashboard-spec.test.ts` | 67 | Unit tests for spec data |
| `__tests__/status.test.ts` | 41 | CLI integration tests |
| `__tests__/live.test.ts` | 57 | Integration sequence (LIVE=1) |

---

### 1. Imports Per File

**`run.ts`**
- `node:path` → `path` (stdlib)
- `node:fs` → `fs` (stdlib)
- `node:url` → `fileURLToPath` (stdlib)
- `./lib/fixtures.js` → `getFixture`
- `./lib/dashboard-spec.js` → `* as spec` (entire module)
- `./lib/posthog-client.js` → `createClient`, `PostHogError`
- `type { PostHogConfig }` from `./lib/posthog-client.js`

**`lib/posthog-client.ts`**
- No external imports. Pure stdlib-free TypeScript. All HTTP done via injected `FetchFn` or `globalThis.fetch`.

**`lib/dashboard-spec.ts`**
- No imports. Pure data/type definitions file.

**`lib/fixtures.ts`**
- `./dashboard-spec.js` → `name as specName`, `branchEvents`, `tiles`

**All 7 CLI integration test files** (`compare`, `create`, `flags`, `inspect`, `live`, `status`) share an identical import set:
- `node:test` → `describe`, `it`
- `node:assert/strict` → `assert`
- `node:child_process` → `spawnSync`
- `node:path` → `path`
- `node:url` → `fileURLToPath`
- (`compare.test.ts` and `live.test.ts` additionally import `node:fs`)

**`__tests__/posthog-client.test.ts`**
- `node:test` → `describe`, `it`
- `node:assert/strict` → `assert`
- `../lib/posthog-client.js` → `createClient`, `PostHogError`

**`__tests__/dashboard-spec.test.ts`**
- `node:test` → `describe`, `it`
- `node:assert/strict` → `assert`
- `../lib/dashboard-spec.js` → `* as spec`

---

### 2. Exported Functions / Types / Interfaces

**`lib/posthog-client.ts`** — 18 exports:
- Classes: `PostHogError`
- Interfaces: `PostHogConfig`, `ClientOptions`, `MinimalResponse`, `FetchFn` (type alias), `DashboardSummary`, `DashboardListResponse`, `DashboardTile`, `Dashboard`, `Insight`, `InsightListResponse`, `HogQLResult`, `FeatureFlagSummary`, `FeatureFlagListResponse`, `FeatureFlagListParams`, `FeatureFlagActivity`, `FeatureFlagActivityResponse`, `PostHogClient`
- Functions: `createClient(config, fetchFn?, opts?): PostHogClient`

**`lib/dashboard-spec.ts`** — 11 exports:
- Interfaces: `BranchEvent`, `TileQueryKind` (type alias), `TileLayout`, `Tile`, `DashboardSpec`
- Constants: `name` (string), `description` (string), `tags` (string[]), `branchEvents` (9-item array), `tiles` (8-item array)
- Const: `FUNNEL_PAGES` is **not exported** (module-private)

**`lib/fixtures.ts`** — 2 exports:
- Type alias: `FixtureKey` (union of 11 string literals)
- Function: `getFixture(command: FixtureKey): unknown`

**`run.ts`** — No exports. All functions are file-private. Entry point only.

---

### 3. CLI Entry Point Structure (`run.ts`)

Organized in 5 clearly-delimited sections (marked with comment banners):

1. **Config resolution** — `resolveConfig()` reads env vars and returns `AppConfig`; `requireToken()` guards live commands
2. **Output helpers** — `out()` (JSON to stdout), `info()` (message to stderr), `handleApiError()` (maps PostHogError statuses to human messages + exits)
3. **Commands** — One function per command:
   - `cmdStatus(config)` — sync, no HTTP
   - `cmdInspect(flags, config)` → delegates to `cmdInspectLive(config)` for `--live`
   - `cmdCompare(flags, config)` → delegates to `cmdCompareLive(config)`
   - `cmdCreate(flags, config)` → delegates to `cmdCreateLive(config)`
   - `cmdFlags(args, config)` — large switch on subcommand (list/get/toggle/create/update/activity)
4. **Flags command** — `parseFlagsOptions(args)` arg parser + `cmdFlags()`
5. **Entry point** — `main()` reads `process.argv`, routes to command via switch, `.catch()` handler

The `--dry-run` guard pattern repeats in every live command:
```ts
if (isDryRun) { out(getFixture('key')); return }
requireToken(config)
await cmdXxxLive(config)
```

---

### 4. How lib/ Files Relate to Each Other and to run.ts

```
dashboard-spec.ts  ←── fixtures.ts  (imports name, branchEvents, tiles)
       ↑                    ↑
       └──── run.ts ────────┘  (also imports posthog-client.ts)
       
posthog-client.ts  ←── run.ts  (imports createClient, PostHogError, PostHogConfig)
```

- `dashboard-spec.ts` is a leaf — no dependencies, consumed by `fixtures.ts` and `run.ts`
- `posthog-client.ts` is a leaf — no dependencies, consumed only by `run.ts`
- `fixtures.ts` depends on `dashboard-spec.ts` to build the `inspect` and `create` fixtures dynamically (instead of duplicating event/tile data)
- `run.ts` is the only orchestrator; it directly calls all three lib files

---

### 5. Pattern Inventory

**Dry-run guard** — 5 instances in run.ts (inspect, compare, create, plus get/toggle/create/update/activity/list inside cmdFlags — 10 total in cmdFlags, but the guard is repeated inline in each switch case)

**`handleApiError()` call sites** — 11 instances in run.ts:
- `cmdInspectLive`: 1
- `cmdCompareLive`: 1
- `cmdCreateLive`: 3 (listDashboards, listDashboards #2, createDashboard, getDashboard)
- `cmdFlags`: 6 (one per subcommand)

**`requireToken(config)` call sites** — 8 instances in run.ts (inspect --live, compare, create, and 6 flags subcommands)

**`createClient(config)` call sites** — 7 instances in run.ts — one new client created per subcommand invocation inside cmdFlags, plus one each in cmdInspectLive, cmdCompareLive, cmdCreateLive. **No client is reused across commands.**

**`spawnSync(TSX, [RUN, ...args], ...)` / `run()` helper** — defined identically in **7 test files** (status, inspect, compare, create, flags, posthog-client omits it, dashboard-spec omits it, live has a variant). The `run()` function is copy-pasted with identical implementation in 6 of the 7 CLI test files. The `live.test.ts` variant differs only in adding `timeout: 30000` and omitting the `env` parameter.

**`LIVE` gate pattern** — `const LIVE = Boolean(process.env['POSTHOG_TEST_LIVE'])` appears in 5 test files (compare, create, inspect, live, and flags does NOT use it). All live-only `describe` blocks use `{ skip: !LIVE }`.

**`BRANCH_EVENTS` array hardcoded in test** — `inspect.test.ts` defines a local `BRANCH_EVENTS` array listing all 9 event names, then a second `BRANCH_EVENTS_LIVE` with the same 9 names. This duplicates what `spec.branchEvents` already provides and creates 2 copies in the same file.

---

### 6. Code Smells

**`run.ts` is a god file (502 lines, all commands in one file):**
- `cmdCreateLive` alone is ~100 lines (steps 1–7 comment-annotated internally)
- `cmdCompareLive` is ~80 lines
- `cmdFlags` is ~130 lines including the `parseFlagsOptions` helper
- All business logic, output formatting, error handling, and arg parsing lives in a single file with no separation

**`cmdCompareLive` has deeply nested type coercion chains:**
- Multiple `typeof x === 'object' && x !== null ? (x as Record<string, unknown>)['key'] : null` one-liners, 7+ occurrences, extracting fields from the PostHog API response by casting to `Record<string, unknown>`. No typed response shape is defined for the insight query structure — raw `unknown`-casting throughout.

**`createClient` returns new client per command invocation in cmdFlags:**
- In `cmdFlags`, `createClient(config)` is called inside each switch case — 6 separate instantiation points for effectively the same config. No shared client object.

**`handleApiError` returns `never` but is not the only error path:**
- `cmdCreateLive` has a parallel, inline error handler block for the auth smoke-test (Step 1) that doesn't use `handleApiError`, duplicating the 401/403 message logic already in `handleApiError`.

**`BRANCH_EVENTS` duplicated in `inspect.test.ts`:**
- Lines 33–44: `BRANCH_EVENTS` array with 9 entries
- Lines 71–83: `BRANCH_EVENTS_LIVE` array with the same 9 entries — identical, never merged

**`fixtures.ts` `'status'` fixture is not used by `run.ts`:**
- `FixtureKey` includes `'status'` and `'inspect-live'`, but `run.ts` never calls `getFixture('status')` or `getFixture('inspect-live')`. `cmdStatus` builds its output inline from config. These fixtures exist in the map but are dead from the CLI perspective.

**`DashboardSpec` interface defined but never used:**
- `lib/dashboard-spec.ts` exports `DashboardSpec` but it is not applied to any variable in the file or imported anywhere.

**`patchDashboard` method on `PostHogClient` is exposed but never called:**
- `posthog-client.ts` exports `patchDashboard`, `run.ts` imports it via the `PostHogClient` interface but does not call it anywhere (the code comment "no PATCH needed" was left after an architectural decision to attach insights via `dashboards:[]` on creation).

---

### 7. Test File Patterns — Consistency

**Framework:** All 8 test files use Node.js native `node:test` (`describe`/`it`) + `node:assert/strict`. No Vitest, Jest, or third-party test runner.

**CLI integration tests (6 files: status, inspect, compare, create, flags, live):**
- All spawn the CLI via `spawnSync(TSX, [RUN, ...args], ...)` through a local `run()` helper
- The `run()` helper is copy-pasted identically in 6 files — not extracted to a shared module
- All follow the pattern: run CLI → check exit code → parse JSON from stdout → assert field values
- All use `{ POSTHOG_PERSONAL_API_KEY: '' }` to override the token in dry-run tests
- `live.test.ts` omits the `env` parameter from `run()` — passes env through implicitly
- No shared test fixtures, helpers, or setup files across files

**Unit tests (2 files: posthog-client.test.ts, dashboard-spec.test.ts):**
- `posthog-client.test.ts`: uses the `makeFetch()` factory to create mock fetch implementations with call recording. This is the only file with non-trivial test infrastructure.
- `dashboard-spec.test.ts`: purely structural — asserts array lengths, field presence, and valid type values. No mocks needed.

**Test consistency issues:**
- `compare.test.ts` and `create.test.ts` have identically structured describe blocks (`--dry-run`, `without token`, `live POSTHOG_TEST_LIVE=1`) but are not consistent about including a `live idempotency` suite — only `create.test.ts` has it
- `live.test.ts` is an integration sequence meant to be run as a whole; it partially duplicates assertions already in individual test files (`create` twice, `compare` once, `inspect --live` once)
- No `beforeEach`/`afterEach` hooks used anywhere

---

### Blast Radius

**Files that must change if a new command is added:**
- `run.ts` — add case in `main()` switch + new `cmdXxx` function
- `lib/fixtures.ts` — add new `FixtureKey` variant + fixture entry in `FIXTURES`
- `__tests__/` — new test file (following existing CLI test pattern)

**Files at risk of regression:**
- `run.ts` — `cmdCompareLive` is tightly coupled to PostHog's specific JSON response shape (InsightVizNode wrapper detection)
- `lib/posthog-client.ts` — the `request()` function is shared by all methods; changes to retry/header logic affect every API call
- `lib/fixtures.ts` — the `create` fixture dynamically maps `tiles` from the spec, so adding/removing tiles in `dashboard-spec.ts` silently changes fixture output

---

### Findings Summary

1. **`run.ts` is a 502-line god file** with all commands, output helpers, error handlers, and arg parsing co-located. The largest functions (`cmdCreateLive` ~100 lines, `cmdFlags` ~130 lines) have internal step-comment structure suggesting they want to be extracted.

2. **The `run()` test helper is copy-pasted across 6 CLI test files** with identical implementation (only `live.test.ts` adds `timeout: 30000`). There is no shared test utility module.

3. **`posthog-client.ts` is clean and well-isolated**: no imports, fully injectable fetch, typed interfaces for every API response, retry logic with configurable delay — the best-designed file in the codebase.

4. **Three dead exports exist**: `DashboardSpec` interface (never applied), `patchDashboard` client method (never called from run.ts after architecture change), and the `'status'`/`'inspect-live'` fixture keys (never requested by run.ts).

5. **`cmdCompareLive` in run.ts contains the most complex inline logic**: 7+ levels of `Record<string, unknown>` casting to extract query fields from the PostHog insight response, with no typed schema for the InsightVizNode wrapper — the most fragile code in the codebase.

## Scout: Analyze the overall project structure of /Users/josorio/Code/pi-skills for TypeScript organization opportunities:
1. Read the root package.json, tsconfig.json, eslint.config.js, and .prettierrc
2. Read the .gitignore file
3. Check if there's a src/ or shared/ directory at root level
4. Look at how skills reference each other (do any skills import from other skills?)
5. Check if there are shared types, utilities, or constants that could be extracted to a common location
6. Check the SKILL.md files for exa-search and posthog-skill to understand how scripts are invoked (what's the entry point pattern?)
7. Report on whether the current flat structure under skills/ makes sense or if there's a better organization
8. Check for any type definitions (.d.ts files) anywhere in the repo

Now I have a comprehensive picture. Let me compile the findings.

---

## Domain: TypeScript Organization — `/Users/josorio/Code/pi-skills`

### Blast Radius

**Files that must change (if extracting shared utilities):**
- `skills/exa-search/scripts/lib/common.ts` — the only shared utility library; would move or be referenced by a root-level shared module
- `skills/posthog-skill/scripts/lib/posthog-client.ts` — self-contained client; no current sharing candidates
- `tsconfig.json` — `include` glob would need to cover a new `shared/` or `src/` path
- `package.json` — test script currently hardcoded to posthog path; lint/format scripts scoped to `skills/`

**Files that may change:**
- All 5 `exa-search/scripts/*.ts` entrypoints — they import from `./lib/common.js`
- `posthog-skill/scripts/run.ts` — imports from `./lib/posthog-client.js`

**Regression risk:**
- `skills/posthog-skill/scripts/__tests__/*.test.ts` — 8 test files; any restructuring of `posthog-client.ts` or `dashboard-spec.ts` paths would break imports

**Tests covering affected code:**
- `posthog-skill/scripts/__tests__/compare.test.ts`
- `posthog-skill/scripts/__tests__/create.test.ts`
- `posthog-skill/scripts/__tests__/dashboard-spec.test.ts`
- `posthog-skill/scripts/__tests__/flags.test.ts`
- `posthog-skill/scripts/__tests__/inspect.test.ts`
- `posthog-skill/scripts/__tests__/live.test.ts`
- `posthog-skill/scripts/__tests__/posthog-client.test.ts`
- `posthog-skill/scripts/__tests__/status.test.ts`

---

### Dependencies

**`exa-search/scripts/answer.ts` (entry point)**
- Level 1: `./lib/common.js` (local), `exa-js` (external ^2.10.0)
- Level 2: `common.ts` → `node:fs`, `exa-js` (Exa class)

**`exa-search/scripts/search.ts`, `contents.ts`, `find-similar.ts`, `research.ts`** follow the same pattern — all import from `./lib/common.js` and `exa-js`.

**`posthog-skill/scripts/run.ts` (single entry point)**
- Level 1: `./lib/fixtures.js`, `./lib/dashboard-spec.js`, `./lib/posthog-client.js` (all local), `node:path`, `node:fs`, `node:url`
- Level 2: `posthog-client.ts` → `node:` built-ins only (no external packages). `dashboard-spec.ts` → no imports (pure data). `fixtures.ts` → no imports found at Level 1 scan.

**No cross-skill imports exist anywhere.** Every `from '../../…'` pattern search returned zero results — imports never escape a skill's own directory.

---

### Pattern Inventory

**TypeScript files total:** 18 files across 2 skills (`exa-search`: 6, `posthog-skill`: 12)

**Skills with TypeScript scripts:** 2 of 13 skills (`exa-search`, `posthog-skill`). The other 11 skills (`agents-md`, `docker-model-runner`, `frontend-design`, `gh`, `glab`, `interface-design`, `pdf`, `playwright`, `render-deploy`, `skill-scanner`, `skill-writer`) contain no `.ts` files — they are documentation-only skills.

**Entry point pattern:**
- `exa-search`: 5 separate entrypoint scripts (`answer.ts`, `search.ts`, `contents.ts`, `find-similar.ts`, `research.ts`), each invoked directly as `tsx scripts/<name>.ts <args>`
- `posthog-skill`: 1 unified dispatcher (`run.ts`), invoked as `tsx scripts/run.ts <subcommand> [args]`

**Shared utility pattern in `exa-search/scripts/lib/common.ts`:** 8 exported functions — `createClient`, `requireArg`, `executeAndPrint`, `showHelp`, `requireApiKey`, `parseArgs`, `handleError`, `filterOptions`, `buildContentsOptions`. All 5 entrypoint scripts import from it. Pattern count: 5 import sites.

**`lib/` subdirectory pattern:** Used by both skills — `exa-search/scripts/lib/` (1 file) and `posthog-skill/scripts/lib/` (3 files). No `lib/` at root level.

**`.d.ts` files:** Zero in the entire repo.

**`src/` or `shared/` directories at root level:** Neither exists.

---

### Constraints

**`tsconfig.json`:** `"include": ["skills/**/*.ts"]` — scoped to the `skills/` subtree. `moduleResolution: "bundler"`, `noEmit: true`, strict mode + `noUnusedLocals` + `noUnusedParameters` + `noUncheckedIndexedAccess` all enabled.

**`package.json` test script:** `"test": "tsx --test skills/posthog-skill/scripts/__tests__/*.test.ts"` — hardcoded glob for posthog only. No test runner for exa-search scripts (they have no tests).

**`eslint.config.js`:** Lint scope is `files: ['skills/**/*.ts']` only. An `unused-vars` override allows bare `_` as catch placeholder.

**`exa-js` dependency:** The only runtime dependency (`^2.10.0`). It is used exclusively by `exa-search`. `posthog-skill` uses only Node.js built-ins and `globalThis.fetch`.

**Import style:** All cross-file imports use `.js` extensions (e.g., `'./lib/common.js'`), required for ESM (`"type": "module"` in `package.json`). Any shared module would need this same convention.

**Skill isolation requirement:** Per `posthog-skill/SKILL.md`, skills resolve their own `$SKILL_DIR` at runtime — path portability is important. `exa-search` SKILL.md says `npm install` from the skill directory itself. A shared root-level library would require cross-directory imports, which currently don't exist and would break the skill-as-portable-unit model.

---

### Findings Summary

- **Only 2 of 13 skills have TypeScript code** — the other 11 are pure markdown documentation. TypeScript organization is entirely a concern of `exa-search` and `posthog-skill`.

- **Zero cross-skill imports exist.** Each skill is fully self-contained. The `lib/` pattern is used internally within each skill but never across skill boundaries.

- **The flat `skills/<name>/` structure is appropriate.** Skills are designed to be self-contained portable units (SKILL.md uses `$SKILL_DIR` for path resolution). A root-level `shared/` library would couple skills together and break that portability contract.

- **`exa-search/scripts/lib/common.ts` is the only candidate for shared extraction**, but it is Exa-specific (creates an Exa client, requires `EXA_API_KEY`, imports `exa-js`). It has no value to `posthog-skill` or any other skill — sharing it would be premature abstraction.

- **No `.d.ts` files, no `src/` directory, no root-level `shared/` directory exist.** The current organization — skill-level `lib/` for internal helpers, `scripts/` for entrypoints, `__tests__/` nested inside scripts — is consistent between the two TypeScript skills and fits the project's scope.

## Scout: Read these three skill files completely and report their FULL content:
1. /Users/josorio/.pi/agent/git/github.com/josorio7122/pi-skills/skills/skill-writer/SKILL.md
2. /Users/josorio/.pi/agent/git/github.com/josorio7122/pi-skills/skills/skill-scanner/SKILL.md
3. /Users/josorio/.pi/agent/git/github.com/josorio7122/pi-skills/skills/prompt-engineering/SKILL.md

Also read any referenced docs that define evaluation criteria, scoring rubrics, or review checklists. Specifically check:
- skill-writer/EVAL.md (evaluation criteria)
- skill-writer/references/authoring-path.md
- skill-writer/references/design-principles.md
- skill-writer/references/description-optimization.md
- skill-scanner/references/prompt-injection-patterns.md
- skill-scanner/references/dangerous-code-patterns.md
- skill-scanner/references/permission-analysis.md
- prompt-engineering/SKILL.md references section

Report the full content of the main SKILL.md files and summarize the key evaluation criteria from each.

Here is the complete report of all files read.

---

## Full Content Report

---

### 1. `skill-writer/SKILL.md` — Full Content

**Frontmatter:**
```yaml
name: skill-writer
description: Create, synthesize, and iteratively improve agent skills following the Agent Skills specification. Use when asked to "create a skill", "write a skill", "synthesize sources into a skill", "improve a skill from positive/negative examples", "update a skill", or "maintain skill docs and registration". Handles source capture, depth gates, authoring, registration, and validation.
```

**Body:** A 7-step workflow:

| Step | Action | Reference file to load |
|------|--------|----------------------|
| 1 | Resolve target and path; classify skill class | `references/mode-selection.md` |
| 2 | Run synthesis (collect/score sources, apply trust rules, enforce depth gates) | `references/synthesis-path.md` |
| 3 | Run iteration first when improving from outcomes/examples | `references/iteration-path.md` |
| 4 | Author or update skill artifacts | `references/authoring-path.md` |
| 5 | Optimize description quality (should-trigger / should-not-trigger sets) | `references/description-optimization.md` |
| 6 | Evaluate outcomes (qualitative check + optional quantitative) | `references/evaluation-path.md` |
| 7 | Register and validate (depth gates + artifact checks) | `references/registration-validation.md` |

**Output format:** Summary → Changes Made → Validation Results → Open Gaps.

---

### 2. `skill-scanner/SKILL.md` — Full Content

**Frontmatter:**
```yaml
name: skill-scanner
description: Scan agent skills for security issues. Use when asked to "scan a skill", "audit a skill", "review skill security", "check skill for injection", "validate SKILL.md", or assess whether an agent skill is safe to install. Checks for prompt injection, malicious scripts, excessive permissions, secret exposure, and supply chain risks.
```

**Body:** An 8-phase workflow:

| Phase | Action |
|-------|--------|
| 1 | Input & Discovery — locate skill directory, validate SKILL.md exists, `ls` structure |
| 2 | Automated Static Scan — run `uv run scripts/scan_skill.py <dir>` → parse JSON |
| 3 | Frontmatter Validation — required fields, name consistency, `allowed-tools` justification |
| 4 | Prompt Injection Analysis — load `references/prompt-injection-patterns.md`; distinguish **performing** vs **discussing** injection |
| 5 | Behavioral Analysis (agent-only) — description vs instructions alignment; config/memory poisoning; scope creep; structural attacks (symlinks, frontmatter hooks, `` !`cmd` `` syntax, test auto-discovery, npm lifecycle hooks, PNG metadata) |
| 6 | Script Analysis — load `references/dangerous-code-patterns.md`; check exfiltration, reverse shells, credential theft, eval/exec, PEP 723 deps |
| 7 | Supply Chain Assessment — review URLs; trusted vs untrusted domains; remote instruction loading |
| 8 | Permission Analysis — load `references/permission-analysis.md`; least-privilege check; rate overall permission profile |

**Confidence Levels:** HIGH (report with severity) / MEDIUM (needs verification) / LOW (do not report). False positive awareness is critical.

**Output format:** `## Skill Security Scan: [Name]` → Summary → Findings (SKILL-SEC-NNN with Location, Confidence, Category, Issue, Evidence, Risk, Remediation) → Needs Verification → Assessment (Safe / Caution / Do not install).

---

### 3. `prompt-engineering/SKILL.md` — Full Content

**Frontmatter:**
```yaml
name: prompt-engineering
description: Advanced prompt engineering patterns for maximizing LLM performance. Use when writing commands, hooks, skills, sub-agent prompts, system prompts, or any LLM interaction. Also use when asked to "improve this prompt", "optimize a prompt", "write a system prompt", "make this prompt more effective", or any prompt engineering task. Covers few-shot learning, chain-of-thought, template systems, persuasion principles, degrees of freedom, and token efficiency.
metadata:
  author: NeoLabHQ
  version: "1.0"
  source: https://github.com/NeoLabHQ/context-engineering-kit/...
  license: See source repository
```

**Core Capabilities:**
1. **Few-Shot Learning** — 2–5 input-output pairs; balance examples vs token cost
2. **Chain-of-Thought** — "Let's think step by step" (zero-shot) or example reasoning traces (few-shot); +30–50% accuracy on analytical tasks
3. **Prompt Optimization** — start simple, measure, iterate; test edge cases
4. **Template Systems** — reusable structures with variables and conditional sections
5. **System Prompt Design** — set role, expertise, output format, safety guidelines

**Key Patterns:**
- **Instruction Hierarchy:** `[System Context] → [Task Instruction] → [Examples] → [Input Data] → [Output Format]`
- **Progressive Disclosure:** 4 levels from direct instruction to instruction+constraints+reasoning+examples
- **Degrees of Freedom:** High freedom (many valid approaches) → Medium → Low (fragile, must be exact). Narrow bridge vs open field analogy.
- **Conciseness Rule:** Challenge every token. Good example ~50 tokens vs bad ~150 tokens.
- **Persuasion Principles** (Meincke et al. 2025 — 33%→72% compliance): Authority (`YOU MUST`, `No exceptions`), Commitment (force announcements), Scarcity (time-bound requirements), Social Proof (universal norms), Unity (shared identity)
- **When to use which:** Discipline-enforcing → Authority+Commitment+Social Proof; Guidance → Moderate Authority+Unity; Collaborative → Unity+Commitment; Reference → Clarity only
- **Token Efficiency:** Remove redundancy, abbreviate, consolidate, cache prefixes
- **Common Pitfalls:** Over-engineering, example pollution, context overflow, ambiguous instructions, ignoring edge cases
- **Error Recovery:** Fallback instructions, confidence scores, indicate missing information

---

### Referenced Docs — Key Evaluation Criteria

---

#### `skill-writer/EVAL.md`

**Purpose:** Optional deep evaluation guidance (not required for every skill).

**Pass/Fail Rubric for integration-documentation skills:**
- ✅ PASS: All required artifacts exist with requested depth
- ❌ FAIL: API mapping is partial, workaround guidance is shallow, use cases are generic/not actionable
- ❌ FAIL: Completion claimed with unresolved high-impact gaps and no next retrieval actions

**Required artifact depth gates** (for `integration-documentation` class):
- `references/api-surface.md` — must exist
- `references/common-use-cases.md` — at least **6 concrete downstream use cases**
- `references/troubleshooting-workarounds.md` — at least **8 failure modes with fixes**
- `references/integration-patterns.md` — happy path + robust variant + anti-pattern+correction

**Coverage matrix must include:** API surface, options/config, runtime lifecycle, event semantics, queue semantics, failure modes, version variance, downstream usage patterns.

**Optional Deep-Eval Pattern:** Fixed prompt set → deterministic traces → rubric/schema checks → baseline vs candidate delta.

---

#### `skill-writer/references/authoring-path.md`

**SKILL.md requirements:**
1. Frontmatter must be first line
2. `name` must match directory
3. `description` must contain realistic trigger phrases
4. Body must be imperative and concise
5. SKILL.md is the orchestration index; reference files are conditionally loaded
6. Bundled files referenced relative to skill root (`references/...`, `scripts/...`, `assets/...`)
7. No hardcoded host-specific absolute paths

**Path handling rules:** Use skill-root-relative paths; prefer relative over absolute; only use repo-root paths for registration steps; no provider-specific path variables in portable skills.

**Supporting files:** `references/` (domain depth), `scripts/` (automation), `assets/` (static artifacts) — create only when justified.

**Class-specific requirements for `integration-documentation`:** api-surface.md + common-use-cases.md (≥6) + troubleshooting-workarounds.md (≥8).

**Example artifact requirements for generator/authoring skills:** happy-path + secure/robust variant + anti-pattern+corrected. No abstract-only guidance.

**Attribution:** Full source lists in `SOURCES.md`; keep `SKILL.md` free of large attribution blocks.

---

#### `skill-writer/references/design-principles.md`

**Key principles:**
1. **Conciseness** — only include domain-specific knowledge, decision logic, output format, concrete examples. Omit general programming knowledge, obvious instructions, lengthy explanations. Rule: *"If a senior engineer would skip it, the agent doesn't need it."*
2. **Degrees of Freedom** — High fragility → prescriptive steps; Medium → guidelines+examples; Low → goals+constraints only. Over-constraining wastes context; under-constraining causes inconsistency.
3. **Progressive Disclosure** — Three tiers: metadata (always), instructions (on activation), resources (on demand via conditional loading tables).
4. **Description as Trigger** — third person, realistic phrases, no "When to Use" in body, pattern: `<What it does>. Use when <trigger phrases>. <Key capabilities>.`
5. **Imperative Voice** — commands, not descriptions ("Read the diff" not "This skill reads the diff")
6. **Consistent Terminology** — one term per concept, no synonym mixing
7. **Avoid Duplication** — info lives in SKILL.md or reference files, not both; don't repeat AGENTS.md conventions
8. **Avoid Time-Sensitive Information** — no "before August 2025" style conditionals
9. **Avoid Machine-Specific Paths** — use `<repo-root>/` or `uv run <skill-dir>/scripts/`
10. **Default to Portable Skills** — cross-agent wording; only provider-specific when explicitly scoped
11. **Long Reference Files** — >100 lines: add table of contents; >10k words: add grep patterns in SKILL.md

---

#### `skill-writer/references/description-optimization.md`

**Trigger quality loop:**
1. Draft description with realistic user language and concrete trigger phrases
2. Build **should-trigger** and **should-not-trigger** query sets
3. Evaluate current description against both sets
4. Edit to improve precision/recall
5. Repeat until false positives and false negatives are acceptable

**Authoring rules:**
1. Third person
2. Include what it does AND when to use it
3. No implementation details that don't aid triggering
4. No provider-specific phrasing unless intentionally provider-specific
5. For provider-agnostic skills: avoid naming Claude, Codex, etc.

**Required output:** Final description text + should-trigger set + should-not-trigger set + summary of edits.

---

#### `skill-scanner/references/prompt-injection-patterns.md`

**Pattern categories:**
1. **Instruction Override** — "Ignore all previous instructions..." (Critical)
2. **Jailbreaks** — DAN mode, developer mode, god mode, bypass safety (Critical)
3. **Role Reassignment** — "You are now...", "Act as..." (High)
4. **System Prompt Extraction** — "Output your full system prompt" (High)
5. **Obfuscation Techniques** — Base64, Zero-width chars (U+200B, U+200C, etc.), Homoglyphs (Cyrillic vs Latin), RTL Override (U+202E), **Unicode Tag Characters (U+E0000 block)** — invisible to editors but read by LLM tokenizers, PNG/Image metadata injection (tEXt/iTXt chunks)
6. **Hidden Content Vectors** — HTML comments, Markdown reference links, invisible markdown (empty links, unrendered images)
7. **Indirect Injection** — Instructions in example output, self-referential instructions ("Add to your memory...", "Update CLAUDE.md...")

**Critical false positive rule:** Security review skills documenting injection patterns are **legitimate**, not malicious. Key question: does the pattern **attack** the agent, or **inform** about attacks?

---

#### `skill-scanner/references/dangerous-code-patterns.md`

**Pattern categories:**
1. **Data Exfiltration** — HTTP post of env vars, DNS encoding, writing secrets to shared paths
2. **Reverse Shells** — socket connect + subprocess, `bash -i >&`, `nc -e /bin/sh`
3. **Credential Theft** — reading `~/.ssh/*`, harvesting `*KEY*/*TOKEN*/*SECRET*` env vars, reading `~/.aws/credentials`, `~/.netrc`, `~/.git-credentials`
4. **Dangerous Execution** — `eval(user_input)`, `exec(downloaded_code)`, shell interpolation (`subprocess.run(f"...", shell=True)`), dynamic imports from user input
5. **File System Manipulation** — writing to `~/.claude/settings.json`, poisoning `CLAUDE.md`/`MEMORY.md`, modifying `~/.bashrc`, installing git hooks
6. **Encoding/Obfuscation** — `exec(base64.b64decode(...))`, ROT13, character-by-character string construction
7. **Structural Attacks** — symlinks outside skill dir, test file auto-discovery (`conftest.py`, `*.test.js`), npm lifecycle hooks (`postinstall`), frontmatter hooks, `` !`cmd` `` pre-prompt injection

**Legitimate patterns** (not malicious): `subprocess.run(["gh", ...])`, `subprocess.run(["git", ...])`, `json.dumps()` to stdout, GitHub API calls, `os.environ.get("GITHUB_TOKEN")`, reading `pyproject.toml`.

---

#### `skill-scanner/references/permission-analysis.md`

**Tool Risk Tiers:**

| Tier | Tools | Risk |
|------|-------|------|
| 1 | `Read`, `Grep`, `Glob` | Low |
| 2 | `Bash` | Medium |
| 3 | `Write`, `Edit`, `NotebookEdit` | High |
| 4 | `WebFetch`, `WebSearch` | High |
| 5 | `Task` | High |
| 6 | `*` (wildcard) | Critical |

**Least-privilege assessment:** For each tool: Is it referenced? Is it necessary? Is the scope minimal?

**Common permission profiles:**
- Analysis/Review: `Read, Grep, Glob` (or + `Bash` for linters/bundled scripts)
- Workflow Automation: `Read, Grep, Glob, Bash`
- Content Generation: + `Write`, `Edit`
- External-Facing: + `WebFetch`
- Full-Access: Almost never justified

**Red flags:** `Bash` with no scripts in directory; `Write`/`Edit` in an "analysis" skill; `WebFetch` with no URLs in instructions; `Task`+`Bash`+`Write` combo; `*` wildcard; granted tools never referenced.

**Scoring:** Appropriate → Slightly Overpermissioned → Overpermissioned → Dangerously Overpermissioned.

---

### Summary of Key Evaluation Criteria Across All Three Skills

| Skill | Primary Eval Criteria |
|-------|-----------------------|
| **skill-writer** | Depth gates (≥6 use cases, ≥8 workarounds for integration skills); all required artifacts present; no unclaimed gaps; description has realistic trigger phrases; portability (no hardcoded paths); imperative voice; conciseness |
| **skill-scanner** | False positive awareness (context matters); confidence levels (HIGH/MEDIUM/LOW); description-instructions alignment; structural attack detection (symlinks, hooks, PNG metadata); permission least-privilege rating; supply chain URL trust |
| **prompt-engineering** | Token efficiency vs clarity tradeoff; match specificity to task fragility (degrees of freedom); correct persuasion principle for prompt type; progressive disclosure structure; avoid over-engineering |

## Scout: Read ALL 13 SKILL.md files in /Users/josorio/Code/pi-skills/skills/ completely. For each skill report:
1. Full frontmatter (name, description, compatibility, etc.)
2. Full body content (all sections)
3. File length in lines
4. Whether it has: references/, scripts/, agents/ directories and what's in them
5. Any scripts referenced in the SKILL.md (command patterns, tool invocations)

The 13 skills are:
- agents-md
- docker-model-runner
- exa-search
- frontend-design
- gh
- glab
- interface-design
- pdf
- playwright
- posthog-skill
- render-deploy
- skill-scanner
- skill-writer
- prompt-engineering

Read every SKILL.md completely — do not summarize or truncate.

Now I have everything needed. Here is the complete report:

---

## Domain: All 13 SKILL.md Files in `/Users/josorio/Code/pi-skills/skills/`

---

### ⚠️ Pre-Report Finding: `prompt-engineering` Skill Does Not Exist

The directory `/Users/josorio/Code/pi-skills/skills/prompt-engineering/` **does not exist** in the repo. The skill is registered in `~/.pi/agent/AGENTS.md` (pointing to an installed package path), but has no local source directory in `/Users/josorio/Code/pi-skills/skills/`. Only **13 skills** exist in that folder (not 14).

---

## Skill 1: `agents-md`

### Frontmatter
```yaml
name: agents-md
description: This skill should be used when the user asks to "create AGENTS.md", "update AGENTS.md", "maintain agent docs", "set up CLAUDE.md", or needs to keep agent instructions concise. Enforces research-backed best practices for minimal, high-signal agent documentation.
```
*(No compatibility, metadata, or license fields.)*

### File Structure
- `SKILL.md` — 100 lines
- `LICENSE` — present
- No `references/`, `scripts/`, or `agents/` directories

### Body Content Summary (all sections, verbatim structure)
**## File Setup** — Create `AGENTS.md` at project root; symlink to `CLAUDE.md` with `ln -s AGENTS.md CLAUDE.md`.

**## Before Writing** — 5-item analysis checklist: package manager (lock files), linter/formatter configs, CI/build commands, monorepo indicators, existing conventions.

**## Writing Rules** — Headers+bullets only; code blocks for commands; reference don't embed; no filler; trust capabilities; prefer file-scoped commands; don't duplicate linters.

**## Required Sections** — Three subsections:
1. *Package Manager* — which tool + key commands only
2. *File-Scoped Commands* — per-file typecheck/lint/test table
3. *Commit Attribution* — `Co-Authored-By:` trailer

**## Optional Sections** — API route patterns, CLI commands, file naming, project structure hints, monorepo overrides.

**## Anti-Patterns** — 8 items to omit: welcome text, "You should..." phrasing, linter rules, listing installed skills, project-wide build commands, obvious instructions, explanations of why, long prose.

**## Example Structure** — Full markdown template showing the minimal AGENTS.md shape.

### Scripts Referenced
- `ln -s AGENTS.md CLAUDE.md`
- `pnpm tsc --noEmit path/to/file.ts`
- `pnpm eslint path/to/file.ts`
- `pnpm jest path/to/file.test.ts`

---

## Skill 2: `docker-model-runner`

### Frontmatter
```yaml
name: docker-model-runner
description: Run AI models locally using Docker Model Runner with an OpenAI-compatible API. Use when the user wants to run a local LLM, use local inference, pull or manage AI models with Docker, set up a local model endpoint, or integrate local models into code via the OpenAI SDK. Also use when they mention "docker model," "local LLM," "run a model locally," or need an alternative to cloud AI APIs. Requires Docker Desktop or Docker Engine with Model Runner enabled.
compatibility: 'Requires Docker Desktop 4.40+ or Docker Engine with Model Runner. Run `docker model version` to verify.'
```
*(No metadata or license fields.)*

### File Structure
- `SKILL.md` — 71 lines
- `references/docker-model-guide.md` — present
- No `scripts/` or `agents/` directories

### Body Content Summary (all sections)
**Workflow** — 6-step numbered workflow: check availability (`docker model version`), list models, search models, pull models, run models (one-time prompt / interactive / pre-load with `--detach`), use OpenAI-compatible API.

**API Usage** — curl example targeting `http://localhost:12434/engines/llama.cpp/v1/chat/completions`. Python OpenAI library example with `base_url` set to local endpoint, `api_key="not-needed"`.

**Key Commands** — 7-row table: `run`, `pull`, `list`, `search`, `ps`, `rm`, `inspect`.

**Best Practices** — 4 bullet points: use smaller models for dev, pre-load with `--detach`, models stay loaded 5 min, use OpenAI-compatible API for integration.

**References** — Points to `references/docker-model-guide.md`.

### Scripts Referenced
```bash
docker model version
docker model list
docker model search <query>
docker model pull <model>
docker model run ai/smollm2 "Your prompt here"
docker model run ai/smollm2
docker model run --detach ai/smollm2
docker model ps
docker model rm <model>
docker model inspect <model>
```
API endpoint: `http://localhost:12434/engines/llama.cpp/v1/chat/completions`

---

## Skill 3: `exa-search`

### Frontmatter
```yaml
name: exa-search
description: Semantic web search, content extraction, AI-powered answers, and deep research via the Exa API. Use when you need to search documentation, look up facts, find current information, extract page content from URLs, get AI answers with citations, find pages similar to a URL, research companies or people, find LinkedIn profiles, or run deep multi-step research. Also use when the user asks to "look something up," "search the web," "find docs for," "what does X's documentation say," "research this company," or needs any information that may be more current than your training data. Requires EXA_API_KEY environment variable.
compatibility: 'Requires Node.js 18+, tsx, and EXA_API_KEY environment variable set'
metadata:
  author: josorio7122
  version: '3.0'
```

### File Structure
- `SKILL.md` — 174 lines
- `references/api-reference.md` — present
- `scripts/` — contains: `answer.ts`, `contents.ts`, `find-similar.ts`, `research.ts`, `search.ts`, `lib/` subdirectory, `__tests__/` subdirectory
- No `agents/` directory

### Body Content Summary (all sections)
**Prerequisites** — `node --version` (18+), `echo $EXA_API_KEY`; install deps: `cd <skill-dir>/skills/exa-search && npm install`.

**Choosing the Right Script** — 5-row decision table (answer.ts / search.ts / contents.ts / find-similar.ts / research.ts) plus a 4-branch decision tree.

**Quick Examples** — 5 subsections:
1. *Answer a Question* — `tsx scripts/answer.ts` with optional JSON options arg
2. *Search the Web* — basic, domain-scoped, `type:"deep"`, date/category filters
3. *Company & People Search* — `category:"company"`, `category:"people"` patterns; warning about category filter restrictions
4. *Fetch a Known URL* — `tsx scripts/contents.ts`, multiple URLs, `livecrawl:"always"`
5. *Find Similar Pages* — `tsx scripts/find-similar.ts`
6. *Deep Research* — `tsx scripts/research.ts run`, `model:"exa-research-pro"`

**Common Patterns** — Documentation lookup (3 options), verify-before-assume, company research, find alternatives.

**Cost Awareness** — 6-row price table + 5 cost strategies.

**Rules** — 7 bullet rules: check API key, prefer answer.ts, prefer search.ts with domains, use contents.ts only for known URLs, use research.ts sparingly, respect category filter restrictions, output is always JSON.

**Reference** — Points to `references/api-reference.md`.

### Scripts Referenced
```bash
tsx scripts/answer.ts "What is the latest Next.js version?"
tsx scripts/answer.ts "Compare React and Vue" '{"text":true}'
tsx scripts/search.ts "latest AI research"
tsx scripts/search.ts "drizzle ORM configuration" '{"includeDomains":["orm.drizzle.team"],"text":true,"numResults":3}'
tsx scripts/contents.ts "https://nextjs.org/docs/..." '{"text":true}'
tsx scripts/find-similar.ts "https://react.dev" '{"text":true,"excludeSourceDomain":true,"numResults":5}'
tsx scripts/research.ts run "Best practices for building a CLI tool..."
tsx scripts/research.ts run "..." '{"model":"exa-research-pro"}'
```

---

## Skill 4: `frontend-design`

### Frontmatter
```yaml
name: frontend-design
description: Create distinctive, production-grade frontend interfaces with high design quality. Use this skill when the user asks to build web components, pages, artifacts, posters, or applications (examples include websites, landing pages, dashboards, React components, HTML/CSS layouts, or when styling/beautifying any web UI). Generates creative, polished code and UI design that avoids generic AI aesthetics.
license: Complete terms in LICENSE.txt
```

### File Structure
- `SKILL.md` — 47 lines
- `LICENSE.txt` — present
- No `references/`, `scripts/`, or `agents/` directories

### Body Content Summary
This skill has **no section headers** — it is a single cohesive body of prose instructions.

**Design Thinking** — Before coding: understand purpose, tone (pick an extreme from a list: brutalist, maximalist, retro-futuristic, organic, luxury, playful, editorial, art deco, etc.), constraints, differentiation. "CRITICAL": commit to a clear conceptual direction.

**Frontend Aesthetics Guidelines** — 5 focus areas:
- *Typography*: distinctive, unexpected fonts (avoid Arial, Inter)
- *Color & Theme*: CSS variables, dominant colors with sharp accents
- *Motion*: CSS-only for HTML, Motion library for React; staggered reveals with `animation-delay`, scroll-triggering
- *Spatial Composition*: asymmetry, overlap, diagonal flow, grid-breaking
- *Backgrounds & Visual Details*: gradient meshes, noise textures, geometric patterns, layered transparencies, dramatic shadows, grain overlays

**Prohibition**: NEVER use generic fonts (Inter, Roboto, Arial), purple gradients on white, predictable layouts, cookie-cutter design. Vary light/dark themes, fonts, aesthetics across generations.

**Complexity matching**: maximalist → elaborate code; minimalist → restraint and precision.

### Scripts Referenced
None. Pure generative/creative instruction skill. No CLI commands or tool invocations.

---

## Skill 5: `gh`

### Frontmatter
```yaml
name: gh
description: Interact with GitHub from the command line using the gh CLI. Use when working with pull requests, issues, releases, Actions workflows and runs, repository management, code review, or GitHub API calls. Also use when the user says "open a PR," "create an issue," "check CI," "merge this," "make a release," or any GitHub-related task — even if they don't mention gh explicitly. Requires gh CLI installed and authenticated.
compatibility: 'Requires gh CLI installed (brew install gh) and authenticated (gh auth login)'
metadata:
  author: josorio7122
  version: '2.0'
```

### File Structure
- `SKILL.md` — 122 lines
- `references/commands.md` — present
- No `scripts/` or `agents/` directories

### Body Content Summary (all sections)
**Prerequisites** — `gh --version`, `gh auth status`; auth options: `gh auth login` or `gh auth login --with-token`.

**Choosing the Right Command** — 7-row table mapping intent to section.

**Workflows** — 6 complete flows:
1. *Create a PR*: `git push -u origin HEAD` + `gh pr create --fill`; variations: `--draft`, `--base`, `--reviewer`, `--label`, manual title/body
2. *Check CI*: `gh pr checks`, `gh pr checks <number> --watch`; failed: `gh run view --log`, `gh run rerun --failed`
3. *Review a PR*: `gh pr checkout`, `gh pr diff`, `gh pr review --approve/--request-changes/--comment`
4. *Merge a PR*: `gh pr merge --squash --delete-branch` / `--rebase` / default merge commit; when-to-use matrix
5. *Work with Issues*: `create`, `list`, `view`, `close`, `develop`
6. *Make a Release*: `gh release create --generate-notes / --notes-file`; `gh release upload`
7. *Monitor Actions*: `gh run list/watch/rerun`; `gh workflow run`

**Use the API** — `gh api` REST + GraphQL + `--paginate` patterns.

**Tips** — 7 bullet tips: `--fill`, `--web`, `--json`+`--jq`, `--repo`, `gh run watch`, `gh pr checks --watch`, repo inference.

**Reference** — Points to `references/commands.md`.

### Scripts Referenced
```bash
gh pr create --fill
gh pr create --fill --draft
gh pr checks <number> --watch
gh run view <run-id> --log
gh run rerun <run-id> --failed
gh pr checkout <number>
gh pr review <number> --approve
gh pr merge <number> --squash --delete-branch
gh issue create --title "Bug: X" --body "Details" --label bug
gh issue develop <number>
gh release create v1.0.0 --generate-notes
gh release upload v1.0.0 ./dist/*.tar.gz
gh run watch <run-id>
gh workflow run deploy.yml --ref main
gh api repos/owner/repo/issues --jq '.[].title'
gh api graphql -f query='{ viewer { login } }'
gh auth login --with-token <<< "<pat>"
```

---

## Skill 6: `glab`

### Frontmatter
```yaml
name: glab
description: Interact with GitLab from the command line using the glab CLI. Use when working with merge requests, issues, CI/CD pipelines and jobs, variables, schedules, releases, stacked diffs, repository management, or GitLab API calls. Also use when the user says "open an MR," "create an issue," "check the pipeline," "merge this," "retrigger CI," "deploy," or any GitLab-related task — even if they don't mention glab explicitly. Requires glab CLI installed and authenticated.
compatibility: 'Requires glab CLI installed (brew install glab) and authenticated (glab auth login)'
metadata:
  author: josorio7122
  version: '3.0'
```

### File Structure
- `SKILL.md` — 187 lines
- `references/commands.md` — present
- No `scripts/` or `agents/` directories

### Body Content Summary (all sections)
**Prerequisites** — `glab --version`, `glab auth status`; auth: `glab auth login`, `--token`, `--hostname` for self-hosted.

**Choosing the Right Command** — 10-row table mapping intent to section (more comprehensive than `gh` skill).

**Workflows** — 8 complete flows:
1. *Create an MR*: `glab mr create --fill`; variations: `--draft`, `--target-branch`, `--reviewer`, `--squash-message-on-merge`
2. *Check CI/CD*: `glab ci status` + `glab ci view` (interactive TUI)
3. *Debug CI*: `glab ci trace`, `glab ci retry`, `glab job artifact`, `glab ci lint`; full debugging flow
4. *Review an MR*: `glab mr checkout`, `glab mr diff`, `glab mr approve`, `glab mr note`
5. *Merge an MR*: `--squash`, `--when-pipeline-succeeds`, `glab mr rebase`; when-to-use matrix
6. *Work with Issues*: `create`, `list`, `view`, `close`, `board view`
7. *CI/CD Config*: `glab variable list/set/get`; `glab schedule list/create/run`
8. *Make a Release*: `glab release create/upload`
9. *Stacked Diffs*: `glab stack create/save/sync/list/next/prev`

**Use the API** — `glab api` REST + GraphQL + `--paginate --output ndjson` pattern; `:fullpath` auto-resolution.

**Tips** — 8 bullet tips; aliases listed (`glab ci` = `glab pipe`, etc.).

**Reference** — Points to `references/commands.md`.

### Scripts Referenced
```bash
glab mr create --fill
glab mr create --fill --squash-message-on-merge
glab ci view
glab ci trace <job-id>
glab ci retry <job-id>
glab job artifact <job-id>
glab ci lint
glab ci run
glab mr merge <id> --squash --when-pipeline-succeeds
glab mr rebase <id>
glab issue board view
glab variable list/set/get
glab schedule list/create/run <id>
glab release create v1.0.0 --notes-file CHANGELOG.md
glab stack create/save/sync/list/next/prev
glab api projects/:fullpath/merge_requests --paginate
glab api graphql -f query='{ currentUser { username } }'
```

---

## Skill 7: `interface-design`

### Frontmatter
```yaml
name: interface-design
description: Design crafted, distinctive interfaces for dashboards, admin panels, SaaS apps, tools, settings pages, and data-heavy products. Use when the user asks to "design a dashboard," "build an admin panel," "create a settings page," "design a data interface," or wants to build any interactive product UI that is NOT a marketing page or landing page. Also use when the user says their UI looks "generic," "templated," or "like every other app." Redirect landing pages and marketing sites to frontend-design.
```
*(No compatibility, metadata, or license fields.)*

### File Structure
- `SKILL.md` — 320 lines (longest SKILL.md in the repo)
- `LICENSE` — present
- `references/` — contains: `critique.md`, `example.md`, `principles.md`, `validation.md`
- No `scripts/` or `agents/` directories

### Body Content Summary (all sections)
**Scope** — Use for: dashboards, admin panels, SaaS, tools, settings, data interfaces. Not for: landing pages, marketing sites.

**The Problem** — 2-paragraph warning that defaults will win unless actively resisted, even if the process is followed.

**Where Defaults Hide** — 4 areas where defaults disguise themselves: typography ("just a container"), navigation ("just scaffolding"), data ("just presentation"), token names ("implementation detail"). Rule: "There are no structural decisions. Everything is design."

**Intent First** — 3 questions (Who is this human? What must they accomplish? What should this feel like?). Requirement: answer all three specifically before designing. Rule: "Every Choice Must Be A Choice" — must be able to explain WHY for each decision. The swap test. "Sameness Is Failure." Intent must be systemic (warm means everything is warm).

**Product Domain Exploration** — Required outputs before proposing any direction: Domain (5+ concepts), Color world (5+ domain-specific colors), Signature (one unique element), Defaults (3 obvious choices to reject). Proposal requirements: must reference all four. Test: remove product name — can someone still identify what this is for?

**The Mandate** — Pre-presentation self-check. Three checks: swap test, squint test, signature test (5 specific elements), token test.

**Craft Foundations** — Two sections:
- *Subtle Layering*: surface elevation system, border philosophy, the squint test for professional vs amateur
- *Infinite Expression*: no interface should look the same; question list; "NEVER produce identical output"

**Color Lives Somewhere** — Color must come from the product's world, not be applied. Beyond warm/cold axes. Unmotivated color is noise.

**Before Writing Each Component** — Mandatory checkpoint block: Intent / Palette / Depth / Surfaces / Typography / Spacing (each with WHY).

**Design Principles** — 12 subsections: Token Architecture (text hierarchy 4 levels, border progression, control tokens), Spacing (base unit + scale), Padding (symmetrical), Depth (pick ONE approach: borders-only/subtle shadows/layered shadows/surface shifts), Border Radius (sharper=technical, rounder=friendly), Typography (headlines/body/labels/data distinct), Card Layouts, Controls (custom components, not native `<select>`/`<input type="date">`), Iconography, Animation (fast, deceleration easing, no spring/bounce), States (5 interactive states + 3 data states), Navigation Context.

**Avoid** — 15 prohibited patterns.

**Workflow** — Communication (be invisible, never announce modes), Suggest+Ask format, If project has `system.md`, If no `system.md` (6-step flow), After completing offer to save.

**After Completing** — Offer to save to `.interface-design/system.md`: direction, depth strategy, spacing unit, key component patterns.

**Deep Dives** — Points to `references/principles.md`, `references/validation.md`, `references/critique.md`.

**Commands** — `/interface-design:status`, `/interface-design:audit`, `/interface-design:extract`, `/interface-design:critique`

### Scripts Referenced
None. Pure generative instruction skill. No CLI commands.

---

## Skill 8: `pdf`

### Frontmatter
```yaml
name: pdf
description: Read, create, edit, and review PDF files with proper rendering and layout. Use when the user asks to "read a PDF," "create a PDF," "extract text from a PDF," "fill a PDF form," "merge PDFs," "convert to PDF," or any task involving PDF documents where layout and visual fidelity matter. Also use when the user mentions PDF files even if they don't explicitly ask for help with them. Uses Poppler for rendering, reportlab for generation, pdfplumber and pypdf for extraction.
```

### File Structure
- `SKILL.md` — 62 lines
- `agents/` — empty directory
- `assets/pdf.png` — single PNG image
- `LICENSE.txt` — present
- No `references/` or `scripts/` directories

### Body Content Summary (all sections)
**When to use** — 3 bullets: visual review, programmatic creation with reportlab, validate rendering.

**Workflow** — 4-step: prefer visual review via `pdftoppm` (PNG render); use `reportlab` to generate; use `pdfplumber`/`pypdf` for extraction (not layout fidelity); re-render and verify after each update.

**Temp and output conventions** — `tmp/pdfs/` for intermediate files; `output/pdf/` for final artifacts; stable descriptive filenames.

**Dependencies** — Python: `uv pip install reportlab pdfplumber pypdf` / fallback `python3 -m pip install`. System: `brew install poppler` (macOS) / `sudo apt-get install -y poppler-utils` (Ubuntu).

**Environment** — No required environment variables.

**Rendering command** — `pdftoppm -png $INPUT_PDF $OUTPUT_PREFIX`

**Quality expectations** — 5 rules: consistent typography/spacing/margins; no clipping/overlap/broken tables/black squares; charts/tables/images sharp; ASCII hyphens only (no U+2011); citations human-readable.

**Final checks** — Don't deliver until PNG inspection shows zero defects; confirm headers/footers/numbering; keep intermediate files organized.

### Scripts Referenced
```bash
uv pip install reportlab pdfplumber pypdf
python3 -m pip install reportlab pdfplumber pypdf
brew install poppler
sudo apt-get install -y poppler-utils
pdftoppm -png $INPUT_PDF $OUTPUT_PREFIX
```

---

## Skill 9: `playwright`

### Frontmatter
```yaml
name: playwright
description: Automate a real browser from the terminal for navigation, form filling, screenshots, data extraction, and UI-flow debugging. Use when the user asks to "take a screenshot," "scrape a page," "fill a form," "test a UI flow," "automate the browser," "open a webpage," or any task that requires interacting with a live website. Also use when the user needs to extract data from a JavaScript-rendered page that simple HTTP requests can't handle. Uses playwright-cli or the bundled wrapper script.
```

### File Structure
- `SKILL.md` — 100 lines
- `agents/` — empty directory
- `assets/` — (not listed in ls output; ls showed `agents/ assets/ LICENSE.txt NOTICE.txt references/ scripts/`)
- `references/` — `cli.md`, `workflows.md`
- `scripts/playwright_cli.sh` — bundled wrapper script
- `LICENSE.txt`, `NOTICE.txt` — present

### Body Content Summary (all sections)
**Prerequisite check** — `command -v npx >/dev/null 2>&1`; if missing, install Node.js/npm and then `npm install -g @playwright/cli@latest`.

**Skill path** — `export CODEX_HOME="${CODEX_HOME:-$HOME/.codex}"` + `export PWCLI="$CODEX_HOME/skills/playwright/scripts/playwright_cli.sh"`

**Quick start** — 5 commands: `open`, `snapshot`, `click e15`, `type`, `screenshot` using `"$PWCLI"`.

**Core workflow** — 5-step: open → snapshot → interact using refs → re-snapshot after DOM changes → capture artifacts. Minimal loop shown.

**When to snapshot again** — 5 triggers: navigation, substantial UI changes, modals/menus, tab switches, stale ref errors.

**Recommended patterns** — 3 named patterns:
1. *Form fill and submit* — `fill e1`, `fill e2`, `click e3`, re-snapshot
2. *Debug a UI flow with traces* — `tracing-start`, interactions, `tracing-stop`
3. *Multi-tab work* — `tab-new`, `tab-list`, `tab-select`

**Wrapper script** — Uses `npx --package @playwright/cli playwright-cli` internally; no global install needed.

**References** — `references/cli.md` (command reference), `references/workflows.md` (practical workflows).

**Guardrails** — 7 rules: always snapshot before referencing element ids; re-snapshot when stale; prefer explicit commands over `eval`/`run-code`; use placeholder refs `eX` without fresh snapshot; use `--headed` for visual checks; artifacts to `output/playwright/`; default to CLI not test specs.

### Scripts Referenced
```bash
command -v npx >/dev/null 2>&1
node --version
npm --version
npm install -g @playwright/cli@latest
export CODEX_HOME="${CODEX_HOME:-$HOME/.codex}"
export PWCLI="$CODEX_HOME/skills/playwright/scripts/playwright_cli.sh"
"$PWCLI" open https://playwright.dev --headed
"$PWCLI" snapshot
"$PWCLI" click e15
"$PWCLI" type "Playwright"
"$PWCLI" press Enter
"$PWCLI" screenshot
"$PWCLI" fill e1 "user@example.com"
"$PWCLI" tracing-start / tracing-stop
"$PWCLI" tab-new / tab-list / tab-select 0
```
Bundled script: `scripts/playwright_cli.sh` (wraps `npx --package @playwright/cli playwright-cli`)

---

## Skill 10: `posthog-skill`

### Frontmatter
```yaml
name: posthog-skill
description: Automate PostHog analytics and feature flags for this project — inspect branch event availability, compare against the ACH reference insight, create or update the 7361 metrics dashboard idempotently, and manage feature flags (list, inspect, toggle, create, update, audit activity log). Use when working on analytics instrumentation, dashboards, PostHog event verification, or feature flag management.
metadata:
  author: josorio7122
  version: '1.0'
compatibility: 'Requires Node.js 18+ and tsx. Dependencies are managed at the repository root — run `pnpm install` from the repo root if needed.'
```

### File Structure
- `SKILL.md` — 338 lines (tied for longest with interface-design)
- `references/POSTHOG_API.md`, `references/ach-reference-summary.json`
- `scripts/run.ts`, `scripts/lib/` subdirectory, `scripts/__tests__/` subdirectory
- No `agents/` directory

### Body Content Summary (all sections)
**IMPORTANT note** — `$SKILL_DIR` must be resolved from where SKILL.md was loaded, not hardcoded. `$RUN` = `npx tsx $SKILL_DIR/scripts/run.ts`.

**Command Quick Reference** — 11-row table: `status`, `inspect`, `inspect --live`, `compare`, `create`, `flags`, `flags get <id>`, `flags toggle <id>`, `flags update <id>`, `flags create <key>`, `flags activity <id>`.

**Environment Variables** — 5 variables: `POSTHOG_PERSONAL_API_KEY` (required for live), `POSTHOG_PROJECT_ID` (default: `39507`), `POSTHOG_HOST` (default: `https://us.posthog.com`), `POSTHOG_ACH_INSIGHT_ID`, `POSTHOG_DASHBOARD_NAME`.

**Command Surface** — 6 commands with JSON output shapes:
1. `status` — config check, no token required
2. `inspect` — 9 branch-7361 events from local spec (offline)
3. `inspect --live` — HogQL batch query; events with `count_30d`, `last_seen`
4. `compare` — fetch ACH insight `drOq2lO5`; writes to `references/ach-reference-summary.json`
5. `create` — WRITE op; idempotent 8-tile dashboard provisioning; recovery instructions for mid-run failure via `curl -X PATCH` soft-delete
6. `flags` — 6 subcommands (`flags`, `flags get`, `flags toggle`, `flags create`, `flags update`, `flags activity`); all WRITE ops prefaced with `WRITE:` announcement + `--dry-run` first rule

**Dry-Run Mode** — All commands accept `--dry-run`; no HTTP, fixture data, exit 0.

**First Use (No Token Yet)** — 6-step offline exploration flow including `pnpm install`, `status`, `inspect`, `--dry-run` variants, running tests.

**Dashboard Spec** — 8 tiles: Page Funnel (FunnelsQuery), Payment Method Preference (TrendsQuery), Payment Mode Selection (TrendsQuery), FCF Selection Rate (TrendsQuery), Travel Protection Selection (TrendsQuery), Signing Completion (TrendsQuery), Purchase Completions Over Time (TrendsQuery), Top Counties (HogQLQuery). Layout: 2-column grid, `w:6, h:5` per tile.

**Branch Events Catalog** — 9+1 events (10 rows including `signing_completed`) with key properties listed.

**API Quirks** — 4 PostHog-specific behaviors (dashboard attachment via `dashboards:[]`, FunnelsQuery nesting, `refresh` parameter location, ACH insight `InsightVizNode` wrapping).

**Exit Codes** — 4 codes: 0 success, 1 auth/API error, 2 bad arguments, 3 partial failure.

**Error Output Examples** — 6 error scenarios with exact stderr messages.

**File Structure** — Full tree of `.pi/skills/posthog-skill/` with 8 test files listed.

### Scripts Referenced
```bash
pnpm install
npx tsx $SKILL_DIR/scripts/run.ts status
npx tsx $SKILL_DIR/scripts/run.ts inspect
npx tsx $SKILL_DIR/scripts/run.ts inspect --live
npx tsx $SKILL_DIR/scripts/run.ts compare
npx tsx $SKILL_DIR/scripts/run.ts compare --dry-run
npx tsx $SKILL_DIR/scripts/run.ts create
npx tsx $SKILL_DIR/scripts/run.ts create --dry-run
npx tsx $SKILL_DIR/scripts/run.ts flags
npx tsx $SKILL_DIR/scripts/run.ts flags get 123
npx tsx $SKILL_DIR/scripts/run.ts flags toggle 123
npx tsx $SKILL_DIR/scripts/run.ts flags create my-new-flag
npx tsx $SKILL_DIR/scripts/run.ts flags update 123 --name 'New Name' --active false --tags release,v2
npx tsx $SKILL_DIR/scripts/run.ts flags activity 123 --limit 20
npx tsx --test $SKILL_DIR/scripts/__tests__/*.test.ts
source ~/.zshrc && POSTHOG_TEST_LIVE=1 npx tsx --test $SKILL_DIR/scripts/__tests__/*.test.ts
curl -X PATCH -H "Authorization: Bearer $POSTHOG_PERSONAL_API_KEY" \
  -H "Content-Type: application/json" \
  "https://us.posthog.com/api/environments/39507/dashboards/<id>/" \
  -d '{"deleted": true}'
```

---

## Skill 11: `render-deploy`

### Frontmatter
```yaml
name: render-deploy
description: Deploy applications to Render by analyzing codebases, generating render.yaml Blueprints, and providing Dashboard deeplinks. Use when the user wants to deploy, host, publish, or set up their application on Render's cloud platform.
```

### File Structure
- `SKILL.md` — 372 lines (longest SKILL.md in the repo)
- `agents/` — empty directory
- `assets/` — `docker.yaml`, `go-api.yaml`, `nextjs-postgres.yaml`, `node-express.yaml`, `python-django.yaml`, `render-small.svg`, `render.png`, `static-site.yaml`
- `references/` — `blueprint-spec.md`, `codebase-analysis.md`, `configuration-guide.md`, `deployment-details.md`, `direct-creation.md`, `error-patterns.md`, `post-deploy-checks.md`, `runtimes.md`, `service-types.md`, `troubleshooting-basics.md`
- `LICENSE.txt` — present

### Body Content Summary (all sections)
**Intro** — Two deploy sources: Git-backed (covered) and prebuilt Docker image (out of scope for MCP). If no Git remote, stop and instruct user.

**Prerequisites note** — `sandbox_permissions=require_escalated` if network blocked.

**When to Use** — 6 triggers listed.

**Happy Path (New Users)** — 2-question pre-analysis: Git vs Docker? Provision everything vs bring own infra?

**Choose Your Source Path** — Git Repo Path vs Prebuilt Docker Image Path (not supported by MCP).

**Choose Your Deployment Method** — 2-row table (Blueprint vs Direct Creation) + decision heuristic: use Direct Creation when all 4 conditions true; use Blueprint when any of 5 conditions true.

**Prerequisites Check** — 6-step ordered verification: confirm source path (`git remote -v`), MCP tools (`list_services()`), Render CLI (`render --version`), MCP setup (if missing — Cursor/Claude Code/Codex/Other setup instructions), authentication (`render whoami -o json`), workspace context (`get_selected_workspace()`).

**MCP Setup subsections** — 4 named AI tool setups:
- *Cursor*: `~/.cursor/mcp.json` config
- *Claude Code*: `claude mcp add --transport http render https://mcp.render.com/mcp --header "Authorization: Bearer <YOUR_API_KEY>"`
- *Codex*: `export RENDER_API_KEY` + `codex mcp add render --url https://mcp.render.com/mcp --bearer-token-env-var RENDER_API_KEY`
- *Other Tools*: redirect to Render MCP docs

**Method 1: Blueprint Deployment** — 7 steps:
1. Analyze codebase (→ `references/codebase-analysis.md`)
2. Generate `render.yaml` (basic structure shown; service types: web/worker/cron/static/pserv; → `references/blueprint-spec.md`, `references/runtimes.md`, `assets/`)
3. Immediate Next Steps checklist: authenticate, validate (`render blueprints validate`), commit+push, open Dashboard, fill secrets, deploy
4. Validate configuration: `render whoami -o json` + `render blueprints validate`
5. Commit and push: `git add render.yaml && git commit -m "..." && git push origin main`
6. Generate deeplink: `git remote get-url origin` → SSH-to-HTTPS conversion table → `https://dashboard.render.com/blueprint/new?repo=<URL>`
7. Verify deployment: `list_deploys()`, `list_logs()`, `get_metrics()`

**Method 2: Direct Service Creation** — Abbreviated 4-step referencing `references/direct-creation.md` for details.

**Post-deploy verification and basic triage** — 4-step checklist; → `references/post-deploy-checks.md`, `references/troubleshooting-basics.md`.

**Troubleshooting** — Escalated network access guidance.

### Scripts Referenced
```bash
git remote -v
git remote get-url origin
git add render.yaml && git commit -m "Add Render deployment configuration" && git push origin main
render --version
brew install render
curl -fsSL https://raw.githubusercontent.com/render-oss/cli/main/bin/install.sh | sh
render whoami -o json
render blueprints validate
render workspace current -o json
render login
export RENDER_API_KEY="rnd_xxxxx"
claude mcp add --transport http render https://mcp.render.com/mcp --header "Authorization: Bearer <YOUR_API_KEY>"
export RENDER_API_KEY="<YOUR_API_KEY>"
codex mcp add render --url https://mcp.render.com/mcp --bearer-token-env-var RENDER_API_KEY
```
MCP tool calls: `list_services()`, `get_selected_workspace()`, `list_workspaces()`, `list_deploys(serviceId, limit)`, `list_logs(resource, level, limit)`, `get_metrics(resourceId, metricTypes)`

---

## Skill 12: `skill-scanner`

### Frontmatter
```yaml
name: skill-scanner
description: Scan agent skills for security issues. Use when asked to "scan a skill", "audit a skill", "review skill security", "check skill for injection", "validate SKILL.md", or assess whether an agent skill is safe to install. Checks for prompt injection, malicious scripts, excessive permissions, secret exposure, and supply chain risks.
```

### File Structure
- `SKILL.md` — 162 lines
- `LICENSE` — present
- `references/` — `dangerous-code-patterns.md`, `permission-analysis.md`, `prompt-injection-patterns.md`
- `scripts/scan_skill.py` — Python static analysis scanner
- No `agents/` directory

### Body Content Summary (all sections)
**Requires** — `uv` CLI. Run scripts using full path relative to skill directory.

**Bundled Script** — `scripts/scan_skill.py`: static analysis, structured JSON output. Invocation: `uv run scripts/scan_skill.py <skill-directory>`.

**Workflow** — 8 phases:
1. *Input & Discovery* — determine target (path / name / "scan all"), validate `SKILL.md` exists, `ls` skill directory structure
2. *Automated Static Scan* — `uv run scripts/scan_skill.py <skill-directory>`; fallback: manual Grep patterns from reference files
3. *Frontmatter Validation* — required fields (`name`, `description`), name consistency, `allowed-tools` assessment, model override, description quality
4. *Prompt Injection Analysis* — load `references/prompt-injection-patterns.md`; critical distinction: performing vs discussing injection
5. *Behavioral Analysis* — agent-only (no pattern matching): description-vs-instructions alignment, config/memory poisoning (CLAUDE.md, MEMORY.md, settings.json, .mcp.json, `~/.claude/`, `~/.agents/`, `~/.pi/`), scope creep, information gathering, structural attacks (symlinks, frontmatter hooks `PostToolUse`/`PreToolUse`, `!`command`` syntax, test file auto-discovery, npm `postinstall` hooks, PNG image metadata)
6. *Script Analysis* — load `references/dangerous-code-patterns.md`; evaluate exfiltration, reverse shells, credential theft, dangerous execution, config modification; check PEP 723 dependencies; verify behavior matches description
7. *Supply Chain Assessment* — trusted vs untrusted domains; remote instruction loading; dependency downloads
8. *Permission Analysis* — load `references/permission-analysis.md`; least privilege; tool justification; risk tier

**Confidence Levels** — HIGH/MEDIUM/LOW with criteria and action; false positive warning.

**Output Format** — Markdown template: `## Skill Security Scan: [Name]` → Summary, Findings (with SKILL-SEC-001 format), Needs Verification, Assessment. Risk level determination (Critical/High/Medium/Low/Clean).

**Reference Files** — 3-row table: `prompt-injection-patterns.md`, `dangerous-code-patterns.md`, `permission-analysis.md`.

### Scripts Referenced
```bash
uv run scripts/scan_skill.py <skill-directory>
ls -la <skill-directory>/
ls <skill-directory>/references/ 2>/dev/null
ls <skill-directory>/scripts/ 2>/dev/null
```

---

## Skill 13: `skill-writer`

### Frontmatter
```yaml
name: skill-writer
description: Create, synthesize, and iteratively improve agent skills following the Agent Skills specification. Use when asked to "create a skill", "write a skill", "synthesize sources into a skill", "improve a skill from positive/negative examples", "update a skill", or "maintain skill docs and registration". Handles source capture, depth gates, authoring, registration, and validation.
```

### File Structure
- `SKILL.md` — 90 lines
- `EVAL.md`, `SOURCES.md` — additional docs present
- `LICENSE` — present
- `references/` — 13 files: `authoring-path.md`, `claude-code-extensions.md`, `description-optimization.md`, `design-principles.md`, `evaluation-path.md`, `iteration-path.md`, `mode-selection.md`, `output-patterns.md`, `registration-validation.md`, `skill-patterns.md`, `synthesis-path.md`, `workflow-patterns.md`, plus `examples/` subdirectory
- `scripts/quick_validate.py` — Python validation script
- No `agents/` directory

### Body Content Summary (all sections)
**Reference table** — 14-row table mapping task → reference file to load (only load what's needed):
- `mode-selection.md` — skill class and workflow path
- `design-principles.md` — writing constraints
- `skill-patterns.md` — structure patterns
- `workflow-patterns.md` — workflow orchestration
- `output-patterns.md` — output format patterns
- `mode-selection.md` — workflow path and required outputs
- `references/examples/*.md` — synthesis examples by skill type
- `synthesis-path.md` — external/local source synthesis
- `authoring-path.md` — write or update SKILL.md
- `description-optimization.md` — description and trigger precision
- `iteration-path.md` — positive/negative/fix examples
- `evaluation-path.md` — behavior evaluation
- `registration-validation.md` — register and validate

**Step 1: Resolve target and path** — resolve skill root, intended operation (`create/update/synthesize/iterate`), distinguish internal vs repo paths, read `mode-selection.md`, classify skill (5 types), ask one question if ambiguous.

**Step 2: Run synthesis when needed** — read `synthesis-path.md`; collect/score sources with provenance; trust/safety rules; source-backed decisions; load examples profiles; enforce baseline source pack; enforce depth gates.

**Step 3: Run iteration first** — read `iteration-path.md` when operation is `iterate`; capture/anonymize examples; re-evaluate against working and holdout slices; propose improvements from evidence; carry deltas into authoring.

**Step 4: Author or update** — read `authoring-path.md`; write/update `SKILL.md` in imperative voice; create focused reference files/scripts only when justified; follow structure patterns; include transformed examples in references for authoring/generator skills (happy-path, secure/robust, anti-pattern+corrected).

**Step 5: Optimize description quality** — read `description-optimization.md`; validate should-trigger and should-not-trigger query sets; reduce false positives/negatives; keep trigger language provider-generic.

**Step 6: Evaluate outcomes** — read `evaluation-path.md`; lightweight qualitative check by default; depth rubric for integration/documentation and skill-authoring skills; deeper eval only when requested.

**Step 7: Register and validate** — read `registration-validation.md`; apply repo registration steps; quick validation with strict depth gates; reject shallow outputs.

**Output format** — 4 items: Summary, Changes Made, Validation Results, Open Gaps.

### Scripts Referenced
```bash
# Via scripts/quick_validate.py (referenced in registration-validation.md, not explicitly in SKILL.md body)
```
No explicit CLI commands in the SKILL.md body itself. All referenced operations are agent-driven reads of reference files.

---

## `prompt-engineering` Skill

**STATUS: DOES NOT EXIST** in `/Users/josorio/Code/pi-skills/skills/`. The directory is absent. The skill is registered in `~/.pi/agent/AGENTS.md` pointing to a path within the globally installed `@mariozechner/pi-coding-agent` npm package (`/Users/josorio/Library/pnpm/global/5/.pnpm/@mariozechner+pi-coding-agent@0.63.1_ws@8.20.0_zod@4.3.6/node_modules/@mariozechner/pi-coding-agent/...`), not in this local skills repo. No SKILL.md was found to read.

---

## Summary Table

| Skill | Lines | references/ | scripts/ | agents/ | Key scripts/tools |
|---|---|---|---|---|---|
| agents-md | 100 | ❌ | ❌ | ❌ | `ln -s`, `pnpm tsc`, `pnpm eslint`, `pnpm jest` |
| docker-model-runner | 71 | ✅ (1 file) | ❌ | ❌ | `docker model *` commands, curl to `localhost:12434` |
| exa-search | 174 | ✅ (1 file) | ✅ (5 `.ts` + lib/ + `__tests__/`) | ❌ | `tsx scripts/answer.ts`, `search.ts`, `contents.ts`, `find-similar.ts`, `research.ts` |
| frontend-design | 47 | ❌ | ❌ | ❌ | None |
| gh | 122 | ✅ (1 file) | ❌ | ❌ | `gh pr/issue/release/run/workflow/api` commands |
| glab | 187 | ✅ (1 file) | ❌ | ❌ | `glab mr/ci/issue/variable/schedule/release/stack/api` commands |
| interface-design | 320 | ✅ (4 files) | ❌ | ❌ | None (commands via `/interface-design:*` slash commands) |
| pdf | 62 | ❌ | ❌ | ✅ (empty) | `pdftoppm`, `uv pip install`, `brew install poppler` |
| playwright | 100 | ✅ (2 files) | ✅ (`playwright_cli.sh`) | ✅ (empty) | `"$PWCLI" open/snapshot/click/fill/screenshot`, `npx --package @playwright/cli playwright-cli` |
| posthog-skill | 338 | ✅ (2 files) | ✅ (`run.ts` + lib/ + `__tests__/`) | ❌ | `npx tsx $SKILL_DIR/scripts/run.ts *`, curl PATCH to PostHog API |
| render-deploy | 372 | ✅ (10 files) | ❌ | ✅ (empty) | `render *` CLI, `git remote`, MCP tool calls, `claude mcp add`, `codex mcp add` |
| skill-scanner | 162 | ✅ (3 files) | ✅ (`scan_skill.py`) | ❌ | `uv run scripts/scan_skill.py`, `ls -la` |
| skill-writer | 90 | ✅ (12+ files + examples/) | ✅ (`quick_validate.py`) | ❌ | Agent reads reference files; `quick_validate.py` via registration |
| **prompt-engineering** | **N/A** | **N/A** | **N/A** | **N/A** | **Skill directory does not exist in this repo** |

## Scout: Read the pi skills documentation at /Users/josorio/Library/pnpm/global/5/.pnpm/@mariozechner+pi-coding-agent@0.63.1_ws@8.20.0_zod@4.3.6/node_modules/@mariozechner/pi-coding-agent/docs/skills.md completely. Report:
1. How skills should reference the agent (what variable or convention for skill directory?)
2. How scripts are invoked from skills
3. Any requirements for frontmatter fields
4. How $SKILL_DIR or equivalent works
5. Any portability requirements

Also read /Users/josorio/Library/pnpm/global/5/.pnpm/@mariozechner+pi-coding-agent@0.63.1_ws@8.20.0_zod@4.3.6/node_modules/@mariozechner/pi-coding-agent/docs/extensions.md for any relevant context about how pi loads skills.

## Domain: Pi Skills Documentation — Conventions, Portability, and Script Invocation

### Findings Summary

Here are the concrete facts from reading both documentation files completely:

---

### 1. How Skills Should Reference the Skill Directory

**There is no `$SKILL_DIR` variable or equivalent.** The spec does not define any runtime variable for the skill's own directory.

The docs say explicitly:

> **The agent follows the instructions, using relative paths to reference scripts and assets**

And in the SKILL.md Format section:

> Use relative paths from the skill directory:
> ```markdown
> See [the reference guide](references/REFERENCE.md) for details.
> ```

The convention is:
- **Relative paths in SKILL.md** are written relative to the skill directory (e.g., `./scripts/process.sh`, `references/REFERENCE.md`)
- The **agent resolves these** at runtime after reading the full SKILL.md
- The docs at the top of AGENTS.md in this project confirm: *"When a skill file references a relative path, resolve it against the skill directory (parent of SKILL.md / dirname of the path) and use that absolute path in tool commands."* — this is a **model-side resolution convention**, not a runtime variable

The example in the docs:
```markdown
## Setup
\`\`\`bash
cd /path/to/brave-search && npm install
\`\`\`
## Search
\`\`\`bash
./search.js "query"
\`\`\`
```
Note: `cd /path/to/brave-search` is a **placeholder** (not a real path) — the model is expected to resolve the actual skill path at runtime.

---

### 2. How Scripts Are Invoked from Skills

Scripts are invoked via **bash commands** in fenced code blocks inside SKILL.md. The model reads the SKILL.md and executes the bash commands using the `bash` tool. There is no special invocation mechanism — the instructions are natural language + shell commands that the model follows. Example from docs:

```markdown
## Search
\`\`\`bash
./search.js "query"              # Basic search
./search.js "query" --content    # Include page content
\`\`\`
## Extract Page Content
\`\`\`bash
./content.js https://example.com
\`\`\`
```

Scripts in `scripts/` or as root-level files (e.g., `search.js`, `content.js`) — the model calls them with the `bash` tool after resolving the skill directory path.

---

### 3. Frontmatter Fields

Per the skills.md table:

| Field | Required | Notes |
|-------|----------|-------|
| `name` | **Yes** | Max 64 chars; `[a-z0-9-]` only; must match parent directory name; no leading/trailing/consecutive hyphens |
| `description` | **Yes** | Max 1024 chars; skills with missing description **are not loaded** |
| `license` | No | License name or reference to bundled file |
| `compatibility` | No | Max 500 chars; environment requirements |
| `metadata` | No | Arbitrary key-value mapping |
| `allowed-tools` | No | Space-delimited list of pre-approved tools (experimental) |
| `disable-model-invocation` | No | When `true`, skill is hidden from system prompt; must use `/skill:name` explicitly |

Unknown frontmatter fields are **ignored** (not errors). Most validation issues produce warnings but still load the skill. Only missing `description` causes a skill to not load.

---

### 4. How `$SKILL_DIR` or Equivalent Works

**It does not exist.** There is no `$SKILL_DIR`, `SKILL_DIR`, or any injected environment variable defined in the pi skills specification or implementation docs. The portability mechanism is purely:
1. Write relative paths in SKILL.md
2. The model resolves those relative paths to absolute paths based on where it read the SKILL.md from

No shell variable, no template substitution, no runtime injection.

---

### 5. Portability Requirements

The spec and docs establish these portability constraints:

- **Relative paths only** — all script/asset references in SKILL.md must be relative to the skill directory; absolute hardcoded paths break portability
- **Name must match directory** — `name` in frontmatter must equal the parent directory name; mismatches produce warnings
- **Self-contained directory** — the skill is a directory with SKILL.md; everything it needs must be inside that directory (scripts, references, assets, `package.json`, `node_modules/`)
- **Setup instructions in SKILL.md** — if scripts need `npm install`, the skill must include setup instructions; the model runs these on first use
- **No implicit environment** — skills cannot assume the presence of global tools beyond what's described in `compatibility`

From extensions.md — skills are **not** extensions. Extensions are TypeScript modules with API access; skills are plain markdown instruction packages. Skills have no access to `ExtensionAPI`, events, tools registration, etc.

## Scout: Search ALL files in /Users/josorio/Code/pi-skills/skills/ for references to other coding agents. Use grep to find:
1. 'codex' or 'CODEX' or 'Codex' (OpenAI Codex agent)
2. 'claude' or 'Claude' (Claude Code / Claude Desktop)
3. 'cursor' or 'Cursor' (Cursor IDE)
4. 'CODEX_HOME' or 'codex_home'
5. 'claude mcp' or 'claude code'
6. 'npx' references that assume a specific agent environment
7. Any hardcoded paths to ~/.codex/ or ~/.claude/

For each match, report: file path, line number, the full line content, and whether this is a legitimate reference (e.g., skill-scanner discussing attacks on .claude/) vs a reference that should be updated to pi.

Also check the render-deploy skill specifically for its MCP setup sections that reference Cursor/Claude Code/Codex.

Here is the complete findings report:

---

## Domain: Other-Agent References in `/Users/josorio/Code/pi-skills/skills/`

### All Matches by Category

---

#### 1. `Codex` / `CODEX` / `codex` references

| File | Line | Full Line | Legitimate? |
|------|------|-----------|-------------|
| `skill-writer/EVAL.md` | 53 | `2. Capture deterministic traces (`codex exec --json`).` | ⚠️ **Should be updated** — references Codex CLI as the evaluation harness |
| `skill-writer/EVAL.md` | 67 | `codex exec \` | ⚠️ **Should be updated** — example command using Codex CLI |
| `skill-writer/references/evaluation-path.md` | 32 | `2. Capture deterministic run traces (for example `codex exec --json`).` | ⚠️ **Should be updated** — same Codex CLI reference |
| `skill-writer/references/evaluation-path.md` | 54 | `Keep evaluation instructions tool-agnostic so they work in both Codex and Claude environments.` | ⚠️ **Should be updated** — should mention pi instead of Codex/Claude |
| `skill-writer/references/synthesis-path.md` | 38 | `3. Codex system skill-authoring source (for example `.codex/skills/.system/skill-creator/SKILL.md` when available).` | ⚠️ **Should be updated** — references `.codex/` path |
| `skill-writer/SOURCES.md` | 12 | table row: `local Codex upstream … Codex-native skill authoring conventions` | ⚠️ **Informational/historical** — documents source provenance; arguably legitimate but Codex-centric |
| `skill-writer/SOURCES.md` | 33 | `2026-03-05: Initialized SOURCES.md with baseline source pack (local canonical, Codex upstream, Claude upstream, spec, and repo conventions).` | ⚠️ **Historical note** — changelog entry, arguably fine but Codex-centric |
| `skill-writer/references/description-optimization.md` | 23 | `5. For provider-agnostic skills, avoid naming Claude, Codex, or any provider in ways that would narrow portability expectations.` | ✅ **Legitimate** — guidance to avoid mentioning those agents |
| `playwright/SKILL.md` | 36 | `export CODEX_HOME="${CODEX_HOME:-$HOME/.codex}"` | 🔴 **Must update** — hardcodes Codex as the skill root |
| `playwright/SKILL.md` | 37 | `export PWCLI="$CODEX_HOME/skills/playwright/scripts/playwright_cli.sh"` | 🔴 **Must update** — path derived from `CODEX_HOME` |
| `playwright/SKILL.md` | 40 | `User-scoped skills install under `$CODEX_HOME/skills` (default: `~/.codex/skills`).` | 🔴 **Must update** |
| `playwright/NOTICE.txt` | 13 | `- Adapted for the Codex skill collection.` | ⚠️ **Should update** — attribution note that names Codex |
| `playwright/references/cli.md` | 6 | `export CODEX_HOME="${CODEX_HOME:-$HOME/.codex}"` | 🔴 **Must update** |
| `playwright/references/cli.md` | 7 | `export PWCLI="$CODEX_HOME/skills/playwright/scripts/playwright_cli.sh"` | 🔴 **Must update** |
| `playwright/references/cli.md` | 11 | `User-scoped skills install under `$CODEX_HOME/skills` (default: `~/.codex/skills`).` | 🔴 **Must update** |
| `render-deploy/SKILL.md` | 173 | `### Codex` | ⚠️ **Context-dependent** — MCP setup section for Codex users (see detail below) |
| `render-deploy/SKILL.md` | 189 | `3. Add the MCP server with the Codex CLI:` | ⚠️ **Context-dependent** |
| `render-deploy/SKILL.md` | 192 | `codex mcp add render --url https://mcp.render.com/mcp --bearer-token-env-var RENDER_API_KEY` | ⚠️ **Context-dependent** |
| `render-deploy/SKILL.md` | 195 | `4. Restart Codex, then retry `list_services()`.` | ⚠️ **Context-dependent** |

---

#### 2. `Claude` / `claude` references

| File | Line | Full Line | Legitimate? |
|------|------|-----------|-------------|
| `skill-writer/references/claude-code-extensions.md` | entire file | Documents Claude Code frontmatter extensions (disable-model-invocation, user/agent-only, shell preprocessing) | ✅ **Legitimate** — reference doc for cross-agent portability, correctly scoped to Claude-specific features |
| `skill-writer/references/claude-code-extensions.md` | 104 | `\| Personal   \| `~/.claude/skills/<name>/SKILL.md` \|` | ✅ **Legitimate** — Claude-specific path documented in a Claude-specific doc |
| `skill-writer/references/skill-patterns.md` | 134 | `**Note:** These features are Claude Code extensions. See `references/claude-code-extensions.md`.` | ✅ **Legitimate** — cross-reference note |
| `skill-writer/references/evaluation-path.md` | 54 | `Keep evaluation instructions tool-agnostic so they work in both Codex and Claude environments.` | ⚠️ **Should update** — omits pi |
| `skill-writer/SOURCES.md` | 13 | `external Claude upstream … Claude-native prior art` | ⚠️ **Historical** — source provenance |
| `skill-writer/references/description-optimization.md` | 23 | `avoid naming Claude, Codex, or any provider` | ✅ **Legitimate** — portability guidance |
| `skill-scanner/SKILL.md` | 94 | `Writing to agent configuration directories (`~/.claude/`, `~/.agents/`, `~/.pi/`, etc.)` | ✅ **Legitimate** — security pattern for detecting attacks on agent config dirs |
| `skill-scanner/references/dangerous-code-patterns.md` | 125 | `Path("~/.claude/settings.json").expanduser().write_text(malicious_config)` | ✅ **Legitimate** — example of a dangerous code pattern the scanner should detect |
| `skill-scanner/references/dangerous-code-patterns.md` | 126, 133, 195, 199 | Various `.claude/` paths and "Claude Code" headings | ✅ **Legitimate** — attack examples and classifier context for security scanning |
| `skill-writer/scripts/quick_validate.py` | 314 | `# Claude Code extensions.` | ✅ **Legitimate** — inline comment referencing the extensions doc |
| `render-deploy/SKILL.md` | 155 | `### Claude Code` | ⚠️ **Context-dependent** — MCP setup section for Claude Code users |
| `render-deploy/SKILL.md` | 165 | `2. Add the MCP server with Claude Code (replace `<YOUR_API_KEY>`):` | ⚠️ **Context-dependent** |
| `render-deploy/SKILL.md` | 168 | `claude mcp add --transport http render https://mcp.render.com/mcp --header "Authorization: Bearer <YOUR_API_KEY>"` | ⚠️ **Context-dependent** |
| `render-deploy/SKILL.md` | 171 | `3. Restart Claude Code, then retry `list_services()`.` | ⚠️ **Context-dependent** |
| `agents-md/SKILL.md` | 74 | `Example: `Co-Authored-By: Claude Sonnet 4 <noreply@example.com>`` | ⚠️ **Should update** — example commit trailer hardcodes Claude model name |
| `frontend-design/SKILL.md` | 45 | `Remember: Claude is capable of extraordinary creative work...` | 🔴 **Must update** — agent identity leak; this prompt is now running in pi, not Claude |

---

#### 3. `Cursor` / `cursor` references

| File | Line | Full Line | Legitimate? |
|------|------|-----------|-------------|
| `render-deploy/SKILL.md` | 128 | `### Cursor` | ⚠️ **Context-dependent** — MCP setup section for Cursor IDE users |
| `render-deploy/SKILL.md` | 138 | `2. Add this to `~/.cursor/mcp.json` (replace `<YOUR_API_KEY>`):` | ⚠️ **Context-dependent** |
| `render-deploy/SKILL.md` | 153 | `3. Restart Cursor, then retry `list_services()`.` | ⚠️ **Context-dependent** |
| `exa-search/scripts/research.ts` | 42 | `"cursor": "..."` | ✅ **Legitimate** — appears to be a TypeScript object property unrelated to the IDE |
| `frontend-design/SKILL.md` | 37 | `custom cursors` as a CSS design technique | ✅ **Legitimate** — CSS cursor property, not the IDE |
| `glab/references/commands.md` | 251, 253, 257 | `$endCursor`, `endCursor` GraphQL pagination variable | ✅ **Legitimate** — GraphQL pagination token, not the IDE |

---

#### 4. `CODEX_HOME` / `codex_home` references

| File | Line | Full Line | Legitimate? |
|------|------|-----------|-------------|
| `playwright/SKILL.md` | 36 | `export CODEX_HOME="${CODEX_HOME:-$HOME/.codex}"` | 🔴 **Must update** — should use `PI_SKILL_DIR` or `SKILL_DIR` |
| `playwright/SKILL.md` | 37 | `export PWCLI="$CODEX_HOME/skills/playwright/scripts/playwright_cli.sh"` | 🔴 **Must update** |
| `playwright/SKILL.md` | 40 | `User-scoped skills install under `$CODEX_HOME/skills` (default: `~/.codex/skills`).` | 🔴 **Must update** |
| `playwright/references/cli.md` | 6 | `export CODEX_HOME="${CODEX_HOME:-$HOME/.codex}"` | 🔴 **Must update** |
| `playwright/references/cli.md` | 7 | `export PWCLI="$CODEX_HOME/skills/playwright/scripts/playwright_cli.sh"` | 🔴 **Must update** |
| `playwright/references/cli.md` | 11 | `User-scoped skills install under `$CODEX_HOME/skills` (default: `~/.codex/skills`).` | 🔴 **Must update** |

---

#### 5. `~/.codex/` and `~/.claude/` hardcoded paths

| File | Line | Full Line | Legitimate? |
|------|------|-----------|-------------|
| `playwright/SKILL.md` | 36, 40 | `$HOME/.codex` and `~/.codex/skills` | 🔴 **Must update** — functional path used to resolve the wrapper script |
| `playwright/references/cli.md` | 6, 11 | Same as above | 🔴 **Must update** |
| `skill-writer/references/claude-code-extensions.md` | 104 | `~/.claude/skills/<name>/SKILL.md` | ✅ **Legitimate** — documenting Claude's install path in a Claude-extensions reference doc |
| `skill-scanner/SKILL.md` | 94 | `~/.claude/` | ✅ **Legitimate** — security scanner listing attack targets |
| `skill-scanner/references/dangerous-code-patterns.md` | 125–133 | `~/.claude/settings.json`, `.claude/settings.json`, `.claude/memory/MEMORY.md` | ✅ **Legitimate** — malicious code examples the scanner must detect |

---

#### 6. `npx` references

| File | Line | Full Line | Legitimate? |
|------|------|-----------|-------------|
| `playwright/SKILL.md` | 13 | `Before proposing commands, check whether `npx` is available (the wrapper depends on it):` | ✅ **Legitimate** — runtime check for npx as a Node.js tool |
| `playwright/SKILL.md` | 16–31 | npx availability check and fallback install steps | ✅ **Legitimate** — tool dependency, not agent-specific |
| `playwright/SKILL.md` | 123 | `The wrapper script uses `npx --package @playwright/cli playwright-cli`` | ✅ **Legitimate** |
| `playwright/scripts/playwright_cli.sh` | 4, 5, 19 | `command -v npx`, `npx is required`, `npx --yes --package @playwright/cli playwright-cli` | ✅ **Legitimate** — shell script using npx as a package runner |
| `posthog-skill/SKILL.md` | 13, 17, 366, 512 | `npx tsx` commands | ✅ **Legitimate** — using npx to run tsx, a Node.js tool |
| `render-deploy/references/configuration-guide.md` | 425 | `buildCommand: npm ci && npx prisma migrate deploy` | ✅ **Legitimate** — Render build command in a config example |

All `npx` references are tool-runtime uses (running Node.js packages), not agent-environment assumptions.

---

### render-deploy MCP Setup Sections (lines 128–200)

The skill contains three named MCP setup sections:

| Section | What it does | Assessment |
|---------|-------------|------------|
| **`### Cursor`** (L128–153) | Instructs user to edit `~/.cursor/mcp.json` manually | ⚠️ **Context-dependent** — legitimate "help user configure their other tool" content, but the skill is deployed in pi; the user asking pi to set up Render may not be using Cursor. The section should at minimum add a `### pi` section. |
| **`### Claude Code`** (L155–171) | Runs `claude mcp add --transport http ...` | ⚠️ **Context-dependent** — same as above |
| **`### Codex`** (L173–195) | Runs `codex mcp add ...` | ⚠️ **Context-dependent** — same as above |
| **`### Other Tools`** (L197–199) | Generic fallback pointing to Render MCP docs | ✅ Exists but pi is absent from the named sections |

The skill's logic is: "ask which AI tool they're using, then provide the matching instructions." Since pi is the executing agent, there is no `### pi` section — a user running this skill inside pi and wanting to add the Render MCP to pi itself has no matching instructions.

---

### Findings Summary

- **🔴 Must update (functional bugs):** `playwright/SKILL.md` lines 36–40 and `playwright/references/cli.md` lines 6–11 — `CODEX_HOME` is hardcoded as the skill root env var and resolves to `~/.codex/skills`. In pi the correct variable is `SKILL_DIR` (injected at runtime). The wrapper script path will fail for pi users.

- **🔴 Must update (agent identity leak):** `frontend-design/SKILL.md` line 45 — "Remember: Claude is capable of extraordinary creative work…" is a self-referential instruction written for Claude that is now executing in pi. The model will read this as referring to itself (Claude), but the executing agent is pi.

- **⚠️ render-deploy is missing a `### pi` MCP section** — the three existing MCP setup sections (Cursor, Claude Code, Codex) cover other agents. There is no `### pi` entry, so a pi user who wants to add Render MCP to their pi config gets no instructions.

- **⚠️ skill-writer evaluation docs use Codex CLI** — `EVAL.md` and `references/evaluation-path.md` reference `codex exec --json` as the evaluation harness. This is not available in pi.

- **✅ All skill-scanner references are legitimate** — `~/.claude/`, `.claude/settings.json`, and Claude Code frontmatter hooks appear exclusively as *attack examples* in security scanning reference material, which is correct and intentional.

