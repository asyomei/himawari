import type { Api, Composer, Context } from "grammy";
import { BaseHandler } from "../base";

export class MemoryUsageHandler extends BaseHandler {
  protected init(comp: Composer<Context>): void {
    const msg = comp.on("message:text");
    msg.command("memory", ctx =>
      this.onMemoryCommand(ctx.api, {
        chatId: ctx.chat.id,
        threadId: ctx.message.message_thread_id,
        memoryUsageBytes: process.memoryUsage().heapUsed,
      }),
    );
  }

  async onMemoryCommand(
    api: Api,
    x: { chatId: number; threadId?: number; memoryUsageBytes: number },
  ) {
    const usageMegabytes = Number((x.memoryUsageBytes / 1024 / 1024).toFixed(2));
    await api.sendMessage(x.chatId, `Потребление памяти: ${usageMegabytes} МБ`, {
      message_thread_id: x.threadId,
    });
  }
}
