import { describe, it } from 'node:test'
import assert from 'node:assert/strict'

import * as spec from '../lib/dashboard-spec.js'

describe('dashboard-spec', () => {
  it('exports a spec object with a name', () => {
    assert.ok(spec.name, 'spec must have a name')
  })

  it('exports exactly 8 tiles', () => {
    assert.strictEqual(spec.tiles.length, 8, 'must have exactly 8 tiles')
  })

  it('every tile has name, type, query, and layout', () => {
    for (const tile of spec.tiles) {
      assert.ok(tile.name, `tile missing name: ${JSON.stringify(tile)}`)
      assert.ok(tile.type, `tile "${tile.name}" missing type`)
      assert.ok(tile.query, `tile "${tile.name}" missing query`)
      assert.ok(tile.layout, `tile "${tile.name}" missing layout`)
    }
  })

  it('every tile layout has x, y, w, h', () => {
    for (const tile of spec.tiles) {
      const { layout } = tile
      assert.ok(typeof layout.x === 'number', `tile "${tile.name}" layout.x must be number`)
      assert.ok(typeof layout.y === 'number', `tile "${tile.name}" layout.y must be number`)
      assert.ok(typeof layout.w === 'number', `tile "${tile.name}" layout.w must be number`)
      assert.ok(typeof layout.h === 'number', `tile "${tile.name}" layout.h must be number`)
    }
  })

  it('tile types are valid PostHog query kinds', () => {
    const validTypes = new Set(['TrendsQuery', 'FunnelsQuery', 'HogQLQuery'])
    for (const tile of spec.tiles) {
      assert.ok(validTypes.has(tile.type), `tile "${tile.name}" has invalid type "${tile.type}"`)
    }
  })

  it('all tile-featured events are referenced in the tile queries', () => {
    const allTileText = JSON.stringify(spec.tiles)
    const tileEvents = [
      'form_page_reached',
      'travel_protection_selected',
      'fcf_amount_selected',
      'fcf_more_info_clicked',
      'payment_method_selected',
      'payment_mode_selected',
      'payment_completed',
      'signing_completed',
    ]
    for (const event of tileEvents) {
      assert.ok(
        allTileText.includes(event),
        `tile-featured event "${event}" not referenced in any tile`,
      )
    }
  })

  it('exports a branchEvents array with 9 entries', () => {
    assert.ok(Array.isArray(spec.branchEvents), 'must export branchEvents array')
    assert.strictEqual(spec.branchEvents.length, 9, 'must have exactly 9 branch events')
  })

  it('every branchEvent has name and properties fields', () => {
    for (const ev of spec.branchEvents) {
      assert.ok(ev.name, `branchEvent missing name`)
      assert.ok(Array.isArray(ev.properties), `branchEvent "${ev.name}" missing properties array`)
    }
  })
})
