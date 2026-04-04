---
name: render-deploy
description: Deploy applications to Render. Use when the user wants to deploy, host, publish, or set up their application on Render's cloud platform.
---

# Deploy to Render

Analyze the codebase, select the right service type, and produce a working deployment on Render's cloud platform.

Render supports **Git-backed** services and **prebuilt Docker image** services.

Use one of these **Git-backed** deployment flows:

1. **Blueprint Method** — Generate render.yaml for Infrastructure-as-Code deployments
2. **Direct CLI Creation** — Create services instantly via `render services create`

Blueprints can also run a **prebuilt Docker image** by using `runtime: image`, but the `render.yaml` still must live in a Git repo.

If there is no Git remote, stop and ask the user to either:

- Create/push a Git remote (can be minimal if only the Blueprint is needed), or
- Use the Render Dashboard/API to deploy a prebuilt Docker image (the CLI cannot create image-backed services).

## Prerequisites

Verify these requirements before proceeding.

**1. Confirm Git remote**

The repo must be pushed to GitHub, GitLab, or Bitbucket:

```bash
git remote -v
```

If no remote exists, stop and ask the user to create/push a remote **or** switch to Docker image deploy.

**2. Install the Render CLI**

```bash
render --version
```

If not installed:

- macOS: `brew install render`
- Linux/macOS: See https://render.com/docs/cli for official installation instructions.

> ⚠️ **Security:** Piping to shell (`curl | sh`) executes remote code. Use `brew install render` or review the script before running.

**3. Authenticate**

```bash
render whoami -o json
```

If the command fails or returns empty data, authenticate using one of:

- **API Key**: `export RENDER_API_KEY="rnd_xxxxx"` (Get from https://dashboard.render.com/u/*/settings#api-keys)
- **Login**: `render login` (opens browser for OAuth)

> **Note:** Database creation and metrics queries require `RENDER_API_KEY`.

**4. Check workspace context**

```bash
render workspace current
```

To list available workspaces: `render workspaces --output json`  
To switch: `render workspace set <WORKSPACE_ID>`

## Choosing the Right Command

Analyze the codebase first; ask only if deployment intent is unclear.

| Goal / Situation                                                                 | Use                     |
| -------------------------------------------------------------------------------- | ----------------------- |
| Single service, no workers, cron, or datastores, simple env vars only            | Direct CLI Creation     |
| Multiple services, databases, Redis/Key Value, cron jobs, or workers             | Blueprint               |
| Want reproducible IaC committed to the repo                                      | Blueprint               |
| Monorepo or multi-environment setup                                              | Blueprint               |
| Prebuilt Docker image (no build step needed)                                     | Blueprint (`runtime: image`) or Dashboard |
| Unsure                                                                           | Blueprint (safer default) |

Load `references/direct-creation.md` for Direct CLI Creation steps.  
Load `references/blueprint-workflow.md` for Blueprint steps.

## Rules

**Before starting**

- Ask two questions before deep analysis: (1) Is the source a Git repo or a prebuilt Docker image? (2) Does the app need a database, background worker, or cache?
- For prebuilt Docker images: guide to Dashboard image deploy or add a minimal Git remote with `runtime: image`. Ask for image URL, registry auth (if private), service type, and port. The CLI cannot create image-backed services.
- For Git repos: verify the remote is pushed to GitHub, GitLab, or Bitbucket before proceeding.
- If no Git remote exists, stop — do not attempt to deploy until the remote is confirmed or the user switches to Docker image deploy.

**Blueprint rules**

- Always use `plan: free` unless the user specifies otherwise.
- Include ALL environment variables the app needs.
- Mark secrets with `sync: false` — the user fills these in the Dashboard.
- Ensure `render.yaml` is committed and pushed before sending the Dashboard deeplink — Render reads the file from the repository at deploy time.

**Post-deploy verification (all methods)**

1. Confirm the latest deploy status is `live` and serving traffic.
2. Hit the health endpoint (or root) and verify a 200 response.
3. Scan recent error logs for a clear failure signature.
4. Verify required env vars and port binding (`0.0.0.0:$PORT`).

## Output Format

Output the complete render.yaml as a single fenced YAML code block. Add brief inline comments for fields requiring user action.

```yaml
services:
  - type: web
    name: my-app
    runtime: node
    plan: free
    buildCommand: npm ci
    startCommand: npm start
    envVars:
      - key: DATABASE_URL
        fromDatabase:
          name: postgres
          property: connectionString
      - key: JWT_SECRET
        sync: false # User fills in Dashboard

databases:
  - name: postgres
    databaseName: myapp_db
    plan: free
```

## Error Recovery

If deployment fails, load `references/troubleshooting-basics.md` for diagnostic steps and `references/error-patterns.md` for the error catalog.

## References

Load these files when the described situation applies:

- `references/blueprint-workflow.md` — full step-by-step Blueprint deployment workflow (CLI install, auth, workspace setup, render.yaml generation, deeplink, verification)
- `references/direct-creation.md` — Direct CLI Creation steps for single-service deployments
- `references/post-deploy-checks.md` — detailed post-deploy verification checklist
- `references/troubleshooting-basics.md` — diagnostic steps when health checks fail
- `references/error-patterns.md` — catalog of known deployment errors and fixes
- `references/blueprint-spec.md` — full render.yaml field reference
- `references/codebase-analysis.md` — checklists for framework/runtime detection
- `references/service-types.md` — service type details and selection guidance
- `references/runtimes.md` — runtime options and configuration
- `references/configuration-guide.md` — configuration validation and common mistakes
- `references/render-api.md` — REST API commands for metrics, database operations, and advanced queries
