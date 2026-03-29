#!/usr/bin/env node

import { resolveConfig } from './lib/config.js'
import { cmdStatus } from './lib/cmd-status.js'
import { cmdFlags } from './lib/cmd-flags.js'

function cmdHelp(): void {
  process.stderr.write(
    'posthog-skill — PostHog automation (status, feature flags)\n\n' +
      'Usage: node scripts/run.js <command> [options]\n\n' +
      'Commands: status | flags [subcommand]\n' +
      'Options:  --dry-run  --help\n\n' +
      'Env: POSTHOG_PERSONAL_API_KEY  POSTHOG_PROJECT_ID  POSTHOG_HOST\n',
  )
}

async function main(): Promise<void> {
  const args = process.argv.slice(2)

  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    cmdHelp()
    process.exit(0)
  }

  const command = args[0]
  if (command === undefined) {
    cmdHelp()
    process.exit(0)
  }

  const flags = args.slice(1)
  const config = resolveConfig()

  switch (command) {
    case 'status':
      cmdStatus(config)
      break
    case 'flags':
      await cmdFlags(flags, config)
      break
    default:
      process.stderr.write(`Unknown command: ${command}\nRun with --help for usage.\n`)
      process.exit(2)
  }
}

main().catch((err) => {
  process.stderr.write(`Fatal: ${err instanceof Error ? err.message : String(err)}\n`)
  process.exit(1)
})
