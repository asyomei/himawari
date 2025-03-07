import {
  type CallbackQueryContext,
  type Filter,
  type HearsContext,
  InlineKeyboard,
  type InlineQueryContext,
  InlineQueryResultBuilder,
} from 'grammy'
import { INLINE_ITEMS_COUNT, PAGE_ITEMS_COUNT } from '#/consts'
import type { MyContext } from '#/types/context'
import { escapeHTML } from '#/utils/escape-html'
import { api } from './api'

export async function mangas(ctx: HearsContext<Filter<MyContext, 'message:text'>>): Promise<void> {
  const search = ctx.match[1]
  if (!search) {
    await ctx.reply('Введите запрос', {
      reply_parameters: { message_id: ctx.msgId },
    })
    return
  }

  const mangas = await api.search(search, PAGE_ITEMS_COUNT, 1)
  if (!mangas || mangas.length === 0) {
    await ctx.reply('Ничего не найдено', {
      reply_parameters: { message_id: ctx.msgId },
    })
    return
  }

  await ctx.reply(`<b>[Поиск манги]</b> ${escapeHTML(search)}`, {
    reply_parameters: { message_id: ctx.msgId },
    parse_mode: 'HTML',
    reply_markup: makeMangaListInlineKeyboard(mangas, 1, ctx.from.id),
  })
}

export async function mangasCallback(ctx: CallbackQueryContext<MyContext>): Promise<void> {
  const fromId = Number(ctx.match[1]!)
  const page = Number(ctx.match[2]!)

  if (fromId !== ctx.from.id) {
    await ctx.answerCallbackQuery('Эта кнопка не для вас')
    return
  }

  if (page === 0) {
    await ctx.answerCallbackQuery('Достигнуто начало поиска')
    return
  }

  const search = ctx.callbackQuery.message?.text?.replace('[Поиск манги] ', '')
  if (!search) {
    await Promise.all([ctx.answerCallbackQuery('Данный поиск устарел'), ctx.deleteMessage()])
    return
  }

  const mangas = await api.search(search, PAGE_ITEMS_COUNT, page)
  if (!mangas || mangas.length === 0) {
    await ctx.answerCallbackQuery('Достигнут конец поиска')
    return
  }

  await ctx.answerCallbackQuery()
  await ctx.editMessageReplyMarkup({
    reply_markup: makeMangaListInlineKeyboard(mangas, page, ctx.from.id),
  })
}

export async function mangasInline(ctx: InlineQueryContext<MyContext>): Promise<void> {
  const search = ctx.match[1]!
  const page = Number(ctx.inlineQuery.offset || 1)

  const mangas = await api.search(search, INLINE_ITEMS_COUNT, page)
  const articles = mangas.map(manga => {
    let title = manga.russian ?? manga.name
    if (manga.isCensored) title = `[18+] ${title}`

    const article = InlineQueryResultBuilder.article(`manga info ${manga.id}`, title, {
      description: manga.name,
      url: manga.url,
      thumbnail_url: !manga.isCensored ? manga.poster?.originalUrl : undefined,
      reply_markup: new InlineKeyboard().text('Загрузка...', 'nothing'),
    })
    return article.text(title)
  })

  await ctx.answerInlineQuery(articles, {
    cache_time: 0,
    next_offset: articles.length === INLINE_ITEMS_COUNT ? `${page + 1}` : '',
  })
}

function makeMangaListInlineKeyboard(mangas: any[], page: number, userId: number): InlineKeyboard {
  const kb = new InlineKeyboard()

  for (const manga of mangas) {
    let title = manga.russian ?? manga.name
    if (manga.isCensored) title = `[18+] ${title}`
    kb.text(title, `${userId} manga info ${manga.id}`).row()
  }

  kb.text('<< Назад', `${userId} manga search ${page - 1}`)
  if (page === 1) {
    kb.text(`${page}`, 'nothing')
  } else {
    kb.text(`<<< ${page}`, `${userId} manga search 1`)
  }
  kb.text('Вперёд >>', `${userId} manga search ${page + 1}`)

  return kb
}
