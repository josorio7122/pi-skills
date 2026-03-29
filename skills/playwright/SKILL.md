---
name: playwright
description: Automate a real browser from the terminal for navigation, form filling, screenshots, data extraction, and UI-flow debugging. Use when the user asks to "take a screenshot," "scrape a page," "fill a form," "test a UI flow," "automate the browser," "open a webpage," or any task that requires interacting with a live website. Also use when the user needs to extract data from a JavaScript-rendered page that simple HTTP requests can't handle.
---

# Playwright CLI Skill

Drive a real browser from the terminal using `playwright-cli`. Prefer the bundled wrapper script so the CLI works even when it is not globally installed.
Treat this skill as CLI-first automation. Do not pivot to `@playwright/test` unless the user explicitly asks for test files.

## Prerequisite check (required)

Before proposing commands, check whether `npx` is available (the wrapper depends on it):

```bash
command -v npx >/dev/null 2>&1
```

If it is not available, pause and ask the user to install Node.js/npm (which provides `npx`). Provide these steps verbatim:

```bash
# Verify Node/npm are installed
node --version
npm --version

# If missing, install Node.js/npm, then:
npm install -g @playwright/cli@1.50.1
playwright-cli --help
```

Once `npx` is present, proceed with the wrapper script. A global install of `playwright-cli` is optional.

## Skill path

The wrapper script is at `scripts/playwright_cli.sh` (relative to this skill's directory).

## Guardrails

- If `@playwright/cli@1.50.1` is not found, the wrapper exits with an install hint. Run `npm install @playwright/cli@1.50.1` first.
- Always snapshot before referencing element ids like `e12`.
- Re-snapshot when refs seem stale.
- Avoid `eval` and `run-code`. Use them only when no built-in CLI command achieves the goal, and only on pages you control. Never evaluate content sourced from untrusted page data.
- When you do not have a fresh snapshot, use placeholder refs like `eX` and say why; do not bypass refs with `run-code`.
- Use `--headed` when a visual check will help.
- Use a dedicated output directory (e.g., `output/playwright/`) for artifacts.
- Default to CLI commands and workflows, not Playwright test specs.

## Error Recovery

- `ref not found` / stale element ref → run `snapshot` to refresh refs, then retry.
- `@playwright/cli` not found → run `npm install @playwright/cli@1.50.1`.
- Blank or crashed page → re-`open` the URL. Try `--headed` for debugging.
- `npx` not found → Node.js is not installed. Ask the user to install it.
- Session lost → re-`open` the original URL to start a new session.

## Output

After each significant step, report: the command run, a brief summary of the result, and the path to any saved artifact.

On failure, report: the command that failed, the error message verbatim, and the recovery step taken.

## Quick start

Use the wrapper script:

```bash
scripts/playwright_cli.sh open https://playwright.dev --headed
scripts/playwright_cli.sh snapshot
scripts/playwright_cli.sh click e15
scripts/playwright_cli.sh type "Playwright"
scripts/playwright_cli.sh press Enter
scripts/playwright_cli.sh screenshot
```

If the user prefers a global install, this is also valid:

```bash
npm install -g @playwright/cli@1.50.1
playwright-cli --help
```

## Core workflow

1. Open the page.
2. Snapshot to get stable element refs.
3. Interact using refs from the latest snapshot.
4. Re-snapshot after navigation or significant DOM changes.
5. Capture artifacts (screenshot, pdf, traces) when useful.

The core loop is open → snapshot → interact → re-snapshot. See [references/workflows.md](references/workflows.md) for full patterns.

## When to snapshot again

Snapshot again after:

- navigation
- clicking elements that change the UI substantially
- opening/closing modals or menus
- tab switches

Refs can go stale. When a command fails due to a missing ref, snapshot again.

## Recommended patterns

Load [references/workflows.md](references/workflows.md) only when the task involves forms, multi-step flows, sessions, or debugging.

## Prerequisites

Version 1.50.1 is pinned for reproducibility. To use a newer release, replace the version in `scripts/playwright_cli.sh` and the install commands.

## References

Open only what you need:

- Need a full command reference? Load [references/cli.md](references/cli.md).
- Practical workflows and troubleshooting: `references/workflows.md`
