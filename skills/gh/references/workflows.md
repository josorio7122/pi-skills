# gh Workflow Reference

## Create a PR

The most common operation. Prefer `--fill` to auto-populate from commits; override with `--title`/`--body` if the user provides a specific description.

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

## Check CI

Before merging, verify the pipeline passed. `--watch` blocks until all checks finish — useful in scripts or when you want to wait.

```bash
gh pr checks                  # Current PR's check status
gh pr checks <number> --watch # Block until checks complete
```

If a check failed:

```bash
gh run list --limit 5          # Find the run-id for the failing run
gh run view <run-id> --log    # Read the full log
gh run rerun <run-id> --failed # Retry only failed jobs
```

## Review a PR

Check out the code locally, read it, then leave your verdict.

```bash
gh pr checkout <number>                                  # Get the code
gh pr diff <number>                                      # See the changes
gh pr review <number> --approve                          # Approve
gh pr review <number> --request-changes --body "Details" # Request changes
gh pr review <number> --comment --body "Looks good"      # Comment only
```

## Merge a PR

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

## Work with Issues

```bash
gh issue create --title "Bug: X" --body "Details" --label bug
gh issue list --assignee @me            # What's on my plate
gh issue view <number>                  # Read the details
gh issue close <number>                 # Done
gh issue develop <number>              # Create a branch from the issue
```

## Make a Release

```bash
gh release create v1.0.0 --generate-notes                # Auto-generate notes from PRs
gh release create v1.0.0 --notes-file CHANGELOG.md       # Use a changelog file
gh release upload v1.0.0 ./dist/*.tar.gz                  # Attach build artifacts
```

## Monitor Actions

```bash
gh run list                             # Recent workflow runs
gh run list --workflow deploy.yml       # Runs for a specific workflow
gh run watch <run-id>                   # Live-stream a run
gh workflow run deploy.yml --ref main   # Trigger a workflow manually
```

Confirm with the user before triggering any workflow on a production branch (main, master, release/\*).

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
