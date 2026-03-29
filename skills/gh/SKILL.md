---
name: gh
description: Interact with GitHub from the command line using the gh CLI. Use when working with pull requests, issues, releases, Actions workflows and runs, repository management, code review, or GitHub API calls. Also use when the user says "open a PR," "create an issue," "check CI," "merge this," "make a release," or any GitHub-related task — even if they don't mention gh explicitly. Requires gh CLI installed and authenticated.
metadata:
  author: josorio7122
  version: '2.0'
---

# GitHub CLI (gh)

Work with GitHub repositories, pull requests, issues, releases, and Actions from the command line.

## Prerequisites

```bash
gh --version     # Must be installed
gh auth status   # Must be authenticated
```

If not authenticated:

```bash
gh auth login                          # Interactive (browser OAuth — recommended)
gh auth login --with-token <<< "<pat>" # With personal access token — Note: token appears in shell history. Prefer 'gh auth login' (browser) for interactive sessions.
```

---

## Choosing the Right Command

Most GitHub work falls into a few categories. Pick the right one and you avoid wasting time.

| You need to...                             | Start here                            |
| ------------------------------------------ | ------------------------------------- |
| Push your work and get it reviewed         | [Create a PR](#create-a-pr)           |
| Check if CI passed before merging          | [Check CI](#check-ci)                 |
| Review someone else's PR                   | [Review a PR](#review-a-pr)           |
| Ship a PR to main                          | [Merge a PR](#merge-a-pr)             |
| Track or report a bug/feature              | [Work with Issues](#work-with-issues) |
| Cut a new version                          | [Make a Release](#make-a-release)     |
| Do something gh doesn't have a command for | [Use the API](#use-the-api)           |

---

## Workflows

These are the sequences you'll use most. Each one is a complete flow — follow it top to bottom.

For view/list commands, summarize key fields rather than printing raw output. For create/merge commands, confirm the action and provide the resulting URL.

### Create a PR

The most common operation. `--fill` pulls title and body from your commit messages — always use it rather than writing PR descriptions from scratch.

```bash
git push -u origin HEAD
gh pr create --fill
```

Common variations:

```bash
gh pr create --fill --draft                    # Not ready for review yet
gh pr create --fill --base develop             # Target a specific branch
gh pr create --fill --reviewer alice --label bug # Add reviewer + label
gh pr create --title "feat: add X" --body "..." # Manual title/body
```

### Check CI

Before merging, verify the pipeline passed. `--watch` blocks until all checks finish — useful in scripts or when you want to wait.

```bash
gh pr checks                  # Current PR's check status
gh pr checks <number> --watch # Block until checks complete
```

If a check failed:

```bash
gh run view <run-id> --log    # Read the full log
gh run rerun <run-id> --failed # Retry only failed jobs
```

### Review a PR

Check out the code locally, read it, then leave your verdict.

```bash
gh pr checkout <number>                                  # Get the code
gh pr diff <number>                                      # See the changes
gh pr review <number> --approve                          # Approve
gh pr review <number> --request-changes --body "Details" # Request changes
gh pr review <number> --comment --body "Looks good"      # Comment only
```

### Merge a PR

Pick the merge strategy that matches the project's convention. Squash is the most common — it collapses all commits into one clean entry on main.

```bash
gh pr merge <number> --squash --delete-branch  # Squash + cleanup (most common)
gh pr merge <number> --rebase --delete-branch  # Rebase (linear history)
gh pr merge <number> --delete-branch           # Merge commit (preserves branch history)
```

**When to use which:**

- **Squash** — default for most projects. One commit per PR on main. Clean log.
- **Rebase** — when individual commits are meaningful and well-structured.
- **Merge commit** — when you need to preserve the branch topology (rare).

### Work with Issues

```bash
gh issue create --title "Bug: X" --body "Details" --label bug
gh issue list --assignee @me            # What's on my plate
gh issue view <number>                  # Read the details
gh issue close <number>                 # Done
gh issue develop <number>              # Create a branch from the issue
```

### Make a Release

```bash
gh release create v1.0.0 --generate-notes                # Auto-generate notes from PRs
gh release create v1.0.0 --notes-file CHANGELOG.md       # Use a changelog file
gh release upload v1.0.0 ./dist/*.tar.gz                  # Attach build artifacts
```

### Monitor Actions

```bash
gh run list                             # Recent workflow runs
gh run list --workflow deploy.yml       # Runs for a specific workflow
gh run watch <run-id>                   # Live-stream a run
gh workflow run deploy.yml --ref main   # Trigger a workflow manually
```

---

## Use the API

`gh api` is your escape hatch for anything gh doesn't have a built-in command for. It handles auth, pagination, and formatting automatically.

```bash
# REST
gh api repos/owner/repo
gh api repos/owner/repo/issues -f title="Bug" -f body="Details"
gh api repos/owner/repo/pulls --jq '.[].title'

# GraphQL
gh api graphql -f query='{ viewer { login } }'

# Pagination
gh api repos/owner/repo/issues --paginate
```

---

## Tips

Most commands infer the repo from git remotes — use `--repo` only for cross-repo operations.

---

## When Things Fail

- **`HTTP 403` or rate limiting** — check `gh auth status`; token may be expired or lack required scopes
- **Merge conflict on `gh pr merge`** — run `gh pr update-branch` to rebase, then retry
- **`gh pr checks` returns nothing** — CI may not be configured for this repo; proceed with manual review
- **Permission denied on merge** — you may not be a maintainer; open a review request instead
- **Wrong repo detected** — use `--repo owner/repo` to specify explicitly

---

## Reference

For the complete command table (every PR, issue, repo, release, Actions, search, cache, and config command), see [references/commands.md](references/commands.md).
