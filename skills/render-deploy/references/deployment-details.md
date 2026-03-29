# Deployment Details

Use this reference for service discovery, configuration patterns, quick commands, and common issues.

## Service Discovery

**List all services:**

```bash
render services --output json
```

Returns all services with IDs, names, types, and status.

**Get specific service details:**

```bash
render services --output json  # Find the service ID, then:
render deploys list <SERVICE_ID> --output json
```

**PostgreSQL databases and Key-Value stores:** View and manage these on the Render Dashboard — the CLI does not support listing or managing databases and Key-Value stores directly.

```
https://dashboard.render.com
```

## Configuration Details

### Environment Variables

**All environment variables must be declared in render.yaml.**

**Three patterns for environment variables:**

1. **Hardcoded values** (non-sensitive configuration):

```yaml
envVars:
  - key: NODE_ENV
    value: production
  - key: API_URL
    value: https://api.example.com
```

2. **Database connections** (auto-generated):

```yaml
envVars:
  - key: DATABASE_URL
    fromDatabase:
      name: postgres
      property: connectionString
  - key: REDIS_URL
    fromDatabase:
      name: redis
      property: connectionString
```

3. **Secrets** (user fills in Dashboard):

```yaml
envVars:
  - key: JWT_SECRET
    sync: false
  - key: API_KEY
    sync: false
  - key: STRIPE_SECRET_KEY
    sync: false
```

Complete environment variable guide: [configuration-guide.md](configuration-guide.md)

### Port Binding

**CRITICAL:** Web services must bind to `0.0.0.0:$PORT` (NOT `localhost`). Render sets the `PORT` environment variable.

**Node.js Example:**

```javascript
const PORT = process.env.PORT || 3000
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`)
})
```

**Python Example:**

```python
import os

port = int(os.environ.get('PORT', 5000))
app.run(host='0.0.0.0', port=port)
```

**Go Example:**

```go
port := os.Getenv("PORT")
if port == "" {
    port = "3000"
}
http.ListenAndServe(":"+port, handler)
```

### Plan Defaults

**Use `plan: free` unless the user specifies otherwise.** Refer to Render pricing for current limits and capacity.

### Build Commands

**Use non-interactive flags to prevent build hangs:**

- npm: `npm ci`
- yarn: `yarn install --frozen-lockfile`
- pnpm: `pnpm install --frozen-lockfile`
- bun: `bun install --frozen-lockfile`
- pip: `pip install -r requirements.txt`
- uv: `uv sync`
- apt: `apt-get install -y <package>`
- bundler: `bundle install --jobs=4 --retry=3`

### Database Connections

When services connect to databases in the same Render account, use `fromDatabase` references for internal URLs.

### Health Checks

Optional but recommended: add a `/health` endpoint for faster deployment detection.

## Quick Reference

### CLI Commands

```bash
# Validate Blueprint
render blueprints validate

# Check workspace
render workspace current
render workspaces --output json
render workspace set <WORKSPACE_ID>

# Authentication
render whoami -o json
render login

# List services
render services --output json

# Create a service
render services create --name <name> --type web_service --repo <url> --runtime node \
  --build-command "npm ci" --start-command "npm start" --plan free --output json

# Update environment variables
render services update <SERVICE_ID> --env-var KEY=VALUE --output json --confirm

# Check deploy status
render deploys list <SERVICE_ID> --output json

# View logs
render logs -r <SERVICE_ID> --level error --output json

# Trigger a new deployment
render deploys create <SERVICE_ID> --wait
```

**Note:** Databases (Postgres, Redis/Key-Value) and metrics are not available via the CLI. Use the Blueprint method or the Render Dashboard for those resources.

### Templates by Framework

- Node.js Express: [../assets/node-express.yaml](../assets/node-express.yaml)
- Next.js + Postgres: [../assets/nextjs-postgres.yaml](../assets/nextjs-postgres.yaml)
- Django + Worker: [../assets/python-django.yaml](../assets/python-django.yaml)
- Static Site: [../assets/static-site.yaml](../assets/static-site.yaml)
- Go API: [../assets/go-api.yaml](../assets/go-api.yaml)
- Docker: [../assets/docker.yaml](../assets/docker.yaml)

### Documentation

- Full Blueprint specification: [blueprint-spec.md](blueprint-spec.md)
- Service types explained: [service-types.md](service-types.md)
- Runtime options: [runtimes.md](runtimes.md)
- Configuration guide: [configuration-guide.md](configuration-guide.md)

## Common Issues

**Issue:** Deployment fails with port binding error

**Solution:** Ensure app binds to `0.0.0.0:$PORT` (see Port Binding section above)

---

**Issue:** Build hangs or times out

**Solution:** Use non-interactive build commands (see Build Commands section above)

---

**Issue:** Missing environment variables in Dashboard

**Solution:** All env vars must be declared in render.yaml. Add missing vars with `sync: false` for secrets.

---

**Issue:** Database connection fails

**Solution:** Use `fromDatabase` references for internal connection strings.

---

**Issue:** Static site shows 404 for routes

**Solution:** Add rewrite rules to render.yaml for SPA routing:

```yaml
routes:
  - type: rewrite
    source: /*
    destination: /index.html
```

For more detailed troubleshooting, see the debug skill or [configuration-guide.md](configuration-guide.md).
