import { branchEvents, tiles } from './dashboard-spec.js'

// ---------------------------------------------------------------------------
// Fixture key union — one entry per supported command
// ---------------------------------------------------------------------------

export type FixtureKey =
  | 'inspect'
  | 'compare'
  | 'flags'
  | 'flags-get'
  | 'flags-toggle'
  | 'flags-create'
  | 'flags-update'
  | 'flags-activity'
  | 'create'

// ---------------------------------------------------------------------------
// Canned fixture data
// ---------------------------------------------------------------------------

const FIXTURES: Record<FixtureKey, unknown> = {
  inspect: {
    source: 'local-spec',
    events: branchEvents.map((ev) => ({
      name: ev.name,
      description: ev.description,
      properties: ev.properties,
    })),
  },

  compare: {
    id: 'drOq2lO5',
    name: 'ACH Payment Reference (dry-run fixture)',
    description: 'Canned fixture — no live data fetched',
    query_kind: 'TrendsQuery',
    series: [{ event: 'payment_method_selected', name: 'Payment Method Selected' }],
    breakdown: 'product_segment',
    date_range: '-30d',
    viz_type: 'ActionsLineGraph',
  },

  flags: {
    count: 3,
    results: [
      {
        id: 101,
        key: 'enable-new-checkout',
        name: 'Enable New Checkout',
        active: true,
        created_at: '2026-03-01T10:00:00Z',
        tags: ['release'],
      },
      {
        id: 102,
        key: 'dark-mode',
        name: 'Dark Mode',
        active: false,
        created_at: '2026-02-15T08:30:00Z',
        tags: [],
      },
      {
        id: 103,
        key: 'beta-pricing',
        name: 'Beta Pricing',
        active: true,
        created_at: '2026-03-20T14:00:00Z',
        tags: ['experiment'],
      },
    ],
  },

  'flags-get': {
    id: 101,
    key: 'enable-new-checkout',
    name: 'Enable New Checkout',
    active: true,
    deleted: false,
    created_at: '2026-03-01T10:00:00Z',
    updated_at: '2026-03-25T09:00:00Z',
    version: 3,
    filters: { groups: [{ properties: [], rollout_percentage: 100 }] },
    tags: ['release'],
    ensure_experience_continuity: false,
    is_remote_configuration: false,
    evaluation_runtime: 'server',
  },

  'flags-toggle': {
    id: 101,
    key: 'enable-new-checkout',
    active_before: true,
    active_after: false,
  },

  'flags-create': {
    id: 201,
    key: 'my-new-flag',
    name: 'My New Flag',
    active: true,
    deleted: false,
    created_at: '2026-03-29T12:00:00Z',
    filters: { groups: [{ properties: [], rollout_percentage: 0 }] },
    tags: [],
  },

  'flags-update': {
    id: 101,
    key: 'enable-new-checkout',
    name: 'Updated Name',
    active: true,
    deleted: false,
    updated_at: '2026-03-29T12:00:00Z',
    tags: ['release', 'updated'],
  },

  'flags-activity': {
    results: [
      {
        id: 'a1b2c3',
        activity: 'updated',
        detail: {
          changes: [{ field: 'active', action: 'changed', before: false, after: true }],
        },
        created_at: '2026-03-28T16:00:00Z',
        user: { email: 'dev@example.com' },
      },
      {
        id: 'd4e5f6',
        activity: 'created',
        detail: { name: 'enable-new-checkout' },
        created_at: '2026-03-01T10:00:00Z',
        user: { email: 'dev@example.com' },
      },
    ],
  },

  create: {
    dashboard_id: 99901,
    dashboard_url: 'https://us.posthog.com/project/39507/dashboard/99901',
    tiles: tiles.map((tile, i) => ({
      name: tile.name,
      insight_id: 80000 + i,
      insight_url: `https://us.posthog.com/project/39507/insights/${80000 + i}`,
      status: 'created',
    })),
  },
}

// ---------------------------------------------------------------------------
// Public accessor
// ---------------------------------------------------------------------------

export function getFixture(command: FixtureKey): unknown {
  if (!(command in FIXTURES)) {
    throw new Error(`No fixture for command: ${command}`)
  }
  return FIXTURES[command]
}
