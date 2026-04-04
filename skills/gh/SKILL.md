---
name: gh
description: Interact with GitHub from the command line using the gh CLI. Use when working with pull requests, issues, releases, Actions workflows and runs, repository management, code review, or GitHub API calls. Also use when the user says "open a PR," "create an issue," "check CI," "merge this," "make a release," or any GitHub-related task — even if they don't mention gh explicitly.
---

# GitHub CLI (gh)

Operate the `gh` CLI. Run `gh auth status` before the first command in any session. Prefer built-in commands over `gh api`.

## Prerequisites

Verify before any command:

- `gh --version` — must be installed (macOS: `brew install gh`; Linux: see https://github.com/cli/cli/blob/trunk/docs/install_linux.md; Windows: `winget install --id GitHub.cli`)
- `gh auth status` — must be authenticated (`gh auth login` for browser OAuth, or `echo "$GITHUB_TOKEN" | gh auth login --with-token`)

---

## Choosing the Right Command

| Goal                                       | Workflow         |
| ------------------------------------------ | ---------------- |
| Push work and get it reviewed              | Create a PR      |
| Check if CI passed before merging          | Check CI         |
| Review someone else's PR                   | Review a PR      |
| Ship a PR to main                          | Merge a PR       |
| Track or report a bug/feature              | Work with Issues |
| Cut a new version                          | Make a Release   |
| Monitor or trigger Actions runs            | Monitor Actions  |
| Do something gh doesn't have a command for | Use the API      |

Read [references/workflows.md](references/workflows.md) for the complete step-by-step sequence for each goal above.

---

## Rules

**Never execute these without explicit user confirmation in the current message:**

- `gh repo delete`
- `gh release delete`
- `gh cache delete --all`
- `gh issue delete`
- `gh run delete`
- `gh repo archive` (semi-permanent — sets repo read-only)

State what will be destroyed and wait for confirmation before running any of the above.

---

## Output Format

- **List/view commands:** Summarize key fields (PR: number, title, status, author, checks, URL; Issue: number, title, state, labels; Run: ID, workflow, status, conclusion). Never dump raw JSON.
- **Create/merge commands:** Confirm the action and return the resulting URL.

```
## PR #42 — Add dark mode support
Status: OPEN | Author: jsmith | Checks: ✓ passing (3/3)
URL: https://github.com/owner/repo/pull/42

## Issue #17 — Login fails on Safari
State: OPEN | Labels: bug, priority:high
URL: https://github.com/owner/repo/issues/17

## Run #9876543210 — CI / test (push)
Workflow: ci.yml | Status: completed | Conclusion: success
```

---

## Error Recovery

- **`HTTP 403` or rate limiting** — check `gh auth status`; token may be expired or lack required scopes
- **Expired or missing token** — run `gh auth refresh` to renew without re-authenticating
- **SAML/SSO enforcement** — run `gh auth refresh --scopes read:org` and authorize via org SSO page
- **Merge conflict on `gh pr merge`** — run `gh pr update-branch` to rebase, then retry
- **`gh pr checks` returns nothing** — CI may not be configured for this repo; proceed with manual review
- **Permission denied on merge** — the account may lack maintainer rights; open a review request instead
- **Wrong repo detected** — use `--repo owner/repo` to specify explicitly
- **Unrecognized error** — run `gh <command> --help` or check https://cli.github.com/manual/

---

## References

- Full workflow sequences: [references/workflows.md](references/workflows.md)
- Complete command table: [references/commands.md](references/commands.md)
