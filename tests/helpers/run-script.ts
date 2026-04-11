import type { SpawnSyncReturns } from 'node:child_process'
import { spawnSync } from 'node:child_process'

interface RunResult {
  readonly status: number
  readonly stdout: string
  readonly stderr: string
}

function toRunResult(result: SpawnSyncReturns<string>): RunResult {
  return {
    status: result.status ?? -1,
    stdout: result.stdout ?? '',
    stderr: result.stderr ?? '',
  }
}

export function runInline(code: string, env: Record<string, string | undefined> = {}): RunResult {
  return toRunResult(
    spawnSync('npx', ['tsx', '--eval', code], {
      encoding: 'utf8',
      env: { ...process.env, ...env },
    }),
  )
}

interface RunScriptParams {
  readonly scriptPath: string
  readonly args?: readonly string[]
  readonly env?: Record<string, string | undefined>
}

export function runScript({ scriptPath, args = [], env = {} }: RunScriptParams): RunResult {
  return toRunResult(
    spawnSync('npx', ['tsx', scriptPath, ...args], {
      encoding: 'utf8',
      env: { ...process.env, ...env },
    }),
  )
}
