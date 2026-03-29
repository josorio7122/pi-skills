Now I have a complete picture. Let me write the task plan.

---

## Tasks for config-centralization

### ⚠️ Scope expansion flag

The approved design lists **6 file operations** (2 config updates + 4 deletions). This plan adds:

- **6 test file modifications** in `skills/posthog-skill/scripts/__tests__/` — all 6 files that spawn `tsx` subprocesses hardcode `path.join(__dirname, '..', '..', 'node_modules', '.bin', 'tsx')` (resolves to local `node_modules`). After deleting local `node_modules`, every subprocess-based test breaks. This fix is mandatory.
- **1 SKILL.md update** — frontmatter and body text say "Run `pnpm install` in the skill directory on first use." After deletion of local `package.json`/`node_modules`, this instruction is wrong.

Total: 6 original → 13 touched = **+116% scope increase**. All additions are direct consequences of the approved deletions.

### Data flow

1. **In:** Duplicate configs at root and `skills/posthog-skill/` (tsconfig.json, package.json, pnpm-lock.yaml, node_modules/)
2. **Transform:**
   - Harden root tsconfig.json with strict flags from posthog-skill's tsconfig
   - Update 6 test files to resolve TSX binary from root's `node_modules`
   - Add test scripts to root package.json via `npm pkg set`
   - Delete duplicate configs and local node_modules
   - Update SKILL.md install instructions
3. **Out:** Single config set at root, `tsc --noEmit` passes, `pnpm test` runs posthog tests successfully

### Edge cases

| Step | Risk | Mitigation |
|------|------|------------|
| `noUnusedLocals` / `noUnusedParameters` | Could surface violations in exa-search scripts | Code review shows none; `tsc --noEmit` in pair 1 will confirm |
| `noUncheckedIndexedAccess` | `array[n]` returns `T \| undefined` | Current code uses `Record<string, unknown>` (undefined ⊂ unknown) or `??` fallbacks; safe |
| `types: ["node"]` | Restricts ambient types to `@types/node` only | Root has no other `@types/*` packages |
| `moduleResolution: "bundler"` vs posthog's `"Node16"` | posthog imports use `.js` extensions | `.js` extensions work with both; verified in all import statements |
| TSX binary resolution | 6 test files spawn `tsx` via hardcoded local path | Update to resolve from root's `node_modules/.bin/tsx` (4 levels up from `__tests__/`) |
| SKILL.md stale instructions | "Run `pnpm install` in skill directory" becomes wrong | Update doc to reference root-level setup |

---

### 1a. Write compilation test for strict tsconfig settings (RED)
**Agent:** test-writer
**Scope:** temporary `tsconfig.strict-check.json` (created then deleted)
**Test criteria:**
- Create a temporary tsconfig at root with all target strict flags added: `noUnusedLocals: true`, `noUnusedParameters: true`, `noUncheckedIndexedAccess: true`, `resolveJsonModule: true`, `forceConsistentCasingInFileNames: true`, `types: ["node"]`
- Run `tsc --noEmit -p tsconfig.strict-check.json` against `skills/**/*.ts`
- test_all_skills_compile_under_strict_settings → document PASS or list specific failures
- If any files fail: those errors are the RED for 1b to fix
- If all pass: strict settings are safe to apply (clean baseline established)
- Clean up temporary tsconfig file after verification
**Test tier:** compilation
**Depends on:** none

### 1b. Update root tsconfig.json with strict settings (GREEN)
**Agent:** builder
**Scope:** `tsconfig.json`
**Test criteria:**
- tsconfig.json includes all 6 new strict flags: `noUnusedLocals`, `noUnusedParameters`, `noUncheckedIndexedAccess`, `resolveJsonModule`, `forceConsistentCasingInFileNames`, `types: ["node"]`
- Retains existing settings: `noEmit: true`, `moduleResolution: "bundler"`, `module: "ES2022"`, `target: "ES2022"`, `strict: true`, `esModuleInterop: true`, `skipLibCheck: true`
- Does NOT add emit-related settings from posthog-skill (no `declaration`, `declarationMap`, `sourceMap`, `outDir`, `rootDir`)
- `tsc --noEmit` exits 0 for all `skills/**/*.ts` → MUST PASS
- Fix any files that fail under strict settings (if 1a found issues)
**Depends on:** 1a

