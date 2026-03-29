export interface BranchEvent {
  name: string
  description: string
  properties: string[]
}

export type TileQueryKind = 'FunnelsQuery' | 'TrendsQuery' | 'HogQLQuery'

export interface TileLayout {
  x: number
  y: number
  w: number
  h: number
}

export interface Tile {
  name: string
  description: string
  type: TileQueryKind
  query: Record<string, unknown>
  layout: TileLayout
}

export interface DashboardSpec {
  name: string
  description: string
  tags: string[]
  branchEvents: BranchEvent[]
  tiles: Tile[]
}

// Key pages for the purchase funnel tile (curated subset of the 27 pages)
const FUNNEL_PAGES = ['quote', 'delivery', 'payment', 'review', 'confirmation'] as const

export const name = '7361 Purchase & Insurance Flow Metrics'

export const description =
  'Branch 7361 metrics dashboard — purchase and insurance flow instrumentation for payment, protection, and signing events.'

export const tags: string[] = ['7361', 'metrics', 'purchase', 'insurance']

export const branchEvents: BranchEvent[] = [
  {
    name: 'form_page_reached',
    description: 'Fires on every page load in purchase and insurance flows',
    properties: ['page', 'product_segment', 'county_id', 'form_type', 'uid'],
  },
  {
    name: 'soil_donation_selected',
    description: 'User submits the delivery/soil donation page',
    properties: ['product_segment', 'county_id', 'uid'],
  },
  {
    name: 'travel_protection_selected',
    description: 'User selects or declines travel protection',
    properties: ['selected', 'product_segment', 'county_id', 'uid'],
  },
  {
    name: 'fcf_amount_selected',
    description: 'User clicks a Family Care Fund tier',
    properties: ['amount', 'product_segment', 'county_id', 'uid'],
  },
  {
    name: 'fcf_more_info_clicked',
    description: 'User clicks the FCF more-info link',
    properties: ['product_segment', 'county_id', 'uid'],
  },
  {
    name: 'payment_method_selected',
    description: 'User selects a payment method (ACH vs card)',
    properties: ['method', 'product_segment', 'county_id', 'uid'],
  },
  {
    name: 'payment_mode_selected',
    description: 'User selects single-pay vs multipay',
    properties: ['mode', 'product_segment', 'county_id', 'uid'],
  },
  {
    name: 'payment_completed',
    description: 'Payment is successfully processed (replaces legacy Purchased event)',
    properties: ['product_segment', 'county_id', 'form_type', 'uid'],
  },
  {
    name: 'signing_completed',
    description: 'Insurance contract is signed successfully',
    properties: ['form_type', 'product_segment', 'county_id', 'uid'],
  },
]

// Grid: 2 columns × 4 rows, each tile w=6, h=5 (PostHog default sizing)
// Positions: col 0 = x:0, col 1 = x:6; rows at y: 0, 5, 10, 15
export const tiles: Tile[] = [
  {
    name: 'Page Funnel',
    description: 'Funnel progression through key purchase flow pages',
    type: 'FunnelsQuery',
    query: {
      kind: 'FunnelsQuery',
      series: FUNNEL_PAGES.map((page) => ({
        kind: 'EventsNode',
        event: 'form_page_reached',
        name: `Page: ${page}`,
        properties: [{ key: 'page', value: page, operator: 'exact', type: 'event' }],
      })),
      dateRange: { date_from: '-30d' },
      funnelsFilter: {
        funnelWindowInterval: 14,
        funnelWindowIntervalUnit: 'day',
      },
    },
    layout: { x: 0, y: 0, w: 12, h: 5 },
  },
  {
    name: 'Payment Method Preference',
    description: 'ACH vs card selection broken down by product segment',
    type: 'TrendsQuery',
    query: {
      kind: 'TrendsQuery',
      series: [
        { kind: 'EventsNode', event: 'payment_method_selected', name: 'Payment Method Selected' },
      ],
      breakdownFilter: { breakdown: 'product_segment', breakdown_type: 'event' },
      dateRange: { date_from: '-30d' },
    },
    layout: { x: 0, y: 5, w: 6, h: 5 },
  },
  {
    name: 'Payment Mode Selection',
    description: 'Single-pay vs multipay selection by product segment',
    type: 'TrendsQuery',
    query: {
      kind: 'TrendsQuery',
      series: [
        { kind: 'EventsNode', event: 'payment_mode_selected', name: 'Payment Mode Selected' },
      ],
      breakdownFilter: { breakdown: 'product_segment', breakdown_type: 'event' },
      dateRange: { date_from: '-30d' },
    },
    layout: { x: 6, y: 5, w: 6, h: 5 },
  },
  {
    name: 'FCF Selection Rate',
    description: 'Family Care Fund tier selections over time',
    type: 'TrendsQuery',
    query: {
      kind: 'TrendsQuery',
      series: [
        { kind: 'EventsNode', event: 'fcf_amount_selected', name: 'FCF Amount Selected' },
        { kind: 'EventsNode', event: 'fcf_more_info_clicked', name: 'FCF More Info Clicked' },
      ],
      dateRange: { date_from: '-30d' },
    },
    layout: { x: 0, y: 10, w: 6, h: 5 },
  },
  {
    name: 'Travel Protection Selection',
    description: 'Travel protection opt-in vs decline over time',
    type: 'TrendsQuery',
    query: {
      kind: 'TrendsQuery',
      series: [
        {
          kind: 'EventsNode',
          event: 'travel_protection_selected',
          name: 'Travel Protection Selected',
        },
      ],
      dateRange: { date_from: '-30d' },
    },
    layout: { x: 6, y: 10, w: 6, h: 5 },
  },
  {
    name: 'Signing Completion',
    description: 'Insurance contract signing completion by form type',
    type: 'TrendsQuery',
    query: {
      kind: 'TrendsQuery',
      series: [{ kind: 'EventsNode', event: 'signing_completed', name: 'Signing Completed' }],
      breakdownFilter: { breakdown: 'form_type', breakdown_type: 'event' },
      dateRange: { date_from: '-30d' },
    },
    layout: { x: 0, y: 15, w: 6, h: 5 },
  },
  {
    name: 'Purchase Completions Over Time',
    description: 'payment_completed trend broken down by product segment',
    type: 'TrendsQuery',
    query: {
      kind: 'TrendsQuery',
      series: [{ kind: 'EventsNode', event: 'payment_completed', name: 'Payment Completed' }],
      breakdownFilter: { breakdown: 'product_segment', breakdown_type: 'event' },
      dateRange: { date_from: '-30d' },
    },
    layout: { x: 6, y: 15, w: 6, h: 5 },
  },
  {
    name: 'Top Counties',
    description: 'Counties ranked by form_page_reached event count (last 30 days)',
    type: 'HogQLQuery',
    query: {
      kind: 'HogQLQuery',
      query: [
        'SELECT',
        '  properties.county_id AS county_id,',
        '  count() AS page_views',
        'FROM events',
        "WHERE event = 'form_page_reached'",
        '  AND timestamp >= now() - INTERVAL 30 DAY',
        '  AND properties.county_id IS NOT NULL',
        'GROUP BY county_id',
        'ORDER BY page_views DESC',
        'LIMIT 20',
      ].join('\n'),
    },
    layout: { x: 0, y: 20, w: 12, h: 5 },
  },
]
