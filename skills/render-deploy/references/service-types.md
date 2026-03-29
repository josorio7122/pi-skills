# Render Service Types

For YAML field definitions and examples, see [blueprint-spec.md](blueprint-spec.md).

## Web Services (`type: web`)

**When to use:** Your app handles HTTP requests, users need to access it via URL, or you need load balancing and scaling.

**Best Practices:**

1. Bind to environment PORT: `app.listen(PORT, '0.0.0.0')`
2. Add a `/health` endpoint returning 200
3. Use appropriate timeouts — web requests should complete within 30 seconds
4. Implement graceful shutdown on SIGTERM

---

## Worker Services (`type: worker`)

**When to use:** Processing background jobs, consuming from message queues, or running long-lived processes without HTTP.

**Best Practices:**

1. Connect to message queue via env var
2. Implement retry logic for failures
3. Monitor queue depth
4. Log processing status
5. Graceful shutdown — finish current jobs before exiting

---

## Cron Jobs (`type: cron`)

**When to use:** Running scheduled tasks, processing that doesn't need to be always-on, or tasks that run periodically (hourly, daily, weekly).

**Best Practices:**

1. Make jobs idempotent — handle re-runs safely
2. Log completion status (success/failure)
3. Set appropriate timeouts to match expected duration
4. Use UTC times — all schedules are UTC-based
5. Test thoroughly with different data scenarios

---

## Static Sites (`type: web` + `runtime: static`)

**When to use:** Serving pre-built HTML/CSS/JS, no backend processing needed, want CDN caching and fast delivery.

**Best Practices:**

1. Optimize build output (minify, compress, tree-shake)
2. Use long cache headers for hashed assets
3. Add security headers (X-Frame-Options, X-Content-Type-Options)
4. Configure SPA routing with rewrite rules (`/* → /index.html`)
5. Handle 404s with a custom `404.html`

---

## Private Services (`type: pserv`)

**When to use:** Service only accessed by other services, internal-only communication, or microservice architectures.

**Best Practices:**

1. Use internal DNS (`.render-internal.com` domains)
2. **Add authentication for sensitive operations** — network isolation alone is not a security boundary.
3. Take advantage of low latency between co-located services
4. Simplify architecture — no need for external load balancers

---

## Comparison Table

| Feature       | Web          | Worker          | Cron            | Static       | Private           |
| ------------- | ------------ | --------------- | --------------- | ------------ | ----------------- |
| Public URL    | ✅ Yes       | ❌ No           | ❌ No           | ✅ Yes       | ❌ No             |
| Port Binding  | ✅ Required  | ❌ Not needed   | ❌ Not needed   | ❌ N/A       | ✅ Required       |
| Health Checks | ✅ Yes       | ❌ No           | ❌ No           | ❌ N/A       | ✅ Yes            |
| Runtime       | ✅ Yes       | ✅ Yes          | ✅ Yes          | ❌ No        | ✅ Yes            |
| Persistent    | ✅ Yes       | ✅ Yes          | ❌ No           | ✅ Yes       | ✅ Yes            |
| Scaling       | ✅ Yes       | ✅ Yes          | ❌ No           | ✅ Yes       | ✅ Yes            |
| Use Case      | HTTP servers | Background jobs | Scheduled tasks | Static files | Internal services |
