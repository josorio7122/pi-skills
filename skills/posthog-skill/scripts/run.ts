#!/usr/bin/env node

import path from 'node:path'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import { getFixture } from './lib/fixtures.js'
import * as spec from './lib/dashboard-spec.js'
import { createClient, PostHogError } from './lib/posthog-client.js'
import type { PostHogConfig } from './lib/posthog-client.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// ---------------------------------------------------------------------------
// Config resolution
// ---------------------------------------------------------------------------

interface AppConfig extends PostHogConfig {
  achInsightId: string
  dashboardName: string
}

function resolveConfig(): AppConfig {
  return {
    host: process.env['POSTHOG_HOST'] ?? 'https://us.posthog.com',
    projectId: process.env['POSTHOG_PROJECT_ID'] ?? '39507',
    token: process.env['POSTHOG_PERSONAL_API_KEY'] ?? '',
    achInsightId: process.env['POSTHOG_ACH_INSIGHT_ID'] ?? 'drOq2lO5',
    dashboardName: process.env['POSTHOG_DASHBOARD_NAME'] ?? spec.name,
  }
}

function requireToken(config: AppConfig): void {
  if (!config.token) {
    process.stderr.write(
      'Error: POSTHOG_PERSONAL_API_KEY is required for this command.\n' +
        'Set it in your environment: export POSTHOG_PERSONAL_API_KEY=phx_...\n',
    )
    process.exit(1)
  }
}

// ---------------------------------------------------------------------------
// Output helpers
// ---------------------------------------------------------------------------

function out(data: unknown): void {
  process.stdout.write(JSON.stringify(data, null, 2) + '\n')
}

function info(msg: string): void {
  process.stderr.write(msg + '\n')
}

function handleApiError(err: unknown, context?: string): never {
  if (err instanceof PostHogError) {
    if (err.status === 401) {
      process.stderr.write(
        `Error: PostHog returned 401 (Unauthorized) on ${err.endpoint}\n` +
          'Verify that POSTHOG_PERSONAL_API_KEY is valid and has not expired.\n',
      )
    } else if (err.status === 403) {
      process.stderr.write(
        `Error: PostHog returned 403 (Forbidden) on ${err.endpoint}\n` +
          'Check that your API key has these scopes: dashboard:read, dashboard:write, insight:read, insight:write, query:read\n',
      )
    } else if (err.status === 429) {
      process.stderr.write(
        `Error: PostHog rate limit exceeded on ${err.endpoint} — tried 3 times.\n`,
      )
    } else {
      process.stderr.write(`Error: ${context ?? 'PostHog request failed'}: ${err.message}\n`)
    }
  } else {
    const message = err instanceof Error ? err.message : String(err)
    process.stderr.write(`Error: Connection to PostHog failed: ${message}\n`)
  }
  process.exit(1)
}

// ---------------------------------------------------------------------------
// Commands
// ---------------------------------------------------------------------------

function cmdStatus(config: AppConfig): void {
  const tokenDisplay = config.token ? `***${config.token.slice(-4)} (present)` : 'NOT SET'
  const achDisplay = config.achInsightId || 'NOT SET'

  out({
    host: config.host,
    project_id: config.projectId,
    token: tokenDisplay,
    token_present: Boolean(config.token),
    ach_insight_id: achDisplay,
    dashboard_name: config.dashboardName,
  })
}

