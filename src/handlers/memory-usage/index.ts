import type { Context, Filter } from "grammy";
import { himawari } from "#/filters/himawari";
import { BaseHandler } from "../base";

export class MemoryUsageHandler extends BaseHandler {
  constructor() {
    super();

    const msg = this.comp.on("message:text");
    msg.filter(himawari("memory"), ctx =>
      this.onMemoryCommand(ctx, process.memoryUsage().heapUsed),
    );
  }

  async onMemoryCommand(ctx: Filter<Context, "message:text">, memoryUsageBytes: number) {
    const usageMegabytes = Number((memoryUsageBytes / 1024 / 1024).toFixed(2));
    await ctx.reply(`Потребление памяти: ${usageMegabytes} МБ`);
  }
}
