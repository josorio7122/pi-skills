# Direct Creation (CLI) Details

Use this reference for Render CLI direct-creation commands and follow-on configuration.

## Direct Creation Workflow

### Step 1: Analyze Codebase

Use [codebase-analysis.md](codebase-analysis.md) to determine runtime, build/start commands, env vars, and datastores.

### Step 2: Create Resources via CLI

**Create a Web Service:**

```bash
render services create \
  --name my-api \
  --type web_service \
  --repo https://github.com/username/repo \
  --runtime node \
  --build-command "npm ci" \
  --start-command "npm start" \
  --plan free \
  --region oregon \
  --env-var NODE_ENV=production \
  --output json
```

Valid runtimes: `node`, `python`, `go`, `rust`, `ruby`, `elixir`, `docker`
Valid plans: `free`, `starter`, `standard`, `pro`, `pro_max`, `pro_plus`, `pro_ultra`
Valid regions: `oregon`, `frankfurt`, `singapore`, `ohio`, `virginia`

Pass `--env-var KEY=VALUE` multiple times to set multiple variables at creation.

**Create a Static Site:**

```bash
render services create \
  --name my-frontend \
  --type static_site \
  --repo https://github.com/username/repo \
  --build-command "npm run build" \
  --publish-directory dist \
  --env-var VITE_API_URL=https://api.example.com \
  --output json
```

Common publish directories: `dist`, `build`, `public`, `out`

**Create a Cron Job:**

```bash
render services create \
  --name daily-cleanup \
  --type cron_job \
  --repo https://github.com/username/repo \
  --runtime node \
  --cron-schedule "0 0 * * *" \
  --cron-command "node scripts/cleanup.js" \
  --plan free \
  --output json
```

**Create a PostgreSQL Database:**

> The Render CLI cannot create databases. Use the REST API instead — see `references/render-api.md` for the exact `curl` command.

**Create a Key-Value Store (Redis):**

> The Render CLI cannot create Key-Value stores. Use the REST API instead — see `references/render-api.md` for the exact `curl` command.

For apps that need a database or cache, use the Blueprint method instead so all resources are
provisioned together.

### Step 3: Configure Environment Variables

After creating a service, update environment variables:

```bash
render services update <SERVICE_ID> \
  --env-var DATABASE_URL=<connection-string> \
  --env-var JWT_SECRET=<secret-value> \
  --env-var API_KEY=<api-key> \
  --output json \
  --confirm
```

Pass `--env-var KEY=VALUE` multiple times for multiple variables.

`<SERVICE_ID>` is returned in the JSON output of `render services create`. You can also retrieve it
with:

```bash
render services --output json
```

**Note:** For database connection strings, copy the internal URL from the Render Dashboard service
detail page.

### Step 4: Verify Deployment

Services deploy automatically when created.

**Check deployment status:**

```bash
render deploys list <SERVICE_ID> --output json
```

Look for `"status": "live"` in the most recent deploy object.

**Monitor logs for errors:**

```bash
render logs -r <SERVICE_ID> --level error --output json
```

**Check health metrics:**

> Metrics (CPU, memory, request count) are available via the REST API. See `references/render-api.md` for `curl` commands.
