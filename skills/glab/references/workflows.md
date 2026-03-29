# glab Workflows

Step-by-step flows for common GitLab operations.

---

## Create an MR

`--fill` pulls title and description from your commit messages — always use it rather than writing MR descriptions from scratch.

```bash
git push -u origin HEAD
glab mr create --fill
```

Common variations:

```bash
glab mr create --fill --draft                          # Not ready for review yet
glab mr create --fill --target-branch develop          # Target a specific branch
glab mr create --fill --reviewer @alice --label bug    # Add reviewer + label
glab mr create --fill --squash-message-on-merge        # Squash when merged
glab mr create --title "feat: add X" --description "..." # Manual title/body
```

If `--fill` produces a blank title (no commits or WIP message), add `--title 'feat: …'` to override.

---

## Check CI/CD

Before merging, verify the pipeline passed. `glab ci view` opens an interactive TUI where you can navigate jobs and read logs.

```bash
glab ci status              # Quick one-line status
glab ci view                # Interactive TUI (navigate jobs, view logs, retry)
```

---

## Debug CI

When a job fails, trace its log in real time or download artifacts for local inspection.

```bash
glab ci trace <job-id>      # Stream job log in real time
glab ci retry <job-id>      # Retry a specific failed job
glab job artifact <job-id>  # Download job artifacts
glab ci lint                # Validate .gitlab-ci.yml before pushing
```

Common flow:

```bash
glab ci status                    # See which job failed
glab ci trace <failed-job-id>     # Read the log
# Fix locally, push, then:
glab ci run                       # Trigger a new pipeline on the current branch
```

---

## Review an MR

Check out the code locally, read it, then leave your verdict.

```bash
glab mr checkout <id>                      # Get the code
glab mr diff <id>                          # See the changes
glab mr approve <id>                       # Approve
glab mr note <id> -m "Needs changes: ..."  # Leave feedback
```

---

## Merge an MR

Pick the merge strategy that matches the project's convention. Squash is the most common for GitLab projects.

```bash
glab mr merge <id> --squash                          # Squash (most common)
glab mr merge <id> --when-pipeline-succeeds          # Auto-merge when CI passes
glab mr merge <id> --squash --when-pipeline-succeeds # Both
glab mr rebase <id>                                  # Rebase before merging
```

- **Squash** — one commit per MR on the target branch. Clean log.
- **`--when-pipeline-succeeds`** — set-and-forget; combine with `--squash` for the most common flow.
- **Rebase first** — when the MR has conflicts or needs to be up-to-date.

---

## Work with Issues

```bash
glab issue create --title "Bug: X" --description "Details" --label bug
glab issue list --assignee=@me         # What's on my plate
glab issue view <id>                   # Read the details
glab issue close <id>                  # Done
glab issue board view                  # View the project board
```

---

## CI/CD Config

Manage variables and schedules without touching the GitLab UI.

```bash
# Variables
glab variable list
printf '%s' "$MY_SECRET" | glab variable set API_KEY  # pipe secrets — never pass as args
glab variable get API_KEY

# Schedules
glab schedule list
glab schedule create              # Interactive
glab schedule run <id>            # Trigger a schedule now
```

---

## Make a Release

```bash
glab release create v1.0.0 --notes "Release notes"
glab release create v1.0.0 --notes-file CHANGELOG.md  # From file
glab release upload v1.0.0 ./path/to/artifact          # Attach assets
```

---

## Stacked Diffs _(experimental — requires glab v1.45+)_

Break large features into small, reviewable MRs that build on each other.

```bash
glab stack create my-feature    # Start a new stack
# ... make changes, commit ...
glab stack save                 # Save current changes as a stack entry
glab stack sync                 # Push all entries and create/update MRs
glab stack list                 # See all entries
glab stack next / glab stack prev  # Navigate between entries
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

**Known limitation:** `glab api` does not support multipart file uploads (e.g. attaching images to MR comments). Use `curl` instead:

```bash
# ⚠️ Token visible in process lists — use only on single-user machines or CI with masked vars
curl --request POST \
  --header "PRIVATE-TOKEN: $(glab config get token --host gitlab.com)" \
  --form "file=@/path/to/image.png" \
  "https://gitlab.com/api/v4/projects/<url-encoded-path>/uploads"
# Replace <url-encoded-path> with the literal URL-encoded path — never interpolate unsanitized user input.
```
