import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

describe('refactor: contents.ts uses common.ts helpers', () => {
  it('contents.ts does not manually parse process.argv', () => {
    const src = readFileSync(resolve(__dirname, '../contents.ts'), 'utf8')
    assert.ok(
      !src.includes('process.argv.slice'),
      'contents.ts must not call process.argv.slice — use parseArgs from common.ts instead',
    )
  })
})

describe('refactor: research.ts uses common.ts helpers', () => {
  it('research.ts does not contain raw console.log(JSON.stringify(', () => {
    const src = readFileSync(resolve(__dirname, '../research.ts'), 'utf8')
    assert.ok(
      !src.includes('console.log(JSON.stringify('),
      'research.ts must not call console.log(JSON.stringify() directly — use executeAndPrint from common.ts instead',
    )
  })

  it('research.ts does not manually parse process.argv', () => {
    const src = readFileSync(resolve(__dirname, '../research.ts'), 'utf8')
    assert.ok(
      !src.includes('process.argv.slice'),
      'research.ts must not call process.argv.slice — use parseArgs from common.ts instead',
    )
  })
})