async function cmdInspect(flags: string[], config: AppConfig): Promise<void> {
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

  // Build map from results: event → { count_30d, last_seen }
  // HogQL returns rows as arrays; columns order: event, count_30d, last_seen
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

  // Zero-fill for events not present in result
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

async function cmdCompare(flags: string[], config: AppConfig): Promise<void> {
  const isDryRun = flags.includes('--dry-run')

  if (isDryRun) {
    out(getFixture('compare'))
    return
  }

  requireToken(config)
  await cmdCompareLive(config)
}

async function cmdCompareLive(config: AppConfig): Promise<void> {
  const client = createClient(config)
  const shortId = config.achInsightId

  let response
  try {
    response = await client.getInsightByShortId(shortId)
  } catch (err) {
    handleApiError(err, `compare: failed to fetch insight ${shortId}`)
  }

  const results = response.results ?? []
  if (results.length === 0) {
    process.stderr.write(
      `Error: ACH insight not found: ${shortId} — verify the short ID is correct and the token has insight:read scope\n`,
    )
    process.exit(1)
  }

  const insight = results[0]
  if (!insight) {
    process.exit(1)
  }

  const rawQuery: Record<string, unknown> = insight.query ?? {}

  // PostHog wraps newer queries in InsightVizNode; drill into .source for actual query data
  const isVizNode = rawQuery['kind'] === 'InsightVizNode'
  const querySource = rawQuery['source']
  const query: Record<string, unknown> = isVizNode
    ? typeof querySource === 'object' && querySource !== null
      ? (querySource as Record<string, unknown>)
      : {}
    : rawQuery

  // Extract viz_type: funnels store it in funnelsFilter, trends in trendsFilter
  let vizType: string | null = null
  const funnelsFilter = query['funnelsFilter']
  const trendsFilter = query['trendsFilter']
  const insightFilters = insight.filters

  if (typeof funnelsFilter === 'object' && funnelsFilter !== null) {
    const ff = funnelsFilter as Record<string, unknown>
    if (ff['funnelVizType']) {
      vizType = `funnel:${String(ff['funnelVizType'])}`
    }
  } else if (typeof trendsFilter === 'object' && trendsFilter !== null) {
    const tf = trendsFilter as Record<string, unknown>
    if (tf['display']) {
      vizType = String(tf['display'])
    }
  } else if (typeof insightFilters === 'object' && insightFilters !== null) {
    const ifd = (insightFilters as Record<string, unknown>)['display']
    if (ifd) {
      vizType = String(ifd)
    }
  }

  // Extract normalized summary fields
  const seriesRaw = query['series']
  const series = Array.isArray(seriesRaw)
    ? seriesRaw.map((s: unknown) => {
        const item = s as Record<string, unknown>
        return { event: item['event'], name: item['name'], kind: item['kind'] }
      })
    : []

  const breakdownFilter = query['breakdownFilter']
  const breakdown =
    typeof breakdownFilter === 'object' && breakdownFilter !== null
      ? ((breakdownFilter as Record<string, unknown>)['breakdown'] ?? null)
      : null

  const dateRange = query['dateRange']
  const dateRangeFrom =
    typeof dateRange === 'object' && dateRange !== null
      ? ((dateRange as Record<string, unknown>)['date_from'] ?? null)
      : null

  const queryKindInner = query['kind']
  const rawQueryKind = rawQuery['kind']

  const summary = {
    id: insight.short_id ?? shortId,
    name: insight.name ?? null,
    description: insight.description ?? null,
    query_kind: isVizNode
      ? `InsightVizNode(${typeof queryKindInner === 'string' ? queryKindInner : '?'})`
      : typeof rawQueryKind === 'string'
        ? rawQueryKind
        : null,
    series,
    breakdown,
    date_range: dateRangeFrom,
    viz_type: vizType,
    saved_to: 'references/ach-reference-summary.json',
  }

  // Write to references/ach-reference-summary.json
  const summaryPath = path.join(__dirname, '..', 'references', 'ach-reference-summary.json')
  try {
    fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2) + '\n', 'utf8')
  } catch (writeErr) {
    const msg = writeErr instanceof Error ? writeErr.message : String(writeErr)
    process.stderr.write(`Warning: could not write ${summaryPath}: ${msg}\n`)
  }

  out(summary)
}

async function cmdCreate(flags: string[], config: AppConfig): Promise<void> {
  const isDryRun = flags.includes('--dry-run')

  if (isDryRun) {
    out(getFixture('create'))
    return
  }

  requireToken(config)
  await cmdCreateLive(config)
}

