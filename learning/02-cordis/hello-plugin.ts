/** Minimal plugin loaded by the Cordis tutorial configuration. */
import type { Context } from '@deepseek-ai/cordis'

/** Display name used in fiber diagnostics. */
export const name = 'hello-plugin'

/**
 * Print a greeting when the plugin initializes.
 * @param ctx Plugin-owned context.
 */
export function apply(ctx: Context) {
  console.log(`[hello] initialized: ${ctx.fiber.name}`)
  ctx.effect(() => () => console.log('[hello] disposed'))
}
