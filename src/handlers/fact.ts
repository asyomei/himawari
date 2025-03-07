import { getFact, getRandomFact } from '#/backend/services/fact'
import { bot } from '#/bot'

bot.on('message:text').command('fact', async ctx => {
  const id = Number.parseInt(ctx.match)
  const fact = Number.isNaN(id) ? await getRandomFact() : await getFact(id)

  await ctx.reply(`${fact.text}\n\n<a href="${fact.url}">Факт ${fact.info}</a>`, {
    parse_mode: 'HTML',
    link_preview_options: { is_disabled: true },
  })
})
