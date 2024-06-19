import type { Composer, Context } from "grammy";
import { MemoryUsageHandler } from "./memory-usage";

export function setupHandlers(comp: Composer<Context>) {
  comp.use(new MemoryUsageHandler());
}
