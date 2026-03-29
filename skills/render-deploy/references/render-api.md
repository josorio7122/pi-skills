# Render REST API Reference

The Render CLI covers most operations. Use the REST API for capabilities the CLI does not support: database creation, Key-Value store creation, connection string retrieval, and metrics.

## Authentication

All requests require `RENDER_API_KEY` as a Bearer token. Set it in your shell or export it:

```bash
export RENDER_API_KEY="rnd_xxxxx"
```

Get your key from: https://dashboard.render.com/u/*/settings#api-keys

This is the same key used by `render login` / `export RENDER_API_KEY`.

**Base URL:** `https://api.render.com/v1`

**Common headers:**

```bash
-H "Authorization: Bearer $RENDER_API_KEY" \
-H "Content-Type: application/json"
```

## Create PostgreSQL Database

```bash
curl -s -X POST https://api.render.com/v1/postgres \
  -H "Authorization: Bearer $RENDER_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "myapp-db",
    "ownerId": "<OWNER_ID>",
    "plan": "free",
    "region": "oregon",
    "version": "16"
  }'
```

Plans: `free`, `starter`, `standard`, `pro`, `pro_plus`, `pro_max`, `pro_ultra`, `accelerated_*`
Regions: `oregon`, `frankfurt`, `singapore`, `ohio`, `virginia`
Versions: `12`–`17` (default: `16`)

Get your `ownerId` (workspace ID):

```bash
curl -s https://api.render.com/v1/owners \
  -H "Authorization: Bearer $RENDER_API_KEY" | python3 -m json.tool
```

## Retrieve PostgreSQL Connection Info

```bash
curl -s https://api.render.com/v1/postgres/<POSTGRES_ID>/connection-info \
  -H "Authorization: Bearer $RENDER_API_KEY"
```

Returns: `internalConnectionString`, `externalConnectionString`, `psqlCommand`.

Use `internalConnectionString` for services running on Render (free, no egress). Use `externalConnectionString` for external access.

## Create Key-Value Store (Valkey/Redis)

```bash
curl -s -X POST https://api.render.com/v1/key-value \
  -H "Authorization: Bearer $RENDER_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "myapp-cache",
    "ownerId": "<OWNER_ID>",
    "plan": "free",
    "region": "oregon",
    "maxmemoryPolicy": "allkeys-lru"
  }'
```

Plans: `free`, `starter`, `standard`, `pro`, `pro_plus`
Eviction policies: `noeviction`, `allkeys-lru`, `volatile-lru`, `allkeys-random`, `volatile-random`, `volatile-ttl`, `volatile-lfu`, `allkeys-lfu`

## Retrieve Key-Value Connection Info

```bash
curl -s https://api.render.com/v1/key-value/<KEY_VALUE_ID>/connection-info \
  -H "Authorization: Bearer $RENDER_API_KEY"
```

Returns: `cliCommand`, `internalConnectionString`, `externalConnectionString`.

## Query Metrics

Metrics are time-series. Common queries:

**CPU usage:**

```bash
curl -s "https://api.render.com/v1/metrics/cpu?serviceId=<SERVICE_ID>&granularity=PT5M" \
  -H "Authorization: Bearer $RENDER_API_KEY"
```

**Memory usage:**

```bash
curl -s "https://api.render.com/v1/metrics/memory?serviceId=<SERVICE_ID>&granularity=PT5M" \
  -H "Authorization: Bearer $RENDER_API_KEY"
```

**HTTP request count:**

```bash
curl -s "https://api.render.com/v1/metrics/http-requests?serviceId=<SERVICE_ID>&granularity=PT5M" \
  -H "Authorization: Bearer $RENDER_API_KEY"
```

**HTTP latency:**

```bash
curl -s "https://api.render.com/v1/metrics/http-latency?serviceId=<SERVICE_ID>&granularity=PT5M" \
  -H "Authorization: Bearer $RENDER_API_KEY"
```

Available granularities: `PT1M` (1 min), `PT5M` (5 min), `PT1H` (1 hour), `P1D` (1 day).

Additional metrics endpoints: `/metrics/bandwidth`, `/metrics/disk-usage`, `/metrics/disk-capacity`, `/metrics/active-connections`, `/metrics/instance-count`, `/metrics/replication-lag`.

## Manage Environment Variables (Individual)

**List all env vars for a service:**

```bash
curl -s https://api.render.com/v1/services/<SERVICE_ID>/env-vars \
  -H "Authorization: Bearer $RENDER_API_KEY"
```

**Set or update a single env var:**

```bash
curl -s -X PUT https://api.render.com/v1/services/<SERVICE_ID>/env-vars/DATABASE_URL \
  -H "Authorization: Bearer $RENDER_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"value": "postgres://..."}'
```

**Delete an env var:**

```bash
curl -s -X DELETE https://api.render.com/v1/services/<SERVICE_ID>/env-vars/OLD_KEY \
  -H "Authorization: Bearer $RENDER_API_KEY"
```

## Full API Reference

For all endpoints (170+), see the official OpenAPI spec:
https://api-docs.render.com/openapi/render-public-api-1.json
