/** Checks explicit disposal, remounting, child ownership, and async cleanup. */
import assert from 'node:assert/strict'
import { test } from 'node:test'
import { Context, FiberState } from '@deepseek-ai/cordis'
import * as hello from './hello-plugin.ts'

test('hello initializes, unloads once, and can be mounted as a new fiber', async (t) => {
  const ctx = new Context()
  t.after(() => ctx.fiber.dispose())
  const states: number[] = []
  ctx.on('internal/status', (fiber) => {
    if (fiber.name === hello.name) states.push(fiber.state)
  })
  const fiber = await ctx.plugin(hello)
  assert.equal(fiber.state, FiberState.ACTIVE)
  let cleanups = 0
  fiber.ctx.effect(() => () => { cleanups++ })
  await fiber.dispose()
  await fiber.dispose()
  assert.equal(cleanups, 1)
  assert.equal(fiber.state, FiberState.DISPOSED)
  assert.equal(ctx.registry.has(hello), false)
  assert.deepEqual(states, [FiberState.LOADING, FiberState.ACTIVE, FiberState.UNLOADING, FiberState.DISPOSED])
  console.log('[lifecycle] LOADING -> ACTIVE -> UNLOADING -> DISPOSED; cleanup=1')

  const replacement = await ctx.plugin(hello)
  assert.notEqual(replacement, fiber)
  assert.equal(replacement.state, FiberState.ACTIVE)
  await replacement.dispose()
  console.log('[lifecycle] new fiber mounted and disposed')
})

test('parent disposal waits for async effects and disposes its hello child', async (t) => {
  const ctx = new Context()
  const entered = Promise.withResolvers<void>()
  const release = Promise.withResolvers<void>()
  t.after(() => {
    release.resolve()
    return ctx.fiber.dispose()
  })
  let cleaned = false
  const parent = await ctx.plugin(() => {})
  const child = await parent.ctx.plugin(hello)
  parent.ctx.effect(() => async () => {
    entered.resolve()
    await release.promise
    cleaned = true
  })

  const disposing = parent.dispose()
  await entered.promise
  assert.equal(parent.state, FiberState.UNLOADING)
  assert.equal(cleaned, false)
  console.log('[lifecycle] async cleanup entered; parent=UNLOADING')
  release.resolve()
  await disposing
  assert.equal(cleaned, true)
  assert.equal(parent.state, FiberState.DISPOSED)
  assert.equal(child.state, FiberState.DISPOSED)
  assert.equal(ctx.registry.has(hello), false)
  console.log('[lifecycle] async cleanup finished; parent and child=DISPOSED')
})
