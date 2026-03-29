import { spawnSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const STATUS_SCRIPT = path.join(
	__dirname,
	'..',
	'..',
	'skills',
	'posthog-skill',
	'scripts',
	'status.ts',
)

function runScript(env: Record<string, string> = {}): {
	status: number
	stdout: string
	stderr: string
} {
	const result = spawnSync('npx', ['tsx', STATUS_SCRIPT], {
		encoding: 'utf8',
		env: { ...process.env, ...env },
	})
	return {
		status: result.status ?? -1,
		stdout: result.stdout ?? '',
		stderr: result.stderr ?? '',
	}
}

describe('status script', () => {
	it('exits 0 with no token set', () => {
		const result = runScript({ POSTHOG_PERSONAL_API_KEY: '' })
		expect(result.status).toBe(0)
	})

	it('stdout contains NOT SET when no token', () => {
		const result = runScript({ POSTHOG_PERSONAL_API_KEY: '' })
		expect(result.stdout).toContain('NOT SET')
	})

	it('stdout contains masked token when token is set', () => {
		const result = runScript({ POSTHOG_PERSONAL_API_KEY: 'phx_supersecrettoken123' })
		expect(result.stdout).toContain('***')
		expect(result.stdout).not.toContain('supersecrettoken123')
	})

	it('stdout is valid JSON', () => {
		const result = runScript({ POSTHOG_PERSONAL_API_KEY: '' })
		expect(() => JSON.parse(result.stdout)).not.toThrow()
	})

	it('includes project_id in output', () => {
		const result = runScript({
			POSTHOG_PERSONAL_API_KEY: '',
			POSTHOG_PROJECT_ID: 'test-project-123',
		})
		const parsed = JSON.parse(result.stdout) as { project_id: unknown }
		expect(parsed.project_id).toBeTruthy()
	})
})
