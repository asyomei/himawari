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

export async function characters(
  ctx: HearsContext<Filter<MyContext, 'message:text'>>,
): Promise<void> {
  const search = ctx.match[1]
  if (!search) {
    await ctx.reply('Введите запрос', {
      reply_parameters: { message_id: ctx.msgId },
    })
    return
  }

  const characters = await api.search(search, PAGE_ITEMS_COUNT, 1)
  if (characters.length === 0) {
    await ctx.reply('Персонаж не найден')
    return
  }

  await ctx.reply(`<b>[Поиск персонажа]</b> ${escapeHTML(search)}`, {
    parse_mode: 'HTML',
    reply_markup: makeCharacterListInlineKeyboard(characters, 1, ctx.from.id),
  })
}

export async function charactersCallback(ctx: CallbackQueryContext<MyContext>): Promise<void> {
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

  const search = ctx.callbackQuery.message?.text?.replace('[Поиск персонажа] ', '')
  if (!search) {
    await Promise.all([ctx.answerCallbackQuery('Данный поиск устарел'), ctx.deleteMessage()])
    return
  }

  const characters = await api.search(search, PAGE_ITEMS_COUNT, page)
  if (characters.length === 0) {
    await ctx.answerCallbackQuery('Достигнут конец поиска')
    return
  }

  await ctx.editMessageReplyMarkup({
    reply_markup: makeCharacterListInlineKeyboard(characters, page, ctx.from.id),
  })
}

export async function charactersInline(ctx: InlineQueryContext<MyContext>): Promise<void> {
  const search = ctx.match[1]!
  const page = Number(ctx.inlineQuery.offset || 1)

  const characters = await api.search(search, INLINE_ITEMS_COUNT, page)
  const articles = characters.map(character => {
    const title = [character.russian, character.name].filter(x => x).join(' | ')
    const article = InlineQueryResultBuilder.article(`character info ${character.id}`, title, {
      description: [character.japanese, ...(character.synonyms ?? [])].filter(x => x).join(' | '),
      url: character.url,
      thumbnail_url: character.poster?.originalUrl,
      reply_markup: new InlineKeyboard().text('Загрузка...', 'nothing'),
    })
    return article.text(title)
  })

  await ctx.answerInlineQuery(articles, {
    cache_time: 0,
    next_offset: articles.length === INLINE_ITEMS_COUNT ? `${page + 1}` : '',
  })
}

function makeCharacterListInlineKeyboard(
  characters: any[],
  page: number,
  userId: number,
): InlineKeyboard {
  const kb = new InlineKeyboard()

  for (const character of characters) {
    const title = [character.russian, character.name, character.japanese].filter(x => x).join(' | ')
    kb.text(title, `${userId} character info ${character.id}`).row()
  }

  kb.text('<< Назад', `${userId} character search ${page - 1}`)
  if (page === 1) {
    kb.text(`${page}`, 'nothing')
  } else {
    kb.text(`<<< ${page}`, `${userId} character search 1`)
  }
  kb.text('Вперёд >>', `${userId} character search ${page + 1}`)

  return kb
}
