# Blueprint Deployment Workflow

Full step-by-step workflow for Method 1 (Blueprint) deployments.

---

## Prerequisites Check

Verify these requirements in order before proceeding.

### 1. Confirm Git Remote

The repo must be pushed to GitHub, GitLab, or Bitbucket.

```bash
git remote -v
```

If no remote exists, stop and ask the user to create/push a remote **or** switch to Docker image deploy.

### 2. Check Render CLI Installation

```bash
render --version
```

If not installed, offer to install:

- macOS: `brew install render`

> ⚠️ **Security:** Piping to shell (`curl | sh`) executes remote code. Review the script at the URL before running, or use `brew install render` instead.

- Linux/macOS: `curl -fsSL https://raw.githubusercontent.com/render-oss/cli/main/bin/install.sh | sh`

### 3. Check Authentication

```bash
render whoami -o json
```

If `render whoami` fails or returns empty data, prompt the user to authenticate:

- **API Key**: `export RENDER_API_KEY="rnd_xxxxx"` (Get from https://dashboard.render.com/u/*/settings#api-keys)
- **Login**: `render login` (Opens browser for OAuth)

> **Note:** Database creation and metrics queries require `RENDER_API_KEY`. See `references/render-api.md` for REST API commands.

### 4. Check Workspace Context

```bash
render workspace current
```

To list available workspaces:

```bash
render workspaces --output json
```

To switch workspaces:

```bash
render workspace set <WORKSPACE_ID>
```

> **Note:** Deployments may take a few minutes. Use appropriate timeout values when waiting for builds and health checks to complete.

---

## Step 1: Analyze Codebase

Analyze the codebase to determine framework/runtime, build and start commands, required env vars, datastores, and port binding. Use the detailed checklists in [codebase-analysis.md](codebase-analysis.md).

---

## Step 2: Generate render.yaml

Create a `render.yaml` Blueprint file following the Blueprint specification.

Complete specification: [blueprint-spec.md](blueprint-spec.md)

**Key Points:**

- Always use `plan: free` unless user specifies otherwise
- Include ALL environment variables the app needs
- Mark secrets with `sync: false` (user fills these in Dashboard)
- Use appropriate service type and runtime

**Service Types:**

- `web`: HTTP services, APIs, web applications (publicly accessible)
- `worker`: Background job processors (not publicly accessible)
- `cron`: Scheduled tasks that run on a cron schedule
- `web` + `runtime: static`: Static sites (HTML/CSS/JS served via CDN)
- `pserv`: Private services (internal only, within same account)

Service type details: [service-types.md](service-types.md)
Runtime options: [runtimes.md](runtimes.md)
Template examples: [../assets/](../assets/)

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

---

## Step 3: Immediate Next Steps Checklist

After creating `render.yaml`, give the user this checklist and run validation when the CLI is available:

1. **Authenticate (CLI)**: run `render whoami -o json` (if not logged in, run `render login` or set `RENDER_API_KEY`)
2. **Validate (recommended)**: run `render blueprints validate`
3. **Commit + push**: `git add render.yaml && git commit -m "Add Render deployment configuration" && git push origin main`
4. **Open Dashboard**: Use the Blueprint deeplink and complete Git OAuth if prompted
5. **Fill secrets**: Set env vars marked `sync: false`
6. **Deploy**: Click "Apply" and monitor the deploy

---

## Step 4: Validate Configuration

```bash
render whoami -o json
render blueprints validate
```

Fix any validation errors before proceeding. Common issues:

- Missing required fields (`name`, `type`, `runtime`)
- Invalid runtime values
- Incorrect YAML syntax
- Invalid environment variable references

Configuration guide: [configuration-guide.md](configuration-guide.md)

---

## Step 5: Commit and Push

**IMPORTANT:** Merge the `render.yaml` into your repository before deploying.

```bash
git add render.yaml
git commit -m "Add Render deployment configuration"
git push origin main
```

If there is no Git remote yet, stop and guide the user to create a GitHub/GitLab/Bitbucket repo, add it as `origin`, and push before continuing.

**Why this matters:** The Dashboard deeplink reads `render.yaml` from the repository. If it isn't pushed, Render won't find the configuration and deployment will fail.

---

## Step 6: Generate Deeplink

Get the Git repository URL:

```bash
git remote get-url origin
```

**If the URL is SSH format, convert it to HTTPS:**

| SSH Format                        | HTTPS Format                      |
| --------------------------------- | --------------------------------- |
| `git@github.com:user/repo.git`    | `https://github.com/user/repo`    |
| `git@gitlab.com:user/repo.git`    | `https://gitlab.com/user/repo`    |
| `git@bitbucket.org:user/repo.git` | `https://bitbucket.org/user/repo` |

Format the Dashboard deeplink:

```
https://dashboard.render.com/blueprint/new?repo=<HTTPS_REPOSITORY_URL>
```

Example:

```
https://dashboard.render.com/blueprint/new?repo=https://github.com/username/repo-name
```

---

## Step 7: Guide User

**CRITICAL:** Ensure `render.yaml` is merged and pushed before clicking the deeplink.

Provide the deeplink with these instructions:

1. **Verify render.yaml is merged** — confirm it exists in your remote repository
2. Click the deeplink to open Render Dashboard
3. Complete Git provider OAuth if prompted
4. Name the Blueprint (or use default from render.yaml)
5. Fill in secret environment variables (marked with `sync: false`)
6. Review services and databases configuration
7. Click "Apply" to deploy

---

## Step 8: Verify Deployment

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

> Metrics (CPU, memory, request count) are available via the REST API. See [render-api.md](render-api.md) for `curl` commands.

If errors are found, proceed to [troubleshooting-basics.md](troubleshooting-basics.md).
