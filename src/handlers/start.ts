import { bot } from '#/bot'

bot.on('message:text').command('start', async ctx => {
  await ctx.reply(`Привет, ${ctx.from.first_name}`)
})
