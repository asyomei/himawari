import type { Composer, Context } from "grammy";
import { ShikimoriService } from "#/services/shikimori";
import { MemoryUsageHandler } from "./memory-usage";
import { ShikimoriSearchHandler } from "./shikimori-search";
import { unusedCallback } from "./unused-callback";

export function setupHandlers(comp: Composer<Context>) {
  const shikimori = new ShikimoriService();

  comp.use(new MemoryUsageHandler(), new ShikimoriSearchHandler(shikimori));

  // handle unused callback (and inline too) lastly
  comp.use(unusedCallback);
}
