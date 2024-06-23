import type { MiddlewareFn } from "grammy";

export const autoThread: MiddlewareFn = async (ctx, next) => {
  const threadId = ctx.msg?.message_thread_id;

  if (ctx.chat?.is_forum && threadId != null) {
    ctx.api.config.use(async (prev, method, payload, signal) => {
      payload = { message_thread_id: threadId, ...payload };
      return await prev(method, payload, signal);
    });
  }

  await next();
};
