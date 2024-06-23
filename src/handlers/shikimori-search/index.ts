import { type Context, type Filter, InlineKeyboard } from "grammy";
import { compact } from "lodash-es";
import { z } from "zod";
import { type Basic, type IShikimoriService, type Type, type } from "#/services/shikimori";
import { Callbacks } from "#/utils/callbacks";
import { branch, makeReply } from "#/utils/telegram";
import { BaseHandler } from "../base";
import { makeAnimeText } from "./anime-text";

export class ShikimoriSearchHandler extends BaseHandler {
  constructor(private shikimori: IShikimoriService) {
    super();

    const msg = this.comp.on("message:text");
    msg.command("anime", ctx => this.onSearchCommand(ctx, "animes", ctx.match));

    const cbd = this.comp.on("callback_query:data");
    cbd
      .filter(this.cb.has("shikiT"))
      .filter(Callbacks.checkId, ctx => this.onTitleData(ctx, ctx.data));
    cbd
      .filter(this.cb.has("shikiQ"))
      .filter(Callbacks.checkId, ctx => this.onChangePageData(ctx, ctx.data));
  }

  async onSearchCommand(ctx: Filter<Context, "message:text">, type: Type, search: string) {
    const name = { animes: "аниме", mangas: "манги" }[type];

    const m = await ctx.reply(`Поиск ${name}: ${search}...`, {
      reply_parameters: makeReply(ctx.msg),
    });

    const basics = await this.shikimori.search(type, search);

    await ctx.api.editMessageText(m.chat.id, m.message_id, `Поиск ${name}: ${search}`, {
      reply_markup: this.buildBasicListMenu(basics, type, 1, ctx.from.id),
    });
  }

  async onChangePageData(
    ctx: Filter<Context, "callback_query">,
    data: z.infer<(typeof this.cb)["schemas"]["shikiQ"]>,
  ) {
    if (data.page < 0) {
      await ctx.answerCallbackQuery("Достигнуто начало поиска");
      return;
    }

    const text = ctx.msg?.text;
    if (!text) {
      await Promise.all([ctx.deleteMessage(), ctx.answerCallbackQuery("Что-то пошло не так")]);
      return;
    }

    const search = text.slice(text.indexOf(":") + 2);
    const basics = await this.shikimori.search(data.type, search, data.page);

    if (basics.length === 0) {
      await ctx.answerCallbackQuery("Достигнут конец поиска");
      return;
    }

    await Promise.all([
      ctx.answerCallbackQuery(),
      ctx.editMessageReplyMarkup({
        reply_markup: this.buildBasicListMenu(basics, data.type, data.page, ctx.from.id),
      }),
    ]);
  }

  async onTitleData(
    ctx: Filter<Context, "callback_query:data">,
    data: z.infer<(typeof this.cb)["schemas"]["shikiT"]>,
  ) {
    let text: string | undefined;
    let imageUrl: string;
    let imageText: string;

    if (data.type === "animes") {
      const anime = await this.shikimori.anime(data.titleId);
      if (anime) {
        text = makeAnimeText(anime);
        imageUrl = anime.poster;
        imageText = compact([anime.russian, anime.name]).join(" | ");
      }
    }

    if (text == null) {
      await ctx.answerCallbackQuery("Что-то пошло не так");
      return;
    }

    await ctx.answerCallbackQuery();
    const m = await ctx.replyWithPhoto(imageUrl!, { caption: imageText! });
    await ctx.reply(text, {
      parse_mode: "HTML",
      reply_parameters: makeReply(m),
      link_preview_options: { is_disabled: true },
    });
  }

  buildBasicListMenu(basics: Basic[], type: Type, page: number, fromId: number) {
    const kb = new InlineKeyboard();

    for (const basic of basics) {
      let name = basic.russian ?? basic.name;
      if (basic.isCensored) name = `[18+] ${name}`;
      kb.text(name, this.cb.make("shikiT", { type, titleId: basic.id, fromId })).row();
    }

    kb.text("<< Назад", this.cb.make("shikiQ", { type, page: page - 1, fromId }));
    kb.text(String(page), "nop");
    kb.text("Вперёд >>", this.cb.make("shikiQ", { type, page: page + 1, fromId }));

    return kb;
  }

  private cb = new Callbacks({
    shikiT: z.object({
      type,
      titleId: z.string(),
      fromId: z.number().int(),
    }),
    shikiQ: z.object({
      type,
      page: z.number().int(),
      fromId: z.number().int(),
    }),
  });
}
