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

**PostgreSQL databases and Key-Value stores:** The CLI does not support database or Key-Value operations. Use the REST API — see [render-api.md](render-api.md) for `curl` commands.

## Configuration Details

### Environment Variables

For environment variable patterns and port binding examples, see [configuration-guide.md](configuration-guide.md).

### Port Binding

For environment variable patterns and port binding examples, see [configuration-guide.md](configuration-guide.md).

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

**Note:** Databases (Postgres, Redis/Key-Value) and metrics are not available via the CLI. Use the REST API for these — see [render-api.md](render-api.md).

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

For more detailed troubleshooting, see [troubleshooting-basics.md](troubleshooting-basics.md).
