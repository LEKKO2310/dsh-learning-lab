/** A named service used to observe dependency activation and withdrawal. */
import { Service, type Context } from '@deepseek-ai/cordis'

declare module '@deepseek-ai/cordis' {
  interface Context {
    learningGreeter: LearningGreeter
  }
}

/** Provides greetings while this service's fiber is active. */
export class LearningGreeter extends Service {
  constructor(ctx: Context) {
    super(ctx, 'learningGreeter')
  }

  /**
   * Format a greeting for a consumer.
   * @param who Greeting recipient.
   * @returns A greeting addressed to the recipient.
   */
  greet(who: string) {
    return `Hello, ${who}!`
  }
}
