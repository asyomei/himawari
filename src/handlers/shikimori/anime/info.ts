import { type CallbackQueryContext, InlineKeyboard } from "grammy"
import type { Message } from "grammy/types"
import type { MyContext } from "#/types/context"
import { api } from "./api"
import { makeAnimeInfoText } from "./info-text"

export async function animeCallback(ctx: CallbackQueryContext<MyContext>): Promise<void> {
  const fromId = Number(ctx.match[1]!)
  const animeId = ctx.match[2]!

  if (fromId !== ctx.from.id) {
    await ctx.answerCallbackQuery("Эта кнопка не для вас")
    return
  }

  const anime = await api.info(animeId)
  if (!anime) {
    await ctx.answerCallbackQuery("Аниме не найдено")
    return
  }

  const text = makeAnimeInfoText(anime)
  await ctx.answerCallbackQuery()

  let m: Message | undefined
  if (anime.poster?.originalUrl) {
    m = await ctx.replyWithPhoto(anime.poster.originalUrl, {
      caption: [anime.russian, anime.name].join(" | "),
      has_spoiler: anime.isCensored,
    })
  }

  await ctx.reply(text, {
    reply_parameters: m && { message_id: m.message_id },
    link_preview_options: { is_disabled: true },
    parse_mode: "HTML",
    reply_markup: makeAnimeInfoInlineKeyboard(anime),
  })
}

export async function animeChosen(
  ctx: MyContext & { match: string | RegExpMatchArray },
): Promise<void> {
  const animeId = ctx.match[1]!

  const anime = await api.info(animeId)
  if (!anime) {
    await ctx.editMessageText("Аниме не найдено")
    return
  }

  await ctx.editMessageText(makeAnimeInfoText(anime), {
    link_preview_options:
      !anime.isCensored || anime.poster?.originalUrl
        ? { show_above_text: true, url: anime.poster.originalUrl }
        : { is_disabled: true },
    parse_mode: "HTML",
    reply_markup: makeAnimeInfoInlineKeyboard(anime),
  })
}

function makeAnimeInfoInlineKeyboard(anime: any): InlineKeyboard {
  const kb = new InlineKeyboard()

  kb.switchInlineCurrent("Скриншоты", `!anime screenshots ${anime.id}`)
    .switchInlineCurrent("Видео", `!anime videos ${anime.id}`)
    .row()
    .switchInlineCurrent("Персонажи", `!anime characters ${anime.id}`)
    .row()
    .url("Shikimori", anime.url)

  return kb
}
