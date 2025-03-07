import { InlineKeyboard, type InlineQueryContext, InlineQueryResultBuilder } from 'grammy'
import { INLINE_ITEMS_COUNT } from '#/consts'
import type { MyContext } from '#/types/context'
import { api } from './api'

const VIDEO_KIND_NAMES = {
  pv: 'Проморолик',
  cm: 'Реклама',
  op: 'Опенинг',
  ed: 'Эндинг',
  clip: 'Клип',
  op_ed_clip: 'OP&ED клип',
  character_trailer: 'Трейлер персонажа',
  episode_preview: 'Превью к эпизоду',
  other: 'Другое',
}

export async function animeScreenshotsInline(ctx: InlineQueryContext<MyContext>): Promise<void> {
  const animeId = ctx.match[1]!
  const page = Number(ctx.inlineQuery.offset || 1)

  const screenshots = (await api.screenshots(animeId)).slice(
    INLINE_ITEMS_COUNT * (page - 1),
    INLINE_ITEMS_COUNT * page,
  )
  const results = screenshots.map(screenshot => {
    return InlineQueryResultBuilder.photo(
      `anime screenshot ${screenshot.id}`,
      screenshot.originalUrl,
      {
        photo_width: 1920,
        photo_height: 1080,
        thumbnail_url: screenshot.originalUrl,
      },
    )
  })

  await ctx.answerInlineQuery(results, {
    cache_time: 0,
    next_offset: results.length === INLINE_ITEMS_COUNT ? `${page + 1}` : '',
  })
}

export async function animeVideosInline(ctx: InlineQueryContext<MyContext>): Promise<void> {
  const animeId = ctx.match[1]!
  const page = Number(ctx.inlineQuery.offset || 1)

  const videos = (await api.videos(animeId)).slice(
    INLINE_ITEMS_COUNT * (page - 1),
    INLINE_ITEMS_COUNT * page,
  )
  const results = videos.map(video => {
    let title = VIDEO_KIND_NAMES[video.kind as 'op']
    if (video.name) title = `[${title}] ${video.name}`

    const videoHtml = InlineQueryResultBuilder.videoHtml(
      `anime video ${video.id}`,
      title,
      video.url,
      video.imageUrl,
    )
    return videoHtml.text(`${title}\n${video.url}`)
  })

  await ctx.answerInlineQuery(results, {
    cache_time: 0,
    next_offset: results.length === INLINE_ITEMS_COUNT ? `${page + 1}` : '',
  })
}

export async function animeCharactersInline(ctx: InlineQueryContext<MyContext>): Promise<void> {
  const animeId = ctx.match[1]!
  const page = Number(ctx.inlineQuery.offset || 1)

  const characters = (await api.characters(animeId)).slice(
    INLINE_ITEMS_COUNT * (page - 1),
    INLINE_ITEMS_COUNT * page,
  )
  const articles = characters.map(character => {
    const title = character.russian ?? character.name
    const article = InlineQueryResultBuilder.article(`character info ${character.id}`, title, {
      thumbnail_url: character.poster?.originalUrl,
      description: character.name,
      url: character.url,
      reply_markup: new InlineKeyboard().text('Загрузка...', 'nothing'),
    })
    return article.text(title)
  })

  await ctx.answerInlineQuery(articles, {
    cache_time: 0,
    next_offset: articles.length === INLINE_ITEMS_COUNT ? `${page + 1}` : '',
  })
}
