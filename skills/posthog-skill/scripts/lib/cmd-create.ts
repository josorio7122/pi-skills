import { out, info, requireToken, handleApiError } from './config.js'
import type { AppConfig } from './config.js'
import { getFixture } from './fixtures.js'
import * as spec from './dashboard-spec.js'
import { createClient, PostHogError } from './posthog-client.js'

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

  // Step 7: Emit result
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

export async function cmdCreate(flags: string[], config: AppConfig): Promise<void> {
  const isDryRun = flags.includes('--dry-run')

  if (isDryRun) {
    out(getFixture('create'))
    return
  }

  requireToken(config)
  await cmdCreateLive(config)
}
