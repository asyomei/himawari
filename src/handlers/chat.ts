import type { Context, Filter } from "grammy";
import { himawari } from "#/filters/himawari";
import type { IChatService } from "#/services/chat";
import { makeReply } from "#/utils/telegram";
import { BaseHandler } from "./base";

export class ChatHandler extends BaseHandler {
  constructor(private chat: IChatService) {
    super();

    const msg = this.comp.on("message:text");
    msg.filter(himawari("chat", "gpt4", "гпт4", "чат"), ctx => this.onChatCommand(ctx, ctx.match));
    msg.filter(
      himawari("reset", "clear", "clean", "сбросить", "сброс", "очистить", "очистка"),
      ctx => this.onResetCommand(ctx),
    );
  }

  async onChatCommand(ctx: Filter<Context, "message:text">, message: string) {
    if (!message) {
      await ctx.reply("Введите текст", {
        reply_parameters: makeReply(ctx.msgId),
      });
      return;
    }

    const m = await ctx.reply("<i>Запрос отправлен. Ответ появится здесь</i>", {
      reply_parameters: makeReply(ctx.msgId),
      parse_mode: "HTML",
    });

    const answer = await this.chat.gpt4(String(ctx.from.id), message);
    await ctx.api.editMessageText(m.chat.id, m.message_id, answer);
  }

  async onResetCommand(ctx: Filter<Context, "message:text">) {
    await this.chat.clear(String(ctx.from.id));
    await ctx.reply("Контекст очищен.", {
      reply_parameters: makeReply(ctx.msgId),
    });
  }
}
