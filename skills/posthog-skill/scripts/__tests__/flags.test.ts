import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const TSX = path.join(__dirname, '..', '..', '..', '..', 'node_modules', '.bin', 'tsx')
const RUN = path.join(__dirname, '..', 'run.ts')

function run(
  args: string[] = [],
  env: Record<string, string> = {},
): { status: number | null; stdout: string; stderr: string } {
  return spawnSync(TSX, [RUN, ...args], {
    encoding: 'utf8',
    env: { ...process.env, ...env },
  })
}

describe('flags --dry-run (list)', () => {
  it('exits 0', () => {
    const result = run(['flags', '--dry-run'], { POSTHOG_PERSONAL_API_KEY: '' })
    assert.strictEqual(result.status, 0, `expected exit 0\n${result.stderr}`)
  })

  it('stdout is valid JSON', () => {
    const result = run(['flags', '--dry-run'], { POSTHOG_PERSONAL_API_KEY: '' })
    assert.doesNotThrow(() => JSON.parse(result.stdout), `not valid JSON:\n${result.stdout}`)
  })

  it('output has results array', () => {
    const result = run(['flags', '--dry-run'], { POSTHOG_PERSONAL_API_KEY: '' })
    const parsed = JSON.parse(result.stdout) as { results: unknown }
    assert.ok(Array.isArray(parsed.results), 'output must have results array')
  })

  it('output has count number', () => {
    const result = run(['flags', '--dry-run'], { POSTHOG_PERSONAL_API_KEY: '' })
    const parsed = JSON.parse(result.stdout) as { count: unknown }
    assert.strictEqual(typeof parsed.count, 'number', 'output must have count as a number')
  })

  it('each result has id, key, name, active fields', () => {
    const result = run(['flags', '--dry-run'], { POSTHOG_PERSONAL_API_KEY: '' })
    const parsed = JSON.parse(result.stdout) as {
      results: Array<{ id: unknown; key: unknown; name: unknown; active: unknown }>
    }
    for (const flag of parsed.results) {
      assert.ok(flag.id !== undefined, `flag missing id: ${JSON.stringify(flag)}`)
      assert.ok(flag.key !== undefined, `flag missing key: ${JSON.stringify(flag)}`)
      assert.ok(flag.name !== undefined, `flag missing name: ${JSON.stringify(flag)}`)
      assert.ok(flag.active !== undefined, `flag missing active: ${JSON.stringify(flag)}`)
    }
  })
})

describe('flags get --dry-run', () => {
  it('exits 0', () => {
    const result = run(['flags', 'get', '123', '--dry-run'], { POSTHOG_PERSONAL_API_KEY: '' })
    assert.strictEqual(result.status, 0, `expected exit 0\n${result.stderr}`)
  })

  it('stdout is valid JSON', () => {
    const result = run(['flags', 'get', '123', '--dry-run'], { POSTHOG_PERSONAL_API_KEY: '' })
    assert.doesNotThrow(() => JSON.parse(result.stdout), `not valid JSON:\n${result.stdout}`)
  })

  it('output has id, key, name, active, filters, created_at fields', () => {
    const result = run(['flags', 'get', '123', '--dry-run'], { POSTHOG_PERSONAL_API_KEY: '' })
    const parsed = JSON.parse(result.stdout) as Record<string, unknown>
    assert.ok(parsed['id'] !== undefined, 'output must have id')
    assert.ok(parsed['key'] !== undefined, 'output must have key')
    assert.ok(parsed['name'] !== undefined, 'output must have name')
    assert.ok(parsed['active'] !== undefined, 'output must have active')
    assert.ok(parsed['filters'] !== undefined, 'output must have filters')
    assert.ok(parsed['created_at'] !== undefined, 'output must have created_at')
  })
})

describe('flags toggle --dry-run', () => {
  it('exits 0', () => {
    const result = run(['flags', 'toggle', '123', '--dry-run'], { POSTHOG_PERSONAL_API_KEY: '' })
    assert.strictEqual(result.status, 0, `expected exit 0\n${result.stderr}`)
  })

  it('stdout is valid JSON', () => {
    const result = run(['flags', 'toggle', '123', '--dry-run'], { POSTHOG_PERSONAL_API_KEY: '' })
    assert.doesNotThrow(() => JSON.parse(result.stdout), `not valid JSON:\n${result.stdout}`)
  })

  it('output has id, key, active_before, active_after fields', () => {
    const result = run(['flags', 'toggle', '123', '--dry-run'], { POSTHOG_PERSONAL_API_KEY: '' })
    const parsed = JSON.parse(result.stdout) as Record<string, unknown>
    assert.ok(parsed['id'] !== undefined, 'output must have id')
    assert.ok(parsed['key'] !== undefined, 'output must have key')
    assert.ok(parsed['active_before'] !== undefined, 'output must have active_before')
    assert.ok(parsed['active_after'] !== undefined, 'output must have active_after')
  })

  it('active_before and active_after are different (boolean flip)', () => {
    const result = run(['flags', 'toggle', '123', '--dry-run'], { POSTHOG_PERSONAL_API_KEY: '' })
    const parsed = JSON.parse(result.stdout) as {
      active_before: boolean
      active_after: boolean
    }
    assert.notStrictEqual(
      parsed.active_before,
      parsed.active_after,
      `active_before (${parsed.active_before}) must differ from active_after (${parsed.active_after})`,
    )
  })
})

