import { limit } from "@grammyjs/ratelimiter";
import { Composer, type Context, type Middleware } from "grammy";
import type { Redis } from "ioredis";

export function getRatelimiter(redis: Redis): Middleware {
  const userLimiter = limit<Context, Redis>({
    limit: 2,
    timeFrame: 1000,
    keyGenerator: ctx => ctx.from?.id.toString(),
    storageClient: redis,
    alwaysReply: true,
    onLimitExceeded: answerQueryIfNeeded,
  });

  const chatLimiter = limit<Context, Redis>({
    limit: 5,
    timeFrame: 1000,
    keyGenerator: ctx => ctx.chatId?.toString(),
    storageClient: redis,
    alwaysReply: true,
    onLimitExceeded: answerQueryIfNeeded,
  });

  return new Composer(userLimiter, chatLimiter);
}

async function answerQueryIfNeeded(ctx: Context) {
  if (ctx.callbackQuery) {
    await ctx.answerCallbackQuery();
  } else if (ctx.inlineQuery) {
    await ctx.answerInlineQuery([], { cache_time: 0 });
  }
}