async function cmdCreateLive(config: AppConfig): Promise<void> {
  const client = createClient(config)
  const dashboardName = config.dashboardName
  const host = config.host
  const projectId = config.projectId

  // Step 1: Smoke test auth
  try {
    await client.listDashboards(1)
  } catch (err) {
    if (err instanceof PostHogError && err.status === 401) {
      process.stderr.write('Error: auth failed — verify POSTHOG_PERSONAL_API_KEY is valid.\n')
    } else if (err instanceof PostHogError && err.status === 403) {
      process.stderr.write(
        'Error: PostHog returned 403 — check that your API key has dashboard:read, dashboard:write, insight:read, insight:write, query:read scopes\n',
      )
    } else {
      const msg = err instanceof Error ? err.message : String(err)
      process.stderr.write(`Error: connection failed: ${msg}\n`)
    }
    process.exit(1)
  }

  // Step 2: List dashboards (up to 100)
  let dashboardList
  try {
    dashboardList = await client.listDashboards(100)
  } catch (err) {
    handleApiError(err, 'create: failed to list dashboards')
  }

  const allDashboards = dashboardList.results ?? []
  if (dashboardList.count > 100) {
    info('Warning: dashboard list may be truncated at 100 results')
  }

  // Step 3: Find or create dashboard
  const existing = allDashboards.find((d) => d.name === dashboardName && !d.deleted)
  let dashboardId: number

  if (existing) {
    dashboardId = existing.id
    info(`Found existing dashboard "${dashboardName}" (id: ${dashboardId})`)
  } else {
    info(`Creating dashboard "${dashboardName}"...`)
    let created
    try {
      created = await client.createDashboard(dashboardName, spec.tags)
    } catch (err) {
      handleApiError(err, 'create: failed to create dashboard')
    }
    dashboardId = created.id
    info(`Dashboard created (id: ${dashboardId})`)
  }

  // Step 4: Fetch full dashboard (includes tiles with nested insights)
  let dashboard
  try {
    dashboard = await client.getDashboard(dashboardId)
  } catch (err) {
    handleApiError(err, `create: failed to fetch dashboard ${dashboardId}`)
  }

  // Step 5: Build existing insight name → tile map from dashboard tiles
  const existingTiles = dashboard.tiles ?? []
  type ExistingTile = (typeof existingTiles)[number]
  const existingNameToTile: Record<string, ExistingTile> = {}
  for (const tile of existingTiles) {
    if (tile.insight && tile.insight.name) {
      existingNameToTile[tile.insight.name] = tile
    }
  }

  // Step 6: Create missing insights, attaching them to the dashboard via dashboards:[id]
  // Insights created with dashboards:[dashboardId] are auto-attached — no PATCH needed.
  const tileResults: Array<{
    specTile: (typeof spec.tiles)[number]
    insightId: number | null
    status: 'existing' | 'created' | 'failed'
  }> = []
  let hasFailure = false

  for (const specTile of spec.tiles) {
    const existingTile = existingNameToTile[specTile.name]

    if (existingTile) {
      const tileInsight = existingTile.insight
      if (tileInsight) {
        info(`Skipping existing insight: "${specTile.name}" (id: ${tileInsight.id})`)
        tileResults.push({
          specTile,
          insightId: tileInsight.id,
          status: 'existing',
        })
      }
      continue
    }

    info(`Creating insight: "${specTile.name}"...`)
    try {
      const newInsight = await client.createInsightOnDashboard(
        specTile.name,
        specTile.query,
        dashboardId,
      )
      info(`  Created insight (id: ${newInsight.id})`)
      tileResults.push({
        specTile,
        insightId: newInsight.id,
        status: 'created',
      })
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      process.stderr.write(`Error creating insight "${specTile.name}": ${msg}\n`)
      tileResults.push({
        specTile,
        insightId: null,
        status: 'failed',
      })
      hasFailure = true
    }
  }

  // Step 7: Emit result (no PATCH needed — insights attach via dashboards field)
  const tiles = tileResults.map((t) => ({
    name: t.specTile.name,
    insight_id: t.insightId,
    insight_url:
      t.insightId !== null ? `${host}/project/${projectId}/insights/${t.insightId}` : null,
    status: t.status,
  }))

  out({
    dashboard_id: dashboardId,
    dashboard_url: `${host}/project/${projectId}/dashboard/${dashboardId}`,
    tiles,
  })

  if (hasFailure) {
    process.exit(3)
  }
}

// ---------------------------------------------------------------------------
// Flags command
// ---------------------------------------------------------------------------

