/** Checks dynamic inject dependencies using a minimal Service provider. */
import assert from 'node:assert/strict'
import { test } from 'node:test'
import { Context, FiberState } from '@deepseek-ai/cordis'
import { LearningGreeter } from './greeter.ts'
import type {} from './hello-plugin.ts'

test('inject waits, withdraws the consumer, and reactivates it with a new provider', async (t) => {
  const ctx = new Context()
  t.after(() => ctx.fiber.dispose())
  const greetings: string[] = []
  let activations = 0
  let cleanups = 0
  const consumer = ctx.plugin({
    name: 'learning-consumer',
    inject: ['learningGreeter'],
    apply(scope: Context) {
      activations++
      scope.on('learning/hello', who => greetings.push(scope.learningGreeter.greet(who)))
      scope.effect(() => () => { cleanups++ })
    },
  })
  assert.equal(consumer.state, FiberState.PENDING)
  assert.equal(activations, 0)
  console.log('[inject] consumer declared first: PENDING, activations=0')

  const provider = await ctx.plugin(LearningGreeter)
  await consumer
  assert.equal(consumer.state, FiberState.ACTIVE)
  ctx.emit('learning/hello', 'first provider')
  assert.deepEqual(greetings, ['Hello, first provider!'])
  console.log(`[inject] provider available: ACTIVE, ${greetings[0]}`)

  await provider.dispose()
  await consumer
  assert.equal(consumer.state, FiberState.PENDING)
  assert.equal(ctx.get('learningGreeter'), undefined)
  assert.equal(cleanups, 1)
  ctx.emit('learning/hello', 'missing provider')
  assert.equal(greetings.length, 1)
  console.log('[inject] provider removed: service=undefined, consumer=PENDING, cleanup=1, no delivery')

  const replacement = await ctx.plugin(LearningGreeter)
  await consumer
  assert.equal(consumer.state, FiberState.ACTIVE)
  assert.equal(activations, 2)
  ctx.emit('learning/hello', 'replacement provider')
  assert.deepEqual(greetings, ['Hello, first provider!', 'Hello, replacement provider!'])
  console.log(`[inject] provider restored: ACTIVE, activations=2, ${greetings[1]}`)

  await consumer.dispose()
  await replacement.dispose()
  assert.equal(consumer.state, FiberState.DISPOSED)
  assert.equal(ctx.get('learningGreeter'), undefined)
  assert.equal(cleanups, 2)
  console.log('[inject] explicit disposal: consumer=DISPOSED, service=undefined, cleanup=2')
})
