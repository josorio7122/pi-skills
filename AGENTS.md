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
- Justified exceptions: type predicates (`x is T`), factory functions that widen initial values, discriminated union returns needed for narrowing, and public API contracts
- No redundant variable annotations: `const x = 'hello'` not `const x: string = 'hello'`
- Annotate function parameters and public API contracts only

### Functional patterns — non-negotiable
- **No classes** — ever (exception: `extends Error` for typed errors)
- Default to pure functions: same input → same output, no side effects
- Push side effects (I/O, time, randomness) to the edges — pass them as arguments
- Use `readonly` for all data types — mutable state is the exception, not the default
- Factory functions with closures for stateful behavior (not classes)
- Use discriminated unions for variants, not inheritance
- Functions return new data, never mutate arguments

### Object params for 2+ arguments
```ts
// ✗
function run(name: string, model: string) {}
// ✓
function run(params: { readonly name: string; readonly model: string }) {}
```

### Code splitting
- 200 lines max per file — split when exceeded, no exceptions
- Split by cohesion: related functions stay together, unrelated concepts get their own file
- No barrel files — direct imports only
- Export only what other modules consume
- After any refactor that changes APIs — grep for orphaned types/interfaces/consts

### Strict tsconfig is non-negotiable
- `strict: true`, `noUncheckedIndexedAccess: true`, `exactOptionalPropertyTypes: true`
- Never loosen these flags — fix the code instead

### Modern TS patterns
- Discriminated unions over optional fields + boolean flags
- `satisfies` to validate literals without widening
- `as const` for literal tuples and config objects
- `unknown` in catch blocks — narrow before using
- Constrained generics (`extends`) over unconstrained `<T>`
- Utility types (`Pick`, `Omit`, `Partial`, `Record`) over manual redeclaration

## TDD Process

### Red → Green → Commit
1. Write a failing test first — run it, confirm red
2. Write the minimum code to pass — run it, confirm green
3. Commit test + implementation together

### Test quality rules
- Test behavior, not implementation details
- Every test must catch a real bug if it fails
- No testing trivial code
- No `class TestXxx` — use plain `describe`/`it` with vitest
- Pure function extraction is the #1 testing strategy

### Mocking rules
- Prefer `vi.spyOn` over `vi.mock`
- `vi.mock` is a last resort — only for modules that are entirely I/O
- Prefer fakes and real objects over mocks
- Never mock what you own
- If a test needs more than 2 mocks, refactor first

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
- Types live next to the code that uses them
- Unused code is deleted, not commented out
- Functions are the unit of composition — not classes, not modules
