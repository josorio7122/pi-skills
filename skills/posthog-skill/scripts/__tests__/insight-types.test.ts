import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { Insight, InsightQuerySource, InsightVizNode } from '../lib/posthog-client.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const CLIENT_SRC = readFileSync(resolve(__dirname, '../lib/posthog-client.ts'), 'utf8')

describe('insight types: InsightQuerySource', () => {
  it('InsightQuerySource is exported from posthog-client', () => {
    assert.ok(
      CLIENT_SRC.includes('export interface InsightQuerySource'),
      'InsightQuerySource interface must be exported from posthog-client.ts',
    )
  })

  it('InsightQuerySource conforming object compiles with kind and series', () => {
    const sample = {
      kind: 'TrendsQuery',
      series: [{ event: '$pageview', kind: 'EventsNode', name: '' }],
    } satisfies InsightQuerySource
    assert.strictEqual(sample.kind, 'TrendsQuery')
  })
})

describe('insight types: InsightVizNode', () => {
  it('InsightVizNode is exported from posthog-client', () => {
    assert.ok(
      CLIENT_SRC.includes('export interface InsightVizNode'),
      'InsightVizNode interface must be exported from posthog-client.ts',
    )
  })

  it('InsightVizNode conforming object compiles with kind InsightVizNode and source', () => {
    const source = {
      kind: 'TrendsQuery',
      series: [],
    } satisfies InsightQuerySource
    const node = {
      kind: 'InsightVizNode' as const,
      source,
    } satisfies InsightVizNode
    assert.strictEqual(node.kind, 'InsightVizNode')
  })
})

describe('insight types: Insight.query accepts InsightVizNode', () => {
  it('Insight.query field is no longer typed as plain Record<string, unknown>', () => {
    assert.ok(
      !CLIENT_SRC.includes('  query?: Record<string, unknown>\n'),
      'Insight.query must not be typed as plain Record<string, unknown> — it must accept InsightVizNode',
    )
  })

  it('Insight can be constructed with an InsightVizNode as the query field', () => {
    const vizNode = {
      kind: 'InsightVizNode' as const,
      source: { kind: 'TrendsQuery', series: [] } satisfies InsightQuerySource,
    } satisfies InsightVizNode
    const insight = {
      id: 42,
      name: 'ACH funnel',
      query: vizNode,
    } satisfies Insight
    assert.strictEqual(insight.id, 42)
    assert.strictEqual((insight.query as InsightVizNode).kind, 'InsightVizNode')
  })
})
