import {
  type CallbackQueryContext,
  type Filter,
  type HearsContext,
  InlineKeyboard,
  type InlineQueryContext,
  InlineQueryResultBuilder,
} from "grammy"
import type { MyContext } from "#/types/context"
import { INLINE_ITEMS_COUNT, PAGE_ITEMS_COUNT } from "../consts"
import { escapeHTML } from "../utils"
import { api } from "./api"

export async function animes(ctx: HearsContext<Filter<MyContext, "message:text">>): Promise<void> {
  const search = ctx.match[1]!

  const animes = await api.search(search, PAGE_ITEMS_COUNT, 1)
  if (animes.length === 0) {
    await ctx.reply("Ничего не найдено", {
      reply_parameters: { message_id: ctx.msgId },
    })
    return
  }

  await ctx.reply(`<b>[Поиск аниме]</b> ${escapeHTML(search)}`, {
    reply_markup: makeAnimeListInlineKeyboard(animes, 1, ctx.from.id),
    parse_mode: "HTML",
  })
}

export async function animesCallback(ctx: CallbackQueryContext<MyContext>): Promise<void> {
  const fromId = Number(ctx.match[1]!)
  const page = Number(ctx.match[2]!)

  if (fromId !== ctx.from.id) {
    await ctx.answerCallbackQuery("Эта кнопка не для вас")
    return
  }

  if (page === 0) {
    await ctx.answerCallbackQuery("Достигнуто начало поиска")
    return
  }

  const search = ctx.callbackQuery.message?.text?.replace("[Поиск аниме] ", "")
  if (!search) {
    await Promise.all([ctx.answerCallbackQuery("Данный поиск устарел"), ctx.deleteMessage()])
    return
  }

  const animes = await api.search(search, PAGE_ITEMS_COUNT, page)
  if (animes.length === 0) {
    await ctx.answerCallbackQuery("Достигнут конец поиска")
    return
  }

  await ctx.answerCallbackQuery()
  await ctx.editMessageReplyMarkup({
    reply_markup: makeAnimeListInlineKeyboard(animes, page, ctx.from.id),
  })
}

export async function animesInline(ctx: InlineQueryContext<MyContext>): Promise<void> {
  const search = ctx.match[1]!
  const page = Number(ctx.inlineQuery.offset || 1)

  const animes = await api.search(search, INLINE_ITEMS_COUNT, page)
  const results = animes.map(anime => {
    let title = anime.russian ?? anime.name
    if (anime.isCensored) title = `[18+] ${title}`

    const article = InlineQueryResultBuilder.article(`anime info ${anime.id}`, title, {
      description: anime.name,
      url: anime.url,
      hide_url: true,
      thumbnail_url: !anime.isCensored ? anime.poster?.originalUrl : undefined,
      reply_markup: new InlineKeyboard().text("Загрузка...", "nothing"),
    })
    return article.text(title)
  })

  await ctx.answerInlineQuery(results, {
    cache_time: 0,
    next_offset: animes.length === INLINE_ITEMS_COUNT ? `${page + 1}` : "",
  })
}

function makeAnimeListInlineKeyboard(animes: any[], page: number, userId: number): InlineKeyboard {
  const kb = new InlineKeyboard()

  for (const anime of animes) {
    let title = anime.russian ?? anime.name
    if (anime.isCensored) title = `[18+] ${title}`
    kb.text(title, `${userId} anime info ${anime.id}`).row()
  }

  kb.text("<< Назад", `${userId} anime search ${page - 1}`)
  if (page === 1) {
    kb.text(`${page}`, "nothing")
  } else {
    kb.text(`<<< ${page}`, `${userId} anime search 1`)
  }
  kb.text("Вперёд >>", `${userId} anime search ${page + 1}`)

  return kb
}
