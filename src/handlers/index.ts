import type { Composer, Context } from "grammy";
import { ChatService } from "#/services/chat";
import { ShikimoriService } from "#/services/shikimori";
import { ChatHandler } from "./chat";
import type { HandlerDeps } from "./deps";
import { HelpHandler } from "./help";
import { MemoryUsageHandler } from "./memory-usage";
import { PrivacyHandler } from "./privacy";
import { ShikimoriSearchHandler } from "./shikimori-search";
import { unhandledUpdate } from "./unhandled-update";

export function setupHandlers(comp: Composer<Context>, deps: HandlerDeps) {
  const shikimori = new ShikimoriService();
  const chat = new ChatService(deps.redis);

  comp.use(
    new HelpHandler(),
    new PrivacyHandler(),
    new MemoryUsageHandler(),
    new ShikimoriSearchHandler(shikimori),
    new ChatHandler(chat),
  );

  // handle unused callbacks and inlines lastly
  comp.use(unhandledUpdate);
}
