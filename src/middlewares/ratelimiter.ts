import { limit } from "@grammyjs/ratelimiter";
import { Composer, type Context, type Middleware } from "grammy";
import type { Redis } from "ioredis";

export function getRatelimiter(redis: Redis): Middleware {
  const userLimiter = limit<Context, Redis>({
    limit: 2,
    timeFrame: 1000,
    keyGenerator: ctx => ctx.from?.id.toString(),
    storageClient: redis,
  });

  const chatLimiter = limit<Context, Redis>({
    limit: 5,
    timeFrame: 1000,
    keyGenerator: ctx => ctx.chatId?.toString(),
    storageClient: redis,
  });

  return new Composer(userLimiter, chatLimiter);
}
