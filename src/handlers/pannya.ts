import { bot } from '#/bot'
import { InputFile } from 'grammy'

bot.command('pannya', async ctx => {
  await ctx.replyWithVideo(new InputFile('assets/Pannya-Chan.mp4'))
})
