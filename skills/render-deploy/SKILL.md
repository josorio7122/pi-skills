---
name: render-deploy
description: Deploy applications to Render. Use when the user wants to deploy, host, publish, or set up their application on Render's cloud platform.
---

# Deploy to Render

You are the Render deployment agent. Analyze the codebase, select the right service type, and produce a working deployment.

Render supports **Git-backed** services and **prebuilt Docker image** services.

Use one of these **Git-backed** deployment flows:

1. **Blueprint Method** — Generate render.yaml for Infrastructure-as-Code deployments
2. **Direct CLI Creation** — Create services instantly via `render services create`

Blueprints can also run a **prebuilt Docker image** by using `runtime: image`, but the `render.yaml` still must live in a Git repo.

If there is no Git remote, stop and ask the user to either:

- Create/push a Git remote (can be minimal if only the Blueprint is needed), or
- Use the Render Dashboard/API to deploy a prebuilt Docker image (the CLI cannot create image-backed services).

## Happy Path

Ask these questions before deep analysis:

1. **Source:** Git repo or prebuilt Docker image?
   - **Prebuilt Docker image:** Guide to Dashboard image deploy or add a minimal Git remote with `runtime: image`. Ask for image URL, registry auth (if private), service type, and port. The CLI cannot create image-backed services.
   - **Git repo:** Must be pushed to GitHub, GitLab, or Bitbucket. Verify with `git remote -v`.
2. **Complexity:** Does your app need a database, background worker, or cache? (yes / no / not sure)

Then proceed to Method Selection below.

## Method Selection

Analyze the codebase first; only ask if deployment intent is unclear.

| Method                  | Best For                           | Pros                             |
| ----------------------- | ---------------------------------- | -------------------------------- |
| **Blueprint**           | Multi-service apps, IaC workflows  | Version controlled, reproducible |
| **Direct CLI Creation** | Single services, quick deployments | Instant, no render.yaml needed   |

**Use Direct CLI Creation when ALL are true:**

- Single service with no workers, cron, or datastores
- Simple env vars only (no shared env groups)

**Use Blueprint when ANY are true:**

- Multiple services, databases, Redis/Key Value, cron jobs, or workers
- Want reproducible IaC committed to the repo
- Monorepo or multi-env setup

If unsure, default to Blueprint for safety.

## Output Contract

Output the complete render.yaml as a single fenced YAML code block. Add brief inline comments for fields requiring user action.

---

## Method 1: Blueprint Deployment

Load [references/blueprint-workflow.md](references/blueprint-workflow.md) and follow it.

---

## Method 2: Direct Service Creation

For simple single-service deployments without IaC. Load [references/direct-creation.md](references/direct-creation.md) and follow it.

---

## Post-deploy Verification (All Methods)

1. Confirm the latest deploy is `live` and serving traffic
2. Hit the health endpoint (or root) and verify a 200 response
3. Scan recent error logs for a clear failure signature
4. Verify required env vars and port binding (`0.0.0.0:$PORT`)

Detailed checklist: [references/post-deploy-checks.md](references/post-deploy-checks.md)

If health checks fail: [references/troubleshooting-basics.md](references/troubleshooting-basics.md)

Error catalog: [references/error-patterns.md](references/error-patterns.md)

---

## Troubleshooting

If deployment fails, load [references/troubleshooting-basics.md](references/troubleshooting-basics.md) for diagnostic steps.
