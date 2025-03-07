import { bot } from '#/bot'

bot.use(async ctx => {
  if (ctx.inlineQuery) {
    await ctx.answerInlineQuery([], { cache_time: 0 })
  } else if (ctx.callbackQuery?.data === 'nothing') {
    await ctx.answerCallbackQuery()
  }
})
