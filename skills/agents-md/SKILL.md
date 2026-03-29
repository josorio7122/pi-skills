---
name: agents-md
description: Create and maintain minimal, high-signal AGENTS.md files. Use when asked to "create AGENTS.md", "update AGENTS.md", "maintain agent docs", "set up agent instructions file", or when agent instructions need to be kept concise.
---

# Maintaining AGENTS.md

You write and maintain AGENTS.md files — the shortest possible agent instructions that make agents effective.

> **Hard limit:** never exceed 100 lines. Target 60.

## File Setup

1. Create `AGENTS.md` at project root
2. Optionally create provider-specific symlinks (e.g., `ln -s AGENTS.md CLAUDE.md` for Claude-based agents)

## Before Writing

Analyze the project to understand what belongs in the file:

1. **Package manager** — Check for lock files (`pnpm-lock.yaml`, `yarn.lock`, `package-lock.json`, `uv.lock`, `poetry.lock`)
2. **Linter/formatter configs** — Look for `.eslintrc`, `biome.json`, `ruff.toml`, `.prettierrc`, etc. (don't duplicate these in AGENTS.md)
3. **CI/build commands** — Check `Makefile`, `package.json` scripts, CI configs for canonical commands
4. **Monorepo indicators** — Check for `pnpm-workspace.yaml`, `nx.json`, Cargo workspace, or subdirectory `package.json` files
5. **Existing conventions** — Check for existing CONTRIBUTING.md, docs/, or README patterns

## Writing Rules

- **Headers + bullets** — No paragraphs
- **Code blocks** — For commands and templates
- **Reference, don't embed** — Point to existing docs: "See `CONTRIBUTING.md` for setup" or "Follow patterns in `src/api/routes/`"
- **No filler** — No intros, conclusions, or pleasantries
- **Trust capabilities** — Omit obvious context
- **Prefer file-scoped commands** — Per-file test/lint/typecheck commands over project-wide builds
- **Don't duplicate linters** — Code style lives in linter configs, not AGENTS.md

## Required Sections

### Package Manager

Which tool and key commands only:

```markdown
## Package Manager

Use **pnpm**: `pnpm install`, `pnpm dev`, `pnpm test`
```

### File-Scoped Commands

Per-file commands are faster and cheaper than full project builds. Always include when available:

```markdown
## File-Scoped Commands

| Task      | Command                             |
| --------- | ----------------------------------- |
| Typecheck | `pnpm tsc --noEmit path/to/file.ts` |
| Lint      | `pnpm eslint path/to/file.ts`       |
| Test      | `pnpm jest path/to/file.test.ts`    |
```

### Commit Attribution

Always include this section. Agents should use their own identity:

```
Co-Authored-By: AI Agent <ai@noreply.example.com>
```

### Key Conventions

Project-specific patterns agents must follow. Keep brief.

## Optional Sections

Add only if truly needed:

- API route patterns (show template, not explanation)
- CLI commands (table format)
- File naming conventions
- Project structure hints (point to critical files, flag legacy code to avoid)
- Monorepo overrides (subdirectory `AGENTS.md` files override root)

## Edge Cases

- No lock file found: ask the user which package manager to use
- Existing AGENTS.md over 100 lines: trim to required sections first, confirm with user
- Conflicting conventions: defer to the most recently modified config file
- No recognizable project structure: create a minimal AGENTS.md with only Package Manager and Commit Attribution, then ask the user what else to include

If you need a full template or anti-pattern examples, read [references/example-structure.md](references/example-structure.md).

## Output

**NEVER** write the file without explicit user confirmation.

Present the generated AGENTS.md in a fenced code block. For updates, present the full updated file (not a diff).

If a blocking edge case applies (unknown package manager, missing lock file), ask the clarifying question before generating.
