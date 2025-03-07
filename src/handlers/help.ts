import dedent from 'dedent'
import { bot } from '#/bot'

const HELP_TEXT = dedent`
  /help_anime - поиск аниме, манги и персонажей
`

bot.on('message:text').command('help', async ctx => {
  await ctx.reply(HELP_TEXT)
})