interface FlagsOptions {
  search?: string
  active?: string
  type?: string
  limit?: string
  name?: string
  tags?: string
  dryRun: boolean
}

function parseFlagsOptions(args: string[]): FlagsOptions {
  const opts: FlagsOptions = { dryRun: false }
  let i = 0
  while (i < args.length) {
    const arg = args[i]
    if (arg === undefined) break
    switch (arg) {
      case '--dry-run':
        opts.dryRun = true
        i++
        break
      case '--search':
        opts.search = args[i + 1]
        i += 2
        break
      case '--active':
        opts.active = args[i + 1]
        i += 2
        break
      case '--type':
        opts.type = args[i + 1]
        i += 2
        break
      case '--limit':
        opts.limit = args[i + 1]
        i += 2
        break
      case '--name':
        opts.name = args[i + 1]
        i += 2
        break
      case '--tags':
        opts.tags = args[i + 1]
        i += 2
        break
      default:
        i++
    }
  }
  return opts
}

async function cmdFlags(args: string[], config: AppConfig): Promise<void> {
  // Determine subcommand: if first arg starts with '--' or is missing, default to 'list'
  let subcommand = 'list'
  let rest = args
  const firstArg = args[0]
  if (firstArg !== undefined && !firstArg.startsWith('--')) {
    subcommand = firstArg
    rest = args.slice(1)
  }

  const opts = parseFlagsOptions(rest)

  switch (subcommand) {
    case 'list': {
      if (opts.dryRun) {
        out(getFixture('flags'))
        return
      }
      requireToken(config)
      const client = createClient(config)
      try {
        const result = await client.listFeatureFlags({
          search: opts.search,
          active: opts.active,
          type: opts.type,
          limit: opts.limit !== undefined ? Number(opts.limit) : undefined,
        })
        out(result)
      } catch (err) {
        handleApiError(err, 'flags list failed')
      }
      break
    }
    case 'get': {
      const id = rest.find((a) => !a.startsWith('--'))
      if (!id) {
        process.stderr.write('Error: flags get requires a flag ID — ID is required\n')
        process.exit(2)
      }
      if (opts.dryRun) {
        out(getFixture('flags-get'))
        return
      }
      requireToken(config)
      const client = createClient(config)
      try {
        const result = await client.getFeatureFlag(id)
        out(result)
      } catch (err) {
        handleApiError(err, `flags get ${id} failed`)
      }
      break
    }
    case 'toggle': {
      const id = rest.find((a) => !a.startsWith('--'))
      if (!id) {
        process.stderr.write('Error: flags toggle requires a flag ID\n')
        process.exit(2)
      }
      if (opts.dryRun) {
        out(getFixture('flags-toggle'))
        return
      }
      requireToken(config)
      const client = createClient(config)
      try {
        const current = await client.getFeatureFlag(id)
        await client.patchFeatureFlag(id, { active: !current.active })
        out({
          id: current.id,
          key: current.key,
          active_before: current.active,
          active_after: !current.active,
        })
      } catch (err) {
        handleApiError(err, `flags toggle ${id} failed`)
      }
      break
    }
    case 'create': {
      const key = rest.find((a) => !a.startsWith('--'))
      if (!key) {
        process.stderr.write('Error: flags create requires a flag key\n')
        process.exit(2)
      }
      if (opts.dryRun) {
        out(getFixture('flags-create'))
        return
      }
      requireToken(config)
      const client = createClient(config)
      try {
        const body: Record<string, unknown> = { name: opts.name }
        if (opts.tags !== undefined) {
          body['tags'] = opts.tags.split(',')
        }
        const result = await client.createFeatureFlag(key, body)
        out(result)
      } catch (err) {
        handleApiError(err, `flags create ${key} failed`)
      }
      break
    }
    case 'update': {
      const id = rest.find((a) => !a.startsWith('--'))
      if (!id) {
        process.stderr.write('Error: flags update requires a flag ID\n')
        process.exit(2)
      }
      if (opts.dryRun) {
        out(getFixture('flags-update'))
        return
      }
      requireToken(config)
      const client = createClient(config)
      try {
        const body: Record<string, unknown> = {}
        if (opts.name !== undefined) body['name'] = opts.name
        if (opts.active !== undefined) body['active'] = opts.active === 'true'
        if (opts.tags !== undefined) body['tags'] = opts.tags.split(',')
        const result = await client.patchFeatureFlag(id, body)
        out(result)
      } catch (err) {
        handleApiError(err, `flags update ${id} failed`)
      }
      break
    }
    case 'activity': {
      const id = rest.find((a) => !a.startsWith('--'))
      if (!id) {
        process.stderr.write('Error: flags activity requires a flag ID\n')
        process.exit(2)
      }
      if (opts.dryRun) {
        out(getFixture('flags-activity'))
        return
      }
      requireToken(config)
      const client = createClient(config)
      try {
        const result = await client.getFeatureFlagActivity(
          id,
          opts.limit !== undefined ? Number(opts.limit) : 10,
        )
        out(result)
      } catch (err) {
        handleApiError(err, `flags activity ${id} failed`)
      }
      break
    }
    default:
      process.stderr.write(`Unknown flags subcommand: ${subcommand}\n`)
      process.exit(2)
  }
}

