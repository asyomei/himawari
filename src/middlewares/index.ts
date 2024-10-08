import { autoRetry } from "@grammyjs/auto-retry"
import { hydrate } from "@grammyjs/hydrate"
import { limit } from "@grammyjs/ratelimiter"
import { apiThrottler } from "@grammyjs/transformer-throttler"
import type { Bot, MiddlewareFn } from "grammy"
import type { MyContext } from "#/types/context"

export function setupMiddlewares(bot: Bot<MyContext>): void {
  bot.use(dropMsgViaMe, userLimit, chatLimit, hydrate())
  bot.api.config.use(autoRetry(), apiThrottler())
}

const dropMsgViaMe: MiddlewareFn<MyContext> = async (ctx, next) => {
  if (ctx.msg?.via_bot?.id !== ctx.me.id) await next()
}

const userLimit = limit<MyContext, never>({
  keyGenerator: ctx => ctx.from?.id.toString(),
})

const chatLimit = limit<MyContext, never>({
  keyGenerator: ctx => ctx.chatId?.toString(),
  timeFrame: 5000,
  limit: 3,
})
