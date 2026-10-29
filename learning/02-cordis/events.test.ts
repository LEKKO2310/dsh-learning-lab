/** Checks event delivery before disposal and listener removal afterwards. */
import assert from 'node:assert/strict'
import { test } from 'node:test'
import { Context } from '@deepseek-ai/cordis'
import * as hello from './hello-plugin.ts'

test('unloading hello removes only its listeners and rejects new registrations', async (t) => {
  const ctx = new Context()
  t.after(() => ctx.fiber.dispose())
  const messages: string[] = []
  const log = console.log.bind(console)
  t.mock.method(console, 'log', (message: string) => {
    messages.push(message)
    log(message)
  })
  let rootDeliveries = 0
  ctx.on('learning/hello', () => { rootDeliveries++ })
  const fiber = await ctx.plugin(hello)
  ctx.emit('learning/hello', 'before disposal')
  assert.deepEqual(messages.filter(line => line.startsWith('[hello] received:')), [
    '[hello] received: before disposal',
  ])

  await fiber.dispose()
  ctx.emit('learning/hello', 'after disposal')
  assert.equal(rootDeliveries, 2)
  assert.equal(messages.filter(line => line.startsWith('[hello] received:')).length, 1)
  assert.equal(fiber.getEffects().length, 0)
  assert.throws(() => fiber.ctx.on('learning/hello', () => {}), { code: 'INACTIVE_EFFECT' })
  assert.throws(() => fiber.ctx.effect(() => () => {}), { code: 'INACTIVE_EFFECT' })
  assert.throws(() => fiber.ctx.plugin(hello), { code: 'INACTIVE_EFFECT' })
  console.log('[events] after disposal: hello deliveries=1, root deliveries=2, effects=0')
  console.log('[events] disposed context rejects on/effect/plugin: INACTIVE_EFFECT')

  const replacement = await ctx.plugin(hello)
  ctx.emit('learning/hello', 'after remount')
  assert.deepEqual(messages.filter(line => line.startsWith('[hello] received:')), [
    '[hello] received: before disposal',
    '[hello] received: after remount',
  ])
  assert.equal(rootDeliveries, 3)
  await replacement.dispose()
  console.log('[events] remount: exactly one new hello delivery; no accumulated listener')
})