function cmdHelp(): void {
  process.stderr.write(
    [
      '',
      'posthog-skill — PostHog analytics automation for branch 7361',
      '',
      'Usage:',
      '  node scripts/run.js <command> [options]',
      '',
      'Commands:',
      '  status              Show resolved config (host, project ID, token masked/missing).',
      '                      Never requires a token. Safe to run in CI.',
      '',
      '  inspect             List the 9 branch-7361 events from the local spec (always).',
      '  inspect --live      Verify events are live in PostHog (requires token).',
      '',
      '  compare             Fetch the ACH reference insight summary.',
      '                      Requires POSTHOG_PERSONAL_API_KEY.',
      '                      Saves result to references/ach-reference-summary.json.',
      '',
      '  create              Idempotently provision the 7361 dashboard + 8 insights.',
      '                      Requires POSTHOG_PERSONAL_API_KEY.',
      '',
      'Options:',
      '  --dry-run           Skip all HTTP. Return canned fixture output. Exit 0.',
      '  --help              Print this help.',
      '',
      'Environment variables:',
      '  POSTHOG_PERSONAL_API_KEY   Required for live commands',
      '  POSTHOG_PROJECT_ID         Default: 39507',
      '  POSTHOG_HOST               Default: https://us.posthog.com',
      '  POSTHOG_ACH_INSIGHT_ID     Default: drOq2lO5',
      '  POSTHOG_DASHBOARD_NAME     Default: 7361 Purchase & Insurance Flow Metrics',
      '',
      'Recovery (orphaned insights):',
      '  If create fails between insight creation and the dashboard PATCH (exit 3),',
      '  soft-delete the dashboard and re-run:',
      '    PATCH /api/environments/39507/dashboards/<id>/ { "deleted": true }',
      '  Then run: node scripts/run.js create',
      '',
      'Examples:',
      '  node scripts/run.js status',
      '  node scripts/run.js inspect',
      '  node scripts/run.js inspect --live',
      '  node scripts/run.js compare --dry-run',
      '  node scripts/run.js compare',
      '  node scripts/run.js create --dry-run',
      '  node scripts/run.js create',
      '',
    ].join('\n'),
  )
}

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  const args = process.argv.slice(2)

  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    cmdHelp()
    process.exit(0)
  }

  const command = args[0]
  if (command === undefined) {
    cmdHelp()
    process.exit(0)
  }

  const flags = args.slice(1)
  const config = resolveConfig()

  switch (command) {
    case 'status':
      cmdStatus(config)
      break
    case 'inspect':
      await cmdInspect(flags, config)
      break
    case 'compare':
      await cmdCompare(flags, config)
      break
    case 'create':
      await cmdCreate(flags, config)
      break
    case 'flags':
      await cmdFlags(flags, config)
      break
    default:
      process.stderr.write(`Unknown command: ${command}\nRun with --help for usage.\n`)
      process.exit(2)
  }
}

main().catch((err) => {
  process.stderr.write(`Fatal: ${err instanceof Error ? err.message : String(err)}\n`)
  process.exit(1)
})
