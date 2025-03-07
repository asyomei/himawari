import { autoRetry } from '@grammyjs/auto-retry'
import { autoThread } from '@grammyjs/auto-thread'
import { limit } from '@grammyjs/ratelimiter'
import { apiThrottler } from '@grammyjs/transformer-throttler'
import type { NextFunction } from 'grammy'
import { bot } from '#/bot'
import type { MyContext } from '#/types/context'

const userLimit = limit({
  keyGenerator: ctx => ctx.from?.id.toString(),
  limit: 1,
  timeFrame: 1000,
})

const chatLimit = limit<MyContext, never>({
  keyGenerator: ctx => ctx.chatId?.toString(),
  timeFrame: 5000,
  limit: 3,
})

const notViaMe = (ctx: MyContext, next: NextFunction) =>
  ctx.msg?.via_bot?.id !== ctx.me.id && next()

bot.use(notViaMe, userLimit, chatLimit, autoThread())
bot.api.config.use(autoRetry(), apiThrottler())
