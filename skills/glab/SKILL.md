---
name: glab
description: Interact with GitLab from the command line using the glab CLI. Use when working with merge requests, issues, CI/CD pipelines and jobs, variables, schedules, releases, stacked diffs, repository management, or GitLab API calls. Also use when the user says "open an MR," "create an issue," "check the pipeline," "merge this," "retrigger CI," "deploy," or any GitLab-related task — even if they don't mention glab explicitly.
---

# GitLab CLI (glab)

You operate the `glab` CLI for all GitLab tasks. Run `glab auth status` before the first command in any session.

## Prerequisites

Run before the first command in any session:

- `glab --version` — must be installed
- `glab auth status` — must be authenticated

If not authenticated, run `glab auth login` (browser OAuth) or `glab auth login --token <pat>` for a personal access token. For self-hosted: `glab auth login --hostname gitlab.example.com`.

---

## Choosing the Right Command

| Goal                                         | Load                                                       |
| -------------------------------------------- | ---------------------------------------------------------- |
| Push work and get it reviewed                | [workflows.md → Create an MR](references/workflows.md)     |
| Check if pipeline passed                     | [workflows.md → Check CI/CD](references/workflows.md)      |
| Debug a failed job or retrigger CI           | [workflows.md → Debug CI](references/workflows.md)         |
| Review someone else's MR                     | [workflows.md → Review an MR](references/workflows.md)     |
| Ship an MR to the target branch              | [workflows.md → Merge an MR](references/workflows.md)      |
| Track or report a bug/feature                | [workflows.md → Work with Issues](references/workflows.md) |
| Manage CI/CD variables or schedules          | [workflows.md → CI/CD Config](references/workflows.md)     |
| Cut a new version                            | [workflows.md → Make a Release](references/workflows.md)   |
| Break a large feature into stacked MRs       | [workflows.md → Stacked Diffs](references/workflows.md)    |
| Do something glab doesn't have a command for | [workflows.md → Use the API](references/workflows.md)      |
| Look up a specific flag or subcommand        | [references/commands.md](references/commands.md)           |
| Work on a different project                  | Use `--repo owner/repo` with any command                   |

For step-by-step workflows, load [references/workflows.md](references/workflows.md).
For command syntax, load [references/commands.md](references/commands.md).

---

## Destructive Operations

- **Never** pass secret values as CLI arguments — pipe via stdin: `printf '%s' "$SECRET" | glab variable set KEY`
- **`glab mr merge`** is irreversible — confirm the MR ID and target branch before running
- **`glab variable set`** overwrites silently — check existing values with `glab variable list` first

---

## Error Recovery

- **Auth failure / `HTTP 401`** — run `glab auth status`; re-authenticate with `glab auth login`
- **Wrong remote detected** — use `--repo owner/repo` or set `GITLAB_HOST` for self-hosted instances
- **SSH remote but glab expects HTTPS** — `git remote set-url origin https://gitlab.com/owner/repo.git`
- **Pipeline stuck / no CI configured** — verify `.gitlab-ci.yml` exists in the repo
- **Permission denied on merge** — check MR approval rules; you may need approvals first

---

## Output Format

- **Commands run:** show in a fenced code block.
- **CI status:** summarize as job name → status → duration in a table.
- **MR/Issue lists:** bullet list with ID, title, and URL.
- **Errors:** quote the glab error verbatim, then apply Troubleshooting steps.

---

## Known Limitations

- `glab api` does not support multipart file uploads — use `curl` instead (see [workflows.md → Use the API](references/workflows.md))
- Stacked diffs require glab v1.45+
- Aliases: `glab ci` = `glab pipe`, `glab repo` = `glab project`, `glab variable` = `glab var`
