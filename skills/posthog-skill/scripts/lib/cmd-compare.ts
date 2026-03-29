import path from 'node:path'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import { out, requireToken, handleApiError } from './config.js'
import type { AppConfig } from './config.js'
import { getFixture } from './fixtures.js'
import { createClient } from './posthog-client.js'
import type { InsightVizNode, InsightQuerySource } from './posthog-client.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

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

  const rawQuery = insight.query ?? {}

  // PostHog wraps newer queries in InsightVizNode; drill into .source for actual query data
  const isVizNode = (rawQuery as InsightVizNode).kind === 'InsightVizNode'
  const query: InsightQuerySource | Record<string, unknown> = isVizNode
    ? ((rawQuery as InsightVizNode).source ?? {})
    : (rawQuery as InsightQuerySource)

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
  const summaryPath = path.join(__dirname, '..', '..', 'references', 'ach-reference-summary.json')
  try {
    fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2) + '\n', 'utf8')
  } catch (writeErr) {
    const msg = writeErr instanceof Error ? writeErr.message : String(writeErr)
    process.stderr.write(`Warning: could not write ${summaryPath}: ${msg}\n`)
  }

  out(summary)
}

export async function cmdCompare(flags: string[], config: AppConfig): Promise<void> {
  const isDryRun = flags.includes('--dry-run')

  if (isDryRun) {
    out(getFixture('compare'))
    return
  }

  requireToken(config)
  await cmdCompareLive(config)
}
