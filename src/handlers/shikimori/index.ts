import { Composer } from "grammy"
import type { MyContext } from "#/types/context"
import {
  animeCallback,
  animeCharactersInline,
  animeChosen,
  animeScreenshotsInline,
  animeVideosInline,
  animes,
  animesCallback,
  animesInline,
} from "./anime"
import {
  characterCallback,
  characterChosen,
  characters,
  charactersCallback,
  charactersInline,
} from "./character"
import {
  mangaCallback,
  mangaCharactersInline,
  mangaChosen,
  mangas,
  mangasCallback,
  mangasInline,
} from "./manga"

const comp = new Composer<MyContext>()
export { comp as shikimoriHandler }

comp.on("message:text").command("help_anime", help)

comp.on("message:text").hears(/^(?:химавари|himawari)\s+(?:аниме|anime)\s+(.+)/i, animes)
comp.inlineQuery(/^(?:аниме|anime)\s+(.+)$/i, animesInline)
comp.chosenInlineResult(/^anime info (\w+)$/, animeChosen)
comp.callbackQuery(/^(\d+) anime search (\d+)$/, animesCallback)
comp.callbackQuery(/^(\d+) anime info (\w+)$/, animeCallback)
comp.inlineQuery(/^!anime screenshots (\w+)$/, animeScreenshotsInline)
comp.inlineQuery(/^!anime videos (\w+)$/, animeVideosInline)
comp.inlineQuery(/^!anime characters (\w+)$/, animeCharactersInline)

comp.on("message:text").hears(/^(?:химавари|himawari)\s+(?:манга|manga)\s(.+)$/i, mangas)
comp.inlineQuery(/^(?:манга|manga)\s+(.+)$/i, mangasInline)
comp.chosenInlineResult(/^manga info (\w+)$/, mangaChosen)
comp.callbackQuery(/^(\d+) manga search (\d+)$/, mangasCallback)
comp.callbackQuery(/^(\d+) manga info (\w+)$/, mangaCallback)
comp.inlineQuery(/^!manga characters (\w+)$/, mangaCharactersInline)

comp
  .on("message:text")
  .hears(/^(?:химавари|himawari)\s+(?:персонаж|character)\s+(.+)$/i, characters)
comp.inlineQuery(/^(?:персонаж|character)\s+(.+)$/i, charactersInline)
comp.chosenInlineResult(/^character info (\w+)$/, characterChosen)
comp.callbackQuery(/^(\d+) character search (\d+)$/, charactersCallback)
comp.callbackQuery(/^(\d+) character info (\w+)$/, characterCallback)

const HELP_TEXT = `<b>Поиск аниме, манги и их персонажей</b>
<i>(используется shikimori api)</i>

химавари аниме [запрос] - поиск аниме
химавари манга [запрос] - поиск манги
химавари персонаж [запрос] - поиск персонажа аниме или манги

<b>Также доступе инлайн режим:</b>
@%s аниме [запрос] - поиск аниме
@%s манга [запрос] - поиск манги
@%s персонаж [запрос] - поиск персонажа аниме или манги`
async function help(ctx: MyContext): Promise<void> {
  await ctx.reply(HELP_TEXT.replaceAll("%s", ctx.me.username), { parse_mode: "HTML" })
}
