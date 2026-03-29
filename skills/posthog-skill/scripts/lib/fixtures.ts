// ---------------------------------------------------------------------------
// Fixture key union — one entry per supported command
// ---------------------------------------------------------------------------

export type FixtureKey =
  | 'flags'
  | 'flags-get'
  | 'flags-toggle'
  | 'flags-create'
  | 'flags-update'
  | 'flags-activity'

// ---------------------------------------------------------------------------
// Canned fixture data
// ---------------------------------------------------------------------------

const FIXTURES: Record<FixtureKey, unknown> = {
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
