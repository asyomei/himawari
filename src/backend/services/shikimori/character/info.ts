import { type CallbackQueryContext, InlineKeyboard } from 'grammy'
import type { Message } from 'grammy/types'
import type { MyContext } from '#/types/context'
import { api } from './api'
import { makeCharacterInfoText } from './info-text'

export async function characterCallback(ctx: CallbackQueryContext<MyContext>): Promise<void> {
  const fromId = Number(ctx.match[1]!)
  const characterId = ctx.match[2]!

  if (fromId !== ctx.from.id) {
    await ctx.answerCallbackQuery('Эта кнопка не для вас')
    return
  }

  const character = await api.info(characterId)
  if (!character) {
    await ctx.answerCallbackQuery('Персонаж не найден')
    return
  }

  await ctx.answerCallbackQuery()

  let m: Message | undefined
  if (character.poster?.originalUrl) {
    m = await ctx.replyWithPhoto(character.poster.originalUrl, {
      caption: [character.russian, character.name, character.japanese].filter(x => x).join(' | '),
    })
  }

  await ctx.reply(makeCharacterInfoText(character), {
    reply_parameters: m && { message_id: m.message_id },
    link_preview_options: { is_disabled: true },
    parse_mode: 'HTML',
    reply_markup: makeCharacterInlineKeyboard(character),
  })
}

export async function characterChosen(
  ctx: MyContext & { match: string | RegExpMatchArray },
): Promise<void> {
  const characterId = ctx.match[1]!

  const character = await api.info(characterId)
  if (!character) {
    await ctx.editMessageText('Персонаж не найден')
    return
  }

  await ctx.editMessageText(makeCharacterInfoText(character), {
    link_preview_options: {
      show_above_text: true,
      url: character.poster?.originalUrl,
    },
    parse_mode: 'HTML',
    reply_markup: makeCharacterInlineKeyboard(character),
  })
}

function makeCharacterInlineKeyboard(character: any): InlineKeyboard {
  return new InlineKeyboard().url('Shikimori', character.url)
}
