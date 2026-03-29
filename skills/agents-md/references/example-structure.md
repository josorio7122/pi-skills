# agents-md Reference

## Example Structure

```markdown
# Agent Instructions

## Package Manager

Use **pnpm**: `pnpm install`, `pnpm dev`

## Commit Attribution

AI commits MUST include:

Co-Authored-By: AI Agent <ai@noreply.example.com>

## File-Scoped Commands

| Task      | Command                             |
| --------- | ----------------------------------- |
| Typecheck | `pnpm tsc --noEmit path/to/file.ts` |
| Lint      | `pnpm eslint path/to/file.ts`       |
| Test      | `pnpm jest path/to/file.test.ts`    |

## API Routes

[Template code block]

## CLI

| Command         | Description |
| --------------- | ----------- |
| `pnpm cli sync` | Sync data   |
```

## Anti-Patterns

Omit these:

- "Welcome to..." or "This document explains..."
- "You should..." or "Remember to..."
- Linter/formatter rules already in config files (`.eslintrc`, `biome.json`, `ruff.toml`)
- Listing installed skills or plugins (agents discover these automatically)
- Full project-wide build commands when file-scoped alternatives exist
- Obvious instructions ("run tests", "write clean code")
- Explanations of why (just say what)
- Long prose paragraphs
