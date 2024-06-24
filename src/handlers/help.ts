import dedent from "dedent";
import type { Context, Filter } from "grammy";
import { makeReply } from "#/utils/telegram";
import { BaseHandler } from "./base";

const HELP_TEXT = dedent`
  Команды:
  - /anime, /animes [название] - поиск аниме
  - /manga, /mangas [название] - поиск манги
`;

export class HelpHandler extends BaseHandler {
  constructor() {
    super();

    const msg = this.comp.on("message:text");
    msg.command(["start", "help"], ctx => this.onHelpCommand(ctx));
  }

  async onHelpCommand(ctx: Filter<Context, "message:text">) {
    await ctx.reply(HELP_TEXT, {
      reply_parameters: makeReply(ctx.msg),
    });
  }
}