describe('flags create --dry-run', () => {
  it('exits 0', () => {
    const result = run(['flags', 'create', 'my-new-flag', '--dry-run'], {
      POSTHOG_PERSONAL_API_KEY: '',
    })
    assert.strictEqual(result.status, 0, `expected exit 0\n${result.stderr}`)
  })

  it('stdout is valid JSON', () => {
    const result = run(['flags', 'create', 'my-new-flag', '--dry-run'], {
      POSTHOG_PERSONAL_API_KEY: '',
    })
    assert.doesNotThrow(() => JSON.parse(result.stdout), `not valid JSON:\n${result.stdout}`)
  })

  it('output has id, key, name, active fields', () => {
    const result = run(['flags', 'create', 'my-new-flag', '--dry-run'], {
      POSTHOG_PERSONAL_API_KEY: '',
    })
    const parsed = JSON.parse(result.stdout) as Record<string, unknown>
    assert.ok(parsed['id'] !== undefined, 'output must have id')
    assert.ok(parsed['key'] !== undefined, 'output must have key')
    assert.ok(parsed['name'] !== undefined, 'output must have name')
    assert.ok(parsed['active'] !== undefined, 'output must have active')
  })
})

describe('flags update --dry-run', () => {
  it('exits 0', () => {
    const result = run(['flags', 'update', '123', '--dry-run'], { POSTHOG_PERSONAL_API_KEY: '' })
    assert.strictEqual(result.status, 0, `expected exit 0\n${result.stderr}`)
  })

  it('stdout is valid JSON', () => {
    const result = run(['flags', 'update', '123', '--dry-run'], { POSTHOG_PERSONAL_API_KEY: '' })
    assert.doesNotThrow(() => JSON.parse(result.stdout), `not valid JSON:\n${result.stdout}`)
  })

  it('output has id, key, name fields', () => {
    const result = run(['flags', 'update', '123', '--dry-run'], { POSTHOG_PERSONAL_API_KEY: '' })
    const parsed = JSON.parse(result.stdout) as Record<string, unknown>
    assert.ok(parsed['id'] !== undefined, 'output must have id')
    assert.ok(parsed['key'] !== undefined, 'output must have key')
    assert.ok(parsed['name'] !== undefined, 'output must have name')
  })
})

describe('flags activity --dry-run', () => {
  it('exits 0', () => {
    const result = run(['flags', 'activity', '123', '--dry-run'], {
      POSTHOG_PERSONAL_API_KEY: '',
    })
    assert.strictEqual(result.status, 0, `expected exit 0\n${result.stderr}`)
  })

  it('stdout is valid JSON', () => {
    const result = run(['flags', 'activity', '123', '--dry-run'], {
      POSTHOG_PERSONAL_API_KEY: '',
    })
    assert.doesNotThrow(() => JSON.parse(result.stdout), `not valid JSON:\n${result.stdout}`)
  })

  it('output has results array', () => {
    const result = run(['flags', 'activity', '123', '--dry-run'], {
      POSTHOG_PERSONAL_API_KEY: '',
    })
    const parsed = JSON.parse(result.stdout) as { results: unknown }
    assert.ok(Array.isArray(parsed.results), 'output must have results array')
  })

  it('each result has activity and created_at fields', () => {
    const result = run(['flags', 'activity', '123', '--dry-run'], {
      POSTHOG_PERSONAL_API_KEY: '',
    })
    const parsed = JSON.parse(result.stdout) as {
      results: Array<{ activity: unknown; created_at: unknown }>
    }
    for (const entry of parsed.results) {
      assert.ok(entry.activity !== undefined, `entry missing activity: ${JSON.stringify(entry)}`)
      assert.ok(
        entry.created_at !== undefined,
        `entry missing created_at: ${JSON.stringify(entry)}`,
      )
    }
  })
})

