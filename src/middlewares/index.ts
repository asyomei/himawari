import { autoRetry } from "@grammyjs/auto-retry"
import { autoThread } from "@grammyjs/auto-thread"
import { hydrate } from "@grammyjs/hydrate"
import { limit } from "@grammyjs/ratelimiter"
import { apiThrottler } from "@grammyjs/transformer-throttler"
import type { Bot } from "grammy"
import type { MyContext } from "#/types/context"
import { dropMsgViaMe } from "./drop-msg-via-me"

export function setupMiddlewares(bot: Bot<MyContext>): void {
  bot.use(dropMsgViaMe, userLimit, chatLimit, autoThread(), hydrate())
  bot.api.config.use(autoRetry(), apiThrottler())
}

const userLimit = limit<MyContext, never>({
  keyGenerator: ctx => ctx.from?.id.toString(),
})

const chatLimit = limit<MyContext, never>({
  keyGenerator: ctx => ctx.chatId?.toString(),
  timeFrame: 5000,
  limit: 3,
})
