import type { MiddlewareFn } from "grammy"
import type { MyContext } from "#/types/context"

export const dropMsgViaMe: MiddlewareFn<MyContext> = async (ctx, next) => {
  if (ctx.msg?.via_bot?.id !== ctx.me.id) await next()
}