### 2a. Write tests for centralized test execution (RED)
**Agent:** test-writer
**Scope:** `skills/posthog-skill/scripts/__tests__/` (analysis + verification)
**Test criteria:**
- Confirm all 6 test files with subprocess spawning contain the LOCAL TSX path pattern (`path.join(__dirname, '..', '..', 'node_modules', '.bin', 'tsx')`) → MUST FIND in: `status.test.ts`, `inspect.test.ts`, `create.test.ts`, `compare.test.ts`, `flags.test.ts`, `live.test.ts`
- Run `pnpm test` at root → MUST FAIL (no `test` script defined in root package.json)
- Confirm pre-condition: `skills/posthog-skill/package.json`, `skills/posthog-skill/tsconfig.json`, `skills/posthog-skill/pnpm-lock.yaml` all exist
**Test tier:** integration
**Depends on:** 1b

### 2b. Centralize test execution: fix paths, add scripts, delete duplicates (GREEN)
**Agent:** builder
**Scope:**
- Fix: `skills/posthog-skill/scripts/__tests__/status.test.ts`, `inspect.test.ts`, `create.test.ts`, `compare.test.ts`, `flags.test.ts`, `live.test.ts`
- Add scripts: root `package.json` (via `npm pkg set`)
- Delete: `skills/posthog-skill/package.json`, `skills/posthog-skill/tsconfig.json`, `skills/posthog-skill/pnpm-lock.yaml`, `skills/posthog-skill/node_modules/`
**Test criteria:**
- All 6 test files resolve TSX from root: `path.join(__dirname, '..', '..', '..', '..', 'node_modules', '.bin', 'tsx')` (4 levels up from `__tests__/` → repo root)
- No test file contains the old LOCAL path (`'..', '..', 'node_modules'` — only 2 levels up)
- Root package.json has `scripts.test` = `"tsx --test skills/posthog-skill/scripts/__tests__/*.test.ts"`
- Root package.json has `scripts.test:live` = `"POSTHOG_TEST_LIVE=1 tsx --test skills/posthog-skill/scripts/__tests__/*.test.ts"`
- Root package.json retains `pi.skills` = `["./skills"]`
- `skills/posthog-skill/package.json` → MUST NOT EXIST
- `skills/posthog-skill/tsconfig.json` → MUST NOT EXIST
- `skills/posthog-skill/pnpm-lock.yaml` → MUST NOT EXIST
- `skills/posthog-skill/node_modules/` → MUST NOT EXIST
- `pnpm test` → MUST PASS (all posthog unit tests green)
- `tsc --noEmit` → MUST PASS (full compilation still works after cleanup)
**Depends on:** 2a

### D1. Update SKILL.md install and test instructions
**Agent:** doc-writer
**Target file:** `skills/posthog-skill/SKILL.md`
**Content:**
- Update `compatibility` frontmatter from `"Requires Node.js 18+ and tsx. Run pnpm install in the skill directory on first use."` → `"Requires Node.js 18+ and tsx. Dependencies are managed at the repository root."`
- Update body text (line ~21) that says "Run `pnpm install` in the skill directory on first use to install `tsx` and type dependencies." → "Dependencies (`tsx`, `typescript`, `@types/node`) are installed at the repository root. Run `pnpm install` from the repo root if needed."
- Verify test commands in SKILL.md (`npx tsx --test $SKILL_DIR/scripts/__tests__/*.test.ts`) still work — these use `npx` which resolves from nearest `node_modules` up the tree, so they remain valid after centralization
**Verify:** All code paths and commands referenced in SKILL.md still work with the centralized setup
**Depends on:** 2b