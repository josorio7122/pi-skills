---
name: render-deploy
description: Deploy applications to Render by analyzing codebases, generating render.yaml Blueprints, and providing Dashboard deeplinks. Use when the user wants to deploy, host, publish, or set up their application on Render's cloud platform, including databases, cron jobs, and background workers.
metadata:
  author: josorio7122
  version: '1.0'
---

# Deploy to Render

Render supports **Git-backed** services and **prebuilt Docker image** services.

Use one of these **Git-backed** deployment flows:

1. **Blueprint Method** - Generate render.yaml for Infrastructure-as-Code deployments
2. **Direct CLI Creation** - Create services instantly via `render services create`

Blueprints can also run a **prebuilt Docker image** by using `runtime: image`, but the `render.yaml` still must live in a Git repo.

If there is no Git remote, stop and ask the user to either:

- Create/push a Git remote (can be minimal if only the Blueprint is needed), or
- Use the Render Dashboard/API to deploy a prebuilt Docker image (the CLI cannot create image-backed services).

## Happy Path (New Users)

Use this short prompt sequence before deep analysis to reduce friction:

1. Ask whether they want to deploy from a Git repo or a prebuilt Docker image.
2. Ask whether Render should provision everything the app needs (based on what seems likely from the user's description) or only the app while they bring their own infra. If dependencies are unclear, ask a short follow-up to confirm whether they need a database, workers, cron, or other services.

Then proceed with the appropriate method below.

## Choose Your Source Path

**Git Repo Path:** Required for both Blueprint and Direct CLI Creation. The repo must be pushed to GitHub, GitLab, or Bitbucket.

**Prebuilt Docker Image Path:** Supported by Render via image-backed services. The CLI cannot create image-backed services; use the Dashboard/API. Ask for:

- Image URL (registry + tag)
- Registry auth (if private)
- Service type (web/worker) and port

If the user chooses a Docker image, guide them to the Render Dashboard image deploy flow or ask them to add a Git remote (so you can use a Blueprint with `runtime: image`).

## Choose Your Deployment Method (Git Repo)

Both methods require a Git repository pushed to GitHub, GitLab, or Bitbucket. (If using `runtime: image`, the repo can be minimal and only contain `render.yaml`.)

| Method                  | Best For                           | Pros                                                      |
| ----------------------- | ---------------------------------- | --------------------------------------------------------- |
| **Blueprint**           | Multi-service apps, IaC workflows  | Version controlled, reproducible, supports complex setups |
| **Direct CLI Creation** | Single services, quick deployments | Instant creation, no render.yaml file needed              |

### Method Selection Heuristic

Use this decision rule by default unless the user requests a specific method. Analyze the codebase first; only ask if deployment intent is unclear (e.g., DB, workers, cron).

**Use Direct CLI Creation when ALL are true:**

- Single service (one web app or one static site)
- No separate worker/cron services
- No attached databases or Key Value
- Simple env vars only (no shared env groups)

**Use Blueprint when ANY are true:**

- Multiple services (web + worker, API + frontend, etc.)
- Databases, Redis/Key Value, or other datastores are required
- Cron jobs, background workers, or private services
- You want reproducible IaC or a render.yaml committed to the repo
- Monorepo or multi-env setup that needs consistent configuration

If unsure, ask a quick clarifying question, but default to Blueprint for safety.

## Prerequisites Check

When starting a deployment, verify these requirements in order:

**1. Confirm Source Path (Git vs Docker)**

If using Git-based methods (Blueprint or Direct CLI Creation), the repo must be pushed to GitHub/GitLab/Bitbucket. Blueprints that reference a prebuilt image still require a Git repo with `render.yaml`.

```bash
git remote -v
```

- If no remote exists, stop and ask the user to create/push a remote **or** switch to Docker image deploy.

**2. Check Render CLI Installation**

```bash
render --version
```

If not installed, offer to install:

- macOS: `brew install render`

> ⚠️ **Security:** Piping to shell (`curl | sh`) executes remote code. Review the script at the URL before running, or use `brew install render` instead.

- Linux/macOS: `curl -fsSL https://raw.githubusercontent.com/render-oss/cli/main/bin/install.sh | sh`

**3. Check Authentication**

```bash
render whoami -o json
```

If `render whoami` fails or returns empty data, the CLI is not authenticated. Prompt the user to authenticate:

- **API Key**: `export RENDER_API_KEY="rnd_xxxxx"` (Get from https://dashboard.render.com/u/*/settings#api-keys)
- **Login**: `render login` (Opens browser for OAuth)

> **Note:** Database creation and metrics queries require `RENDER_API_KEY` environment variable. See `references/render-api.md` for REST API commands.

**4. Check Workspace Context**

Verify the active workspace:

```bash
render workspace current
```

To list available workspaces:

```bash
render workspaces --output json
```

If the user needs to switch workspaces:

```bash
render workspace set <WORKSPACE_ID>
```

> **Note:** Deployments may take a few minutes. Use appropriate timeout values when waiting for builds and health checks to complete.

Once prerequisites are met, proceed with deployment workflow.

---

# Method 1: Blueprint Deployment (Recommended for Complex Apps)

## Blueprint Workflow

### Step 1: Analyze Codebase

Analyze the codebase to determine framework/runtime, build and start commands, required env vars, datastores, and port binding. Use the detailed checklists in [references/codebase-analysis.md](references/codebase-analysis.md).

### Step 2: Generate render.yaml

Create a `render.yaml` Blueprint file following the Blueprint specification.

Complete specification: [references/blueprint-spec.md](references/blueprint-spec.md)

**Key Points:**

- Always use `plan: free` unless user specifies otherwise
- Include ALL environment variables the app needs
- Mark secrets with `sync: false` (user fills these in Dashboard)
- Use appropriate service type: `web`, `worker`, `cron`, `static`, or `pserv`
- Use appropriate runtime: [references/runtimes.md](references/runtimes.md)

**Basic Structure:**

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

**Service Types:**

- `web`: HTTP services, APIs, web applications (publicly accessible)
- `worker`: Background job processors (not publicly accessible)
- `cron`: Scheduled tasks that run on a cron schedule
- `static`: Static sites (HTML/CSS/JS served via CDN)
- `pserv`: Private services (internal only, within same account)

Service type details: [references/service-types.md](references/service-types.md)
Runtime options: [references/runtimes.md](references/runtimes.md)
Template examples: [assets/](assets/)

### Step 3: Immediate Next Steps (Always Provide)

After creating `render.yaml`, always give the user a short, explicit checklist and run validation immediately when the CLI is available:

1. **Authenticate (CLI)**: run `render whoami -o json` (if not logged in, run `render login` or set `RENDER_API_KEY`)
2. **Validate (recommended)**: run `render blueprints validate`
   - If the CLI isn't installed, offer to install it and provide the command.
3. **Commit + push**: `git add render.yaml && git commit -m "Add Render deployment configuration" && git push origin main`
4. **Open Dashboard**: Use the Blueprint deeplink and complete Git OAuth if prompted
5. **Fill secrets**: Set env vars marked `sync: false`
6. **Deploy**: Click "Apply" and monitor the deploy

### Step 4: Validate Configuration

Validate the render.yaml file to catch errors before deployment. If the CLI is installed, run the commands directly; only prompt the user if the CLI is missing:

```bash
render whoami -o json  # Ensure CLI is authenticated (won't always prompt)
render blueprints validate
```

Fix any validation errors before proceeding. Common issues:

- Missing required fields (`name`, `type`, `runtime`)
- Invalid runtime values
- Incorrect YAML syntax
- Invalid environment variable references

Configuration guide: [references/configuration-guide.md](references/configuration-guide.md)

### Step 5: Commit and Push

**IMPORTANT:** You must merge the `render.yaml` file into your repository before deploying.

Ensure the `render.yaml` file is committed and pushed to your Git remote:

```bash
git add render.yaml
git commit -m "Add Render deployment configuration"
git push origin main
```

If there is no Git remote yet, stop here and guide the user to create a GitHub/GitLab/Bitbucket repo, add it as `origin`, and push before continuing.

**Why this matters:** The Dashboard deeplink will read the render.yaml from your repository. If the file isn't merged and pushed, Render won't find the configuration and deployment will fail.

Verify the file is in your remote repository before proceeding to the next step.

### Step 6: Generate Deeplink

Get the Git repository URL:

```bash
git remote get-url origin
```

This will return a URL from your Git provider. **If the URL is SSH format, convert it to HTTPS:**

| SSH Format                        | HTTPS Format                      |
| --------------------------------- | --------------------------------- |
| `git@github.com:user/repo.git`    | `https://github.com/user/repo`    |
| `git@gitlab.com:user/repo.git`    | `https://gitlab.com/user/repo`    |
| `git@bitbucket.org:user/repo.git` | `https://bitbucket.org/user/repo` |

**Conversion pattern:** Replace `git@<host>:` with `https://<host>/` and remove `.git` suffix.

Format the Dashboard deeplink using the HTTPS repository URL:

```
https://dashboard.render.com/blueprint/new?repo=<REPOSITORY_URL>
```

Example:

```
https://dashboard.render.com/blueprint/new?repo=https://github.com/username/repo-name
```

### Step 7: Guide User

**CRITICAL:** Ensure the user has merged and pushed the render.yaml file to their repository before clicking the deeplink. If the file isn't in the repository, Render cannot read the Blueprint configuration and deployment will fail.

Provide the deeplink to the user with these instructions:

1. **Verify render.yaml is merged** - Confirm the file exists in your repository on GitHub/GitLab/Bitbucket
2. Click the deeplink to open Render Dashboard
3. Complete Git provider OAuth if prompted
4. Name the Blueprint (or use default from render.yaml)
5. Fill in secret environment variables (marked with `sync: false`)
6. Review services and databases configuration
7. Click "Apply" to deploy

The deployment will begin automatically. Users can monitor progress in the Render Dashboard.

### Step 8: Verify Deployment

After the user deploys via Dashboard, verify everything is working.

**Check deployment status:**

```bash
render deploys list <SERVICE_ID> --output json
```

Look for `"status": "live"` to confirm successful deployment.

**Check for runtime errors (wait 2-3 minutes after deploy):**

```bash
render logs -r <SERVICE_ID> --level error --output json
```

**Check service health metrics:**

> Metrics (CPU, memory, request count) are available via the REST API. See [references/render-api.md](references/render-api.md) for `curl` commands.

If errors are found, proceed to the **Post-deploy verification and basic triage** section below.

---

# Method 2: Direct Service Creation (Quick Single-Service Deployments)

For simple deployments without Infrastructure-as-Code, create services directly via the Render CLI.

## When to Use Direct Creation

- Single web service or static site
- Quick prototypes or demos
- When you don't need a render.yaml file in your repo
- Adding cron jobs to existing projects

## Prerequisites for Direct Creation

**Repository must be pushed to a Git provider.** Render clones your repository to build and deploy services.

```bash
git remote -v  # Verify remote exists
git push origin main  # Ensure code is pushed
```

Supported providers: GitHub, GitLab, Bitbucket

If no remote exists, stop and ask the user to create/push a remote or switch to Docker image deploy.

> **Note:** The CLI cannot create image-backed services. Use the Dashboard/API for prebuilt Docker image deploys.

> **Note:** The CLI cannot create PostgreSQL databases or Key-Value (Redis) stores. Use the Blueprint method or the REST API — see [references/render-api.md](references/render-api.md) for `curl` commands.

## Direct Creation Workflow

Use the concise steps below, and refer to [references/direct-creation.md](references/direct-creation.md) for full CLI command examples and follow-on configuration.

### Step 1: Analyze Codebase

Use [references/codebase-analysis.md](references/codebase-analysis.md) to determine runtime, build/start commands, env vars, and datastores.

### Step 2: Create Resources via CLI

Create the service (web, static, or cron). See [references/direct-creation.md](references/direct-creation.md).

If the CLI returns an error about missing Git credentials or repo access, stop and guide the user to connect their Git provider in the Render Dashboard, then retry.

### Step 3: Configure Environment Variables

Update env vars via CLI after creation. See [references/direct-creation.md](references/direct-creation.md).

Remind the user that secrets can be set in the Dashboard if they prefer not to pass them via the CLI.

### Step 4: Verify Deployment

Check deploy status and logs. See [references/direct-creation.md](references/direct-creation.md).

---

For service discovery, configuration details, quick commands, and common issues, see [references/deployment-details.md](references/deployment-details.md).

---

# Post-deploy verification and basic triage (All Methods)

Keep this short and repeatable. If any check fails, fix it before redeploying.

1. Confirm the latest deploy is `live` and serving traffic
2. Hit the health endpoint (or root) and verify a 200 response
3. Scan recent error logs for a clear failure signature
4. Verify required env vars and port binding (`0.0.0.0:$PORT`)

Detailed checklist and commands: [references/post-deploy-checks.md](references/post-deploy-checks.md)

If the service fails to start or health checks time out, use the basic triage guide:
[references/troubleshooting-basics.md](references/troubleshooting-basics.md)

For a catalog of common error signatures and fixes, see [references/error-patterns.md](references/error-patterns.md).

## Troubleshooting

### Network Access

If deployment fails due to network timeouts or DNS errors, the execution environment may be blocking outbound connections. Ensure the environment allows outbound HTTPS to `api.render.com` and `dashboard.render.com` before retrying.

Example guidance to the user:

```
The deploy needs outbound network access to reach Render's API. If your environment restricts network calls, grant access to `api.render.com` and `dashboard.render.com`, then retry.
```

For deeper diagnostics, check the Render Dashboard logs and metrics.
