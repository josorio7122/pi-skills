import { spawnSync } from 'node:child_process'

interface RunResult {
  readonly status: number
  readonly stdout: string
  readonly stderr: string
}

export function runInline(
  code: string,
  env: Record<string, string | undefined> = {},
): RunResult {
  const result = spawnSync('npx', ['tsx', '--eval', code], {
    encoding: 'utf8',
    env: { ...process.env, ...env },
  })
  return {
    status: result.status ?? -1,
    stdout: result.stdout ?? '',
    stderr: result.stderr ?? '',
  }
}

export function runScript(
  scriptPath: string,
  args: readonly string[] = [],
  env: Record<string, string | undefined> = {},
): RunResult {
  const result = spawnSync('npx', ['tsx', scriptPath, ...args], {
    encoding: 'utf8',
    env: { ...process.env, ...env },
  })
  return {
    status: result.status ?? -1,
    stdout: result.stdout ?? '',
    stderr: result.stderr ?? '',
  }
}
