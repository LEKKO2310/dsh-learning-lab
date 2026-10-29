/** Runs the official tutorial launcher against the local YAML composition. */
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { test } from 'node:test'

test('cordis.yml loads hello-plugin through the official launcher', () => {
  const result = spawnSync(process.execPath, ['--import', 'tsx', '../../vendor/cordis/bin.js'], {
    cwd: new URL('.', import.meta.url),
    encoding: 'utf8',
    timeout: 15_000,
  })
  assert.ifError(result.error)
  assert.equal(result.status, 0, result.stderr)
  assert.equal(result.stderr, '')
  assert.equal(result.stdout.trim(), '[hello] initialized: hello-plugin')
  console.log(result.stdout.trim())
})
