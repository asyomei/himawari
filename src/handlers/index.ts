import type { Composer, Context } from "grammy";
import { ShikimoriService } from "#/services/shikimori";
import { MemoryUsageHandler } from "./memory-usage";
import { ShikimoriSearchHandler } from "./shikimori-search";

export function setupHandlers(comp: Composer<Context>) {
  const shikimori = new ShikimoriService();

  comp.use(new MemoryUsageHandler(), new ShikimoriSearchHandler(shikimori));
}
