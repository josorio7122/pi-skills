import { out, info, requireToken, handleApiError } from './config.js'
import type { AppConfig } from './config.js'
import { getFixture } from './fixtures.js'
import * as spec from './dashboard-spec.js'
import { createClient } from './posthog-client.js'

async function cmdInspectLive(config: AppConfig): Promise<void> {
  const client = createClient(config)
  const eventNames = spec.branchEvents.map((ev) => ev.name)

  const quotedNames = eventNames.map((n) => `'${n}'`).join(', ')
  const sql = [
    'SELECT',
    '  event,',
    '  count() AS count_30d,',
    '  max(timestamp) AS last_seen',
    'FROM events',
    `WHERE event IN (${quotedNames})`,
    '  AND timestamp >= now() - INTERVAL 30 DAY',
    'GROUP BY event',
  ].join('\n')

  const startMs = Date.now()
  let queryResult
  try {
    queryResult = await client.runQuery(sql)
  } catch (err) {
    handleApiError(err, 'inspect --live query failed')
  }

  const elapsed = Date.now() - startMs
  info(`PostHog query completed in ${elapsed}ms (cached: ${queryResult.is_cached ?? false})`)

  const map: Record<string, { count_30d: unknown; last_seen: unknown }> = {}
  const rows = queryResult.results ?? []
  for (const row of rows) {
    const eventName = row[0]
    if (typeof eventName === 'string') {
      map[eventName] = {
        count_30d: row[1] ?? 0,
        last_seen: row[2] ?? null,
      }
    }
  }

  const events = eventNames.map((name) => ({
    event: name,
    count_30d: map[name] !== undefined ? map[name].count_30d : 0,
    last_seen: map[name] !== undefined ? map[name].last_seen : null,
  }))

  out({
    source: 'posthog-live',
    queried_at: new Date().toISOString(),
    events,
  })
}

export async function cmdInspect(flags: string[], config: AppConfig): Promise<void> {
  const isDryRun = flags.includes('--dry-run')
  const isLive = flags.includes('--live')

  if (isDryRun) {
    out(getFixture('inspect'))
    return
  }

  if (isLive) {
    requireToken(config)
    await cmdInspectLive(config)
    return
  }

  // Static local spec — works offline
  out({
    source: 'local-spec',
    events: spec.branchEvents.map((ev) => ({
      name: ev.name,
      description: ev.description,
      properties: ev.properties,
    })),
  })
}
