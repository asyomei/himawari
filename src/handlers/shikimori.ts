import dedent from 'dedent'
import {
  animeCallback,
  animeCharactersInline,
  animeChosen,
  animeScreenshotsInline,
  animeVideosInline,
  animes,
  animesCallback,
  animesInline,
} from '#/backend/services/shikimori/anime'
import {
  characterCallback,
  characterChosen,
  characters,
  charactersCallback,
  charactersInline,
} from '#/backend/services/shikimori/character'
import {
  mangaCallback,
  mangaCharactersInline,
  mangaChosen,
  mangas,
  mangasCallback,
  mangasInline,
} from '#/backend/services/shikimori/manga'
import { bot } from '#/bot'
import { checkMention } from '#/filters/check-mention'

bot
  .on('message:text')
  .hears(/^(?:\/anime|!аниме)(?:@\w+)?(?:\s+(.+))?$/i)
  .filter(checkMention, animes)
bot.inlineQuery(/^(?:аниме|anime)\s+(.+)$/i, animesInline)
bot.chosenInlineResult(/^anime info (\w+)$/, animeChosen)
bot.callbackQuery(/^(\d+) anime search (\d+)$/, animesCallback)
bot.callbackQuery(/^(\d+) anime info (\w+)$/, animeCallback)
bot.inlineQuery(/^!anime screenshots (\w+)$/, animeScreenshotsInline)
bot.inlineQuery(/^!anime videos (\w+)$/, animeVideosInline)
bot.inlineQuery(/^!anime characters (\w+)$/, animeCharactersInline)

bot
  .on('message:text')
  .hears(/^(?:\/manga|!манга)(?:@\w+)?(?:\s+(.+))?$/i)
  .filter(checkMention, mangas)
bot.inlineQuery(/^(?:манга|manga)\s+(.+)$/i, mangasInline)
bot.chosenInlineResult(/^manga info (\w+)$/, mangaChosen)
bot.callbackQuery(/^(\d+) manga search (\d+)$/, mangasCallback)
bot.callbackQuery(/^(\d+) manga info (\w+)$/, mangaCallback)
bot.inlineQuery(/^!manga characters (\w+)$/, mangaCharactersInline)

bot
  .on('message:text')
  .hears(/^(?:\/char[a-z]*|!перс[а-я]*)(?:@\w+)?(?:\s+(.+))?$/i)
  .filter(checkMention, characters)
bot.inlineQuery(/^(?:перс[а-я]*|char[a-z]*)\s+(.+)$/i, charactersInline)
bot.chosenInlineResult(/^character info (\w+)$/, characterChosen)
bot.callbackQuery(/^(\d+) character search (\d+)$/, charactersCallback)
bot.callbackQuery(/^(\d+) character info (\w+)$/, characterCallback)

const HELP_TEXT = dedent`
  <b>Поиск аниме, манги и их персонажей</b>
  <i>(используется shikimori api)</i>

  !аниме, /anime [запрос] - поиск аниме
  !манга, /manga [запрос] - поиск манги
  !персонаж, /character [запрос] - поиск персонажа аниме или манги

  <b>Также доступен инлайн режим:</b>
  @%s аниме [запрос] - поиск аниме
  @%s манга [запрос] - поиск манги
  @%s персонаж [запрос] - поиск персонажа аниме или манги
`

bot.on('message:text').command('help_anime', async ctx => {
  await ctx.reply(HELP_TEXT.replaceAll('%s', ctx.me.username), { parse_mode: 'HTML' })
})
