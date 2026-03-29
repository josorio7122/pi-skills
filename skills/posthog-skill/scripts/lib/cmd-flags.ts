import { out, requireToken, handleApiError } from './config.js'
import type { AppConfig } from './config.js'
import { getFixture } from './fixtures.js'
import { createClient } from './posthog-client.js'

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

export async function cmdFlags(args: string[], config: AppConfig): Promise<void> {
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
