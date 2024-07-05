import type { Composer, Context } from "grammy";
import { autoThread } from "./auto-thread";
import type { MiddlewareDeps } from "./deps";
import { getRatelimiter } from "./ratelimiter";

export function setupMiddlewares(comp: Composer<Context>, deps: MiddlewareDeps) {
  comp.use(getRatelimiter(deps.redis), autoThread());
}
