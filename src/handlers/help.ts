import dedent from "dedent";
import type { Context, Filter } from "grammy";
import { himawari } from "#/filters/himawari";
import { makeReply } from "#/utils/telegram";
import { BaseHandler } from "./base";

const HELP_TEXT = dedent`
  Команды (химавари <команда>):
  - аниме [название] - поиск аниме
  - манга [название] - поиск манги
`;

export class HelpHandler extends BaseHandler {
  constructor() {
    super();

    const msg = this.comp.on("message:text");
    msg.command(["start", "help"], ctx => this.onHelpCommand(ctx));
    msg.filter(himawari("start", "help", "помощь"), ctx => this.onHelpCommand(ctx));
  }

  async onHelpCommand(ctx: Filter<Context, "message:text">) {
    await ctx.reply(HELP_TEXT, {
      reply_parameters: makeReply(ctx.msg),
    });
  }
}