describe('flags argument validation', () => {
  it('get with no ID exits 2 and stderr mentions required or missing', () => {
    const result = run(['flags', 'get'], { POSTHOG_PERSONAL_API_KEY: '' })
    assert.strictEqual(result.status, 2, `expected exit 2\n${result.stderr}`)
    assert.match(
      result.stderr,
      /required|missing/i,
      'stderr should mention "required" or "missing"',
    )
  })

  it('toggle with no ID exits 2', () => {
    const result = run(['flags', 'toggle'], { POSTHOG_PERSONAL_API_KEY: '' })
    assert.strictEqual(result.status, 2, `expected exit 2\n${result.stderr}`)
    assert.doesNotMatch(result.stderr, /Unknown command/i, 'flags command must be recognised')
  })

  it('create with no key exits 2', () => {
    const result = run(['flags', 'create'], { POSTHOG_PERSONAL_API_KEY: '' })
    assert.strictEqual(result.status, 2, `expected exit 2\n${result.stderr}`)
    assert.doesNotMatch(result.stderr, /Unknown command/i, 'flags command must be recognised')
  })

  it('update with no ID exits 2', () => {
    const result = run(['flags', 'update'], { POSTHOG_PERSONAL_API_KEY: '' })
    assert.strictEqual(result.status, 2, `expected exit 2\n${result.stderr}`)
    assert.doesNotMatch(result.stderr, /Unknown command/i, 'flags command must be recognised')
  })

  it('activity with no ID exits 2', () => {
    const result = run(['flags', 'activity'], { POSTHOG_PERSONAL_API_KEY: '' })
    assert.strictEqual(result.status, 2, `expected exit 2\n${result.stderr}`)
    assert.doesNotMatch(result.stderr, /Unknown command/i, 'flags command must be recognised')
  })

  it('unknown subcommand exits 2 and stderr mentions unknown', () => {
    const result = run(['flags', 'nonsense'], { POSTHOG_PERSONAL_API_KEY: '' })
    assert.strictEqual(result.status, 2, `expected exit 2\n${result.stderr}`)
    assert.match(result.stderr, /unknown/i, 'stderr should mention "unknown"')
    assert.doesNotMatch(
      result.stderr,
      /Unknown command: flags/i,
      'flags command must be recognised',
    )
  })
})

describe('flags without token (no --dry-run)', () => {
  it('flags list with no token exits 1 and stderr mentions POSTHOG_PERSONAL_API_KEY', () => {
    const result = run(['flags'], { POSTHOG_PERSONAL_API_KEY: '' })
    assert.strictEqual(result.status, 1, `expected exit 1\n${result.stderr}`)
    assert.match(
      result.stderr,
      /POSTHOG_PERSONAL_API_KEY/i,
      'stderr should mention POSTHOG_PERSONAL_API_KEY',
    )
  })

  it('flags get with no token exits 1', () => {
    const result = run(['flags', 'get', '123'], { POSTHOG_PERSONAL_API_KEY: '' })
    assert.strictEqual(result.status, 1, `expected exit 1\n${result.stderr}`)
  })
})

describe('flags list with filter options --dry-run', () => {
  it('--search param is accepted and exits 0', () => {
    const result = run(['flags', '--search', 'checkout', '--dry-run'], {
      POSTHOG_PERSONAL_API_KEY: '',
    })
    assert.strictEqual(result.status, 0, `expected exit 0\n${result.stderr}`)
  })

  it('--active param is accepted and exits 0', () => {
    const result = run(['flags', '--active', 'true', '--dry-run'], {
      POSTHOG_PERSONAL_API_KEY: '',
    })
    assert.strictEqual(result.status, 0, `expected exit 0\n${result.stderr}`)
  })

  it('--type param is accepted and exits 0', () => {
    const result = run(['flags', '--type', 'boolean', '--dry-run'], {
      POSTHOG_PERSONAL_API_KEY: '',
    })
    assert.strictEqual(result.status, 0, `expected exit 0\n${result.stderr}`)
  })

  it('--limit param is accepted and exits 0', () => {
    const result = run(['flags', '--limit', '5', '--dry-run'], { POSTHOG_PERSONAL_API_KEY: '' })
    assert.strictEqual(result.status, 0, `expected exit 0\n${result.stderr}`)
  })
})

describe('flags create with --name option --dry-run', () => {
  it('create with key and --name exits 0', () => {
    const result = run(['flags', 'create', 'my-flag', '--name', 'My Flag', '--dry-run'], {
      POSTHOG_PERSONAL_API_KEY: '',
    })
    assert.strictEqual(result.status, 0, `expected exit 0\n${result.stderr}`)
  })
})
