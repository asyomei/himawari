import dedent from "dedent";
import type { Context, Filter } from "grammy";
import { himawari } from "#/filters/himawari";
import { makeReply } from "#/utils/telegram";
import { BaseHandler } from "./base";

const getHelpText = (botName: string) => dedent`
  Команды (химавари <команда>):
  - аниме [название] - поиск аниме
  - манга [название] - поиск манги
  - чат [сообщение] - общение с GPT-4
  - сброс, очистка - очистка контекста чата

  Инлайн-режим (@${botName} <команда>):
  - anime [название] - поиск аниме
  - manga [название] - поиск манги
`;

export class HelpHandler extends BaseHandler {
  constructor() {
    super();

    const msg = this.comp.on("message:text");
    msg.command(["start", "help"], ctx => this.onHelpCommand(ctx));
    msg.filter(himawari("start", "help", "помощь"), ctx => this.onHelpCommand(ctx));
  }

  async onHelpCommand(ctx: Filter<Context, "message:text">) {
    await ctx.reply(getHelpText(ctx.me.username), {
      reply_parameters: makeReply(ctx.msg),
    });
  }
}
