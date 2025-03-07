import type { Context } from 'grammy'

export const checkMention = (ctx: Context) => {
  if (!ctx.has('message:text')) return true

  const m = ctx.message.text.match(/^\S+@(\w+)/)
  if (!m) return true

  return m[0] === ctx.me.username
}
