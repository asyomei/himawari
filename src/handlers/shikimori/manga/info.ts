import { type CallbackQueryContext, InlineKeyboard } from "grammy"
import type { Message } from "grammy/types"
import type { MyContext } from "#/types/context"
import { api } from "./api"
import { makeMangaInfoText } from "./info-text"

export async function mangaCallback(ctx: CallbackQueryContext<MyContext>): Promise<void> {
  const fromId = Number(ctx.match[1]!)
  const mangaId = ctx.match[2]!

  if (fromId !== ctx.from.id) {
    await ctx.answerCallbackQuery("Эта кнопка не для вас")
    return
  }

  const manga = await api.info(mangaId)
  if (!manga) {
    await ctx.answerCallbackQuery("Манга не найдена")
    return
  }

  await ctx.answerCallbackQuery()

  let m: Message | undefined
  if (manga.poster?.originalUrl) {
    m = await ctx.replyWithPhoto(manga.poster.originalUrl, {
      caption: [manga.russian, manga.name].filter(x => x).join(" | "),
      has_spoiler: manga.isCensored,
    })
  }

  await ctx.reply(makeMangaInfoText(manga), {
    reply_parameters: m && { message_id: m.message_id },
    link_preview_options: { is_disabled: true },
    parse_mode: "HTML",
    reply_markup: makeMangaInfoInlineKeyboard(manga),
  })
}

export async function mangaChosen(
  ctx: MyContext & { match: string | RegExpMatchArray },
): Promise<void> {
  const mangaId = ctx.match[1]!

  const manga = await api.info(mangaId)
  if (!manga) {
    await ctx.editMessageText("Манга не найдена")
    return
  }

  await ctx.editMessageText(makeMangaInfoText(manga), {
    link_preview_options:
      !manga.isCensored || manga.poster?.originalUrl
        ? { show_above_text: true, url: manga.poster.originalUrl }
        : { is_disabled: true },
    parse_mode: "HTML",
    reply_markup: makeMangaInfoInlineKeyboard(manga),
  })
}

function makeMangaInfoInlineKeyboard(manga: any): InlineKeyboard {
  const kb = new InlineKeyboard()

  kb.switchInlineCurrent("Персонажи", `!manga characters ${manga.id}`)
    .row()
    .url("Shikimori", manga.url)

  return kb
}
