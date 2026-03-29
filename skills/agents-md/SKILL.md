---
name: agents-md
description: Create and maintain minimal, high-signal AGENTS.md files. Use when asked to "create AGENTS.md", "update AGENTS.md", "maintain agent docs", "set up agent instructions file", or when agent instructions need to be kept concise.
metadata:
  author: josorio7122
  version: '1.0'
---

# Maintaining AGENTS.md

AGENTS.md is the canonical agent-facing documentation. Keep it minimal—agents are capable and don't need hand-holding. Target under 60 lines; never exceed 100. Instruction-following quality degrades as document length increases.

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

```markdown
## Commit Attribution

AI commits MUST include:
```

Co-Authored-By: AI Agent <ai@noreply.example.com>

```

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

See [references/example-structure.md](references/example-structure.md) for a complete template and anti-patterns to avoid.

## Output

Present the generated AGENTS.md in a code block. Ask the user to confirm before writing the file.
