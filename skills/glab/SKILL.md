---
name: glab
description: Interact with GitLab from the command line using the glab CLI. Use when working with merge requests, issues, CI/CD pipelines and jobs, variables, schedules, releases, stacked diffs, repository management, or GitLab API calls. Also use when the user says "open an MR," "create an issue," "check the pipeline," "merge this," "retrigger CI," "deploy," or any GitLab-related task — even if they don't mention glab explicitly. Requires glab CLI installed and authenticated.
compatibility: "Requires glab CLI installed (brew install glab) and authenticated (glab auth login)"
metadata:
  author: josorio7122
  version: "3.0"
---

# GitLab CLI (glab)

Work with GitLab repositories, merge requests, issues, CI/CD pipelines, and more from the command line.

## Prerequisites

```bash
glab --version    # Must be installed
glab auth status  # Must be authenticated
```

If not authenticated:

```bash
glab auth login                           # Interactive (browser OAuth — recommended)
glab auth login --token <pat>             # With personal access token
glab auth login --hostname gitlab.example.com # Self-hosted instance
```

---

## Choosing the Right Command

| You need to...                              | Start here                            |
| ------------------------------------------- | ------------------------------------- |
| Push your work and get it reviewed           | [Create an MR](#create-an-mr)         |
| Check if the pipeline passed                 | [Check CI/CD](#check-cicd)            |
| Review someone else's MR                     | [Review an MR](#review-an-mr)         |
| Ship an MR to the target branch              | [Merge an MR](#merge-an-mr)           |
| Track or report a bug/feature                | [Work with Issues](#work-with-issues) |
| Debug a failed job or retrigger CI           | [Debug CI](#debug-ci)                 |
| Manage CI/CD variables or schedules          | [CI/CD Config](#cicd-config)          |
| Cut a new version                            | [Make a Release](#make-a-release)     |
| Break a large feature into stacked MRs       | [Stacked Diffs](#stacked-diffs)       |
| Do something glab doesn't have a command for | [Use the API](#use-the-api)           |

---

## Workflows

These are the sequences you'll use most. Each one is a complete flow — follow it top to bottom.

### Create an MR

The most common operation. `--fill` pulls title and description from your commit messages — always use it rather than writing MR descriptions from scratch.

```bash
git push -u origin HEAD
glab mr create --fill
```

Common variations:

```bash
glab mr create --fill --draft                         # Not ready for review yet
glab mr create --fill --target-branch develop         # Target a specific branch
glab mr create --fill --reviewer @alice --label bug   # Add reviewer + label
glab mr create --fill --squash-message-on-merge       # Squash when merged
glab mr create --title "feat: add X" --description "..." # Manual title/body
```

### Check CI/CD

Before merging, verify the pipeline passed. `glab ci view` opens an interactive TUI where you can navigate jobs and read logs — it's the fastest way to understand pipeline state.

```bash
glab ci status              # Quick one-line status
glab ci view                # Interactive TUI (navigate jobs, view logs, retry)
```

### Debug CI

When a job fails, trace its log in real time or download artifacts for local inspection.

```bash
glab ci trace <job-id>      # Stream job log in real time
glab ci retry <job-id>      # Retry a specific failed job
glab job artifact <job-id>  # Download job artifacts
glab ci lint                # Validate .gitlab-ci.yml before pushing
```

A common debugging flow:

```bash
glab ci status                    # See which job failed
glab ci trace <failed-job-id>     # Read the log
# Fix the issue locally, push, then:
glab ci run                       # Trigger a new pipeline on the current branch
```

### Review an MR

Check out the code locally, read it, then leave your verdict.

```bash
glab mr checkout <id>       # Get the code
glab mr diff <id>           # See the changes
glab mr approve <id>        # Approve
glab mr note <id> -m "Needs changes: ..."  # Leave feedback
```

### Merge an MR

Pick the merge strategy that matches the project's convention. Squash is the most common for GitLab projects.

```bash
glab mr merge <id> --squash                     # Squash (most common)
glab mr merge <id> --when-pipeline-succeeds      # Auto-merge when CI passes
glab mr merge <id> --squash --when-pipeline-succeeds # Both
glab mr rebase <id>                              # Rebase before merging
```

**When to use which:**
- **Squash** — default for most projects. One commit per MR on the target branch. Clean log.
- **`--when-pipeline-succeeds`** — set-and-forget. GitLab merges automatically when CI goes green. Combine with `--squash` for the most common flow.
- **Rebase first** — when the MR has conflicts or needs to be up-to-date. Run `glab mr rebase` before merging.

### Work with Issues

```bash
glab issue create --title "Bug: X" --description "Details" --label bug
glab issue list --assignee=@me         # What's on my plate
glab issue view <id>                   # Read the details
glab issue close <id>                  # Done
glab issue board view                  # View the project board
```

### CI/CD Config

Manage variables and schedules without touching the GitLab UI.

```bash
# Variables
glab variable list
glab variable set API_KEY "secret-value"
glab variable get API_KEY

# Schedules
glab schedule list
glab schedule create              # Interactive
glab schedule run <id>            # Trigger a schedule now
```

### Make a Release

```bash
glab release create v1.0.0 --notes "Release notes"
glab release create v1.0.0 --notes-file CHANGELOG.md  # From file
glab release upload v1.0.0 ./path/to/artifact          # Attach assets
```

### Stacked Diffs

Break large features into small, reviewable MRs that build on each other. Each "entry" in a stack becomes a separate MR, all chained together.

```bash
glab stack create my-feature    # Start a new stack
# ... make changes, commit ...
glab stack save                 # Save current changes as a stack entry
# ... make more changes ...
glab stack save                 # Another entry
glab stack sync                 # Push all entries and create/update MRs
glab stack list                 # See all entries
glab stack next / glab stack prev # Navigate between entries
```

---

## Use the API

`glab api` is your escape hatch for anything glab doesn't have a built-in command for. It handles auth, pagination, and supports both REST and GraphQL. Placeholder values like `:fullpath` are auto-resolved from the current git directory.

```bash
# REST
glab api projects/:fullpath/members
glab api projects/:fullpath/issues --field "title=Bug" --field "description=Details"
glab api projects/:fullpath/merge_requests --paginate

# Efficient pagination for large datasets
glab api issues --paginate --output ndjson | jq 'select(.state == "opened")'

# GraphQL
glab api graphql -f query='{ currentUser { username } }'
```

---

## Tips

- **`--fill`** auto-populates MR title/description from commit messages — always use it
- **`--web`** opens any resource in the browser — `glab mr view <id> --web`
- **`glab ci view`** is interactive — navigate jobs, read logs, retry from the TUI
- **`glab ci lint`** validates your `.gitlab-ci.yml` before you push — catches syntax errors early
- **`--repo` / `-R`** targets a different project — accepts `OWNER/REPO`, full URL, or Git URL
- **`--when-pipeline-succeeds`** auto-merges when CI passes — set it and move on
- **Aliases:** `glab ci` = `glab pipe`, `glab repo` = `glab project`, `glab variable` = `glab var`
- Most commands infer the project from git remotes — no need to specify `--repo` unless you're working cross-project

---

## Reference

For the complete command table (every MR, issue, CI/CD, repo, release, token, stacked diff, label, snippet, SSH key, secure file, and config command), see [references/commands.md](references/commands.md).
