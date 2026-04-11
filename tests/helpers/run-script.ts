import { spawnSync } from 'node:child_process'

interface RunResult {
  readonly status: number
  readonly stdout: string
  readonly stderr: string
}

export function runInline(code: string, env: Record<string, string | undefined> = {}): RunResult {
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

interface RunScriptParams {
  readonly scriptPath: string
  readonly args?: readonly string[]
  readonly env?: Record<string, string | undefined>
}

export function runScript({ scriptPath, args = [], env = {} }: RunScriptParams): RunResult {
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
