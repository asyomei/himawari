import { autoChatAction } from "@grammyjs/auto-chat-action";
import type { Composer } from "grammy";
import { autoThread } from "./auto-thread";
import type { MiddlewareDeps } from "./deps";
import { getRatelimiter } from "./ratelimiter";
import type { MyContext } from "#/types/context";

export function setupMiddlewares(comp: Composer<MyContext>, deps: MiddlewareDeps) {
  comp.use(getRatelimiter(deps.redis), autoThread(), autoChatAction());
}
