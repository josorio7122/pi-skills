import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const SKILL_ROOT = resolve(__dirname, '../../skills/posthog-skill')
const LIB = resolve(SKILL_ROOT, 'scripts/lib')
const SCRIPTS = resolve(SKILL_ROOT, 'scripts')

// ---------------------------------------------------------------------------
// Config module
// ---------------------------------------------------------------------------

describe('cmd-modules: lib/config.ts exists', () => {
  it('lib/config.ts file exists', () => {
    assert.ok(existsSync(resolve(LIB, 'config.ts')), 'lib/config.ts must exist')
  })
})

describe('cmd-modules: lib/config.ts exports resolveConfig', () => {
  it('config.ts exports resolveConfig function', () => {
    const src = readFileSync(resolve(LIB, 'config.ts'), 'utf8')
    const hasExport =
      src.includes('export function resolveConfig') || src.includes('export { resolveConfig')
    assert.ok(hasExport, 'config.ts must export resolveConfig')
  })
})

describe('cmd-modules: lib/config.ts exports out and info helpers', () => {
  it('config.ts exports out function', () => {
    const src = readFileSync(resolve(LIB, 'config.ts'), 'utf8')
    const hasOut = src.includes('export function out') || src.includes('export { out')
    assert.ok(hasOut, 'config.ts must export the out() helper function')
  })

  it('config.ts exports info function', () => {
    const src = readFileSync(resolve(LIB, 'config.ts'), 'utf8')
    const hasInfo = src.includes('export function info') || src.includes('export { info')
    assert.ok(hasInfo, 'config.ts must export the info() helper function')
  })
})

describe('cmd-modules: lib/config.ts exports handleApiError', () => {
  it('config.ts exports handleApiError function', () => {
    const src = readFileSync(resolve(LIB, 'config.ts'), 'utf8')
    const hasExport =
      src.includes('export function handleApiError') || src.includes('export { handleApiError')
    assert.ok(hasExport, 'config.ts must export handleApiError')
  })
})

// ---------------------------------------------------------------------------
// Command modules
// ---------------------------------------------------------------------------

describe('cmd-modules: lib/cmd-status.ts exists', () => {
  it('lib/cmd-status.ts file exists', () => {
    assert.ok(existsSync(resolve(LIB, 'cmd-status.ts')), 'lib/cmd-status.ts must exist')
  })
})

describe('cmd-modules: lib/cmd-flags.ts exists', () => {
  it('lib/cmd-flags.ts file exists', () => {
    assert.ok(existsSync(resolve(LIB, 'cmd-flags.ts')), 'lib/cmd-flags.ts must exist')
  })
})

// ---------------------------------------------------------------------------
// Slim run.ts
// ---------------------------------------------------------------------------

describe('cmd-modules: run.ts is under 80 lines', () => {
  it('run.ts has 80 or fewer lines', () => {
    const src = readFileSync(resolve(SCRIPTS, 'run.ts'), 'utf8')
    const lineCount = src.split('\n').length
    assert.ok(lineCount <= 80, `run.ts must be ≤ 80 lines, but has ${lineCount} lines`)
  })
})
