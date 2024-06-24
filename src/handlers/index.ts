import type { Composer, Context } from "grammy";
import { ChatService } from "#/services/chat";
import { ShikimoriService } from "#/services/shikimori";
import { ChatHandler } from "./chat";
import type { HandlerDeps } from "./deps";
import { HelpHandler } from "./help";
import { MemoryUsageHandler } from "./memory-usage";
import { ShikimoriSearchHandler } from "./shikimori-search";
import { unusedCallback } from "./unused-callback";

export function setupHandlers(comp: Composer<Context>, deps: HandlerDeps) {
  const shikimori = new ShikimoriService();
  const chat = new ChatService(deps.redis);

  comp.use(
    new HelpHandler(),
    new MemoryUsageHandler(),
    new ShikimoriSearchHandler(shikimori),
    new ChatHandler(chat),
  );

  // handle unused callback (and inline too) lastly
  comp.use(unusedCallback);
}
