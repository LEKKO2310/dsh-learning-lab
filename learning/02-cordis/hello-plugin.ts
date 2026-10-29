/** Minimal plugin loaded by the Cordis tutorial configuration. */
import type { Context } from '@deepseek-ai/cordis'

declare module '@deepseek-ai/cordis' {
  interface Events {
    /**
     * Notify hello listeners with a message.
     * @mode emit
     * @param message Greeting text.
     */
    'learning/hello'(message: string): void
  }
}

/** Display name used in fiber diagnostics. */
export const name = 'hello-plugin'

/**
 * Print a greeting when the plugin initializes.
 * @param ctx Plugin-owned context.
 */
export function apply(ctx: Context) {
  console.log(`[hello] initialized: ${ctx.fiber.name}`)
  ctx.effect(() => () => console.log('[hello] disposed'))
  ctx.on('learning/hello', message => console.log(`[hello] received: ${message}`))
}
