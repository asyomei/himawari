import { InlineKeyboard, type InlineQueryContext, InlineQueryResultBuilder } from "grammy"
import type { MyContext } from "#/types/context"
import { INLINE_ITEMS_COUNT } from "../consts"
import { api } from "./api"

export async function mangaCharactersInline(ctx: InlineQueryContext<MyContext>): Promise<void> {
  const mangaId = ctx.match[1]!
  const page = Number(ctx.inlineQuery.offset || 1)

  const characters = (await api.characters(mangaId)).slice(
    INLINE_ITEMS_COUNT * (page - 1),
    INLINE_ITEMS_COUNT * page,
  )
  const articles = characters.map(character => {
    const title = character.russian ?? character.name
    const article = InlineQueryResultBuilder.article(`character info ${character.id}`, title, {
      thumbnail_url: character.poster?.originalUrl,
      description: character.name,
      url: character.url,
      reply_markup: new InlineKeyboard().text("Загрузка...", "nothing"),
    })
    return article.text(title)
  })

  await ctx.answerInlineQuery(articles, {
    cache_time: 0,
    next_offset: articles.length === INLINE_ITEMS_COUNT ? `${page + 1}` : "",
  })
}
