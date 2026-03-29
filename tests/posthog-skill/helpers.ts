import { spawnSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export const RUN = path.join(__dirname, '..', '..', 'skills', 'posthog-skill', 'scripts', 'run.ts')

export function run(
  args: string[] = [],
  env: Record<string, string> = {},
  options: { timeout?: number } = {},
): { status: number; stdout: string; stderr: string } {
  const result = spawnSync('npx', ['tsx', RUN, ...args], {
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
