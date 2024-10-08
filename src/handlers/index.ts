import type { Bot, MiddlewareFn } from "grammy"
import type { MyContext } from "#/types/context"
import { chatAiHandler } from "./chat-ai"
import { shikimoriHandler } from "./shikimori"
import { startHandler } from "./start"

export function setupHandlers(bot: Bot<MyContext>): void {
  bot.use(startHandler, chatAiHandler, shikimoriHandler)
  bot.use(onUnhandled)
}

const onUnhandled: MiddlewareFn<MyContext> = async ctx => {
  if (ctx.inlineQuery) {
    await ctx.answerInlineQuery([], { cache_time: 0 })
  } else if (ctx.callbackQuery?.data === "nothing") {
    await ctx.answerCallbackQuery()
  }
}
