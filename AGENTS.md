# Agent Instructions

## Package Manager
Use **npm**: `npm install`, `npm test`, `npm run check`

## File-Scoped Commands
| Task | Command |
|------|---------|
| Typecheck | `npx tsc --noEmit` |
| Lint | `npx biome check skills/ tests/` |
| Lint fix | `npx biome check --fix skills/ tests/` |
| Format | `npx biome format --write skills/ tests/` |
| Test | `npx vitest run` |
| Test file | `npx vitest run tests/posthog-skill/posthog-client.test.ts` |
| All checks | `npm run check` |

## Commit Attribution
Never add `Co-Authored-By` trailers or any AI attribution to commit messages.

## TypeScript Rules

### No `any` — zero tolerance
- `any` is banned in production code (enforced by biome)
- Use `unknown` + type narrowing, or generics
- Test files may use `any` sparingly for stubs

### Prefer type inference
- Never annotate what the compiler already knows
- No return type annotations — let TS infer them
- No redundant variable annotations: `const x = 'hello'` not `const x: string = 'hello'`
- Annotate function parameters and public API contracts only

### Pure functions by default
- Default to pure functions: same input → same output, no side effects
- Push side effects (I/O, time, randomness) to the edges

### Strict tsconfig is non-negotiable
- `strict: true` — always
- `noUncheckedIndexedAccess: true` — array/object index returns `T | undefined`
- `exactOptionalPropertyTypes: true` — `undefined` must be explicit, not implicit
- Never loosen these flags to fix type errors — fix the code instead

### Modern TS patterns
- `unknown` in catch blocks — narrow before using
- `as const` for literal tuples and config objects
- `satisfies` to validate literals without widening

## Script Conventions

### Entry-point pattern
- One script per command — no single-CLI dispatcher
- Args: `<target> [options-json]` — positional, JSON for options
- All scripts use `parseArgs()` from `scripts/lib/common.ts`

### I/O contract
- JSON to stdout via `out()` helper
- Diagnostics to stderr via `process.stderr.write()`
- Never use `console.log` or `console.error`
- Exit 1 on errors

### Shared lib
- `scripts/lib/common.ts` in each skill: `requireEnv`, `requireArg`, `out`, `executeAndPrint`, `handleError`, `showHelp`, `parseArgs`
- Error narrowing: always `err instanceof Error`, never `(err as Error)`

## SKILL.md Structure

### Required sections (in order)
1. Frontmatter (`name`, `description`)
2. Intro paragraph (imperative voice)
3. Prerequisites (if applicable)
4. Choosing the Right Script / Command table
5. Rules
6. Output Format
7. Error Recovery
8. References (if applicable)

### Section naming — use exactly these names
- `## Error Recovery` (not Troubleshooting, not When Things Fail)
- `## Output Format` (not Output, not Output Contract)
- `## Choosing the Right Script` or `## Choosing the Right Command`

### Writing rules
- Imperative voice throughout
- Third person in descriptions
- No first/second person ("I can", "you should")
- Tables for decision logic
- Progressive disclosure — load references conditionally

## Conventions
- ESM-only (`type: "module"`, `.js` extensions in imports)
- Colocate tests in `tests/<skill-name>/`
- Unused code is deleted, not commented out
