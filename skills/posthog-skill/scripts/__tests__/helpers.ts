import { spawnSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export const TSX = path.join(__dirname, '..', '..', '..', '..', 'node_modules', '.bin', 'tsx')
export const RUN = path.join(__dirname, '..', 'run.ts')
export const LIVE = Boolean(process.env['POSTHOG_TEST_LIVE'])

export function run(
  args: string[] = [],
  env: Record<string, string> = {},
  options: { timeout?: number } = {},
): { status: number; stdout: string; stderr: string } {
  const result = spawnSync(TSX, [RUN, ...args], {
    encoding: 'utf8',
    env: { ...process.env, ...env },
    timeout: options.timeout,
  })
  return {
    status: result.status ?? -1,
    stdout: result.stdout,
    stderr: result.stderr,
  }
}
