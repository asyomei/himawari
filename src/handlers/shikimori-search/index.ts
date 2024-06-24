import {
  type Context,
  type Filter,
  InlineKeyboard,
  type InlineQueryContext,
  InlineQueryResultBuilder,
} from "grammy";
import { compact } from "lodash-es";
import { z } from "zod";
import {
  type Basic,
  type IShikimoriService,
  type Type,
  type VideoKind,
  type,
} from "#/services/shikimori";
import { Callbacks } from "#/utils/callbacks";
import { makeReply } from "#/utils/telegram";
import { BaseHandler } from "../base";
import { makeAnimeText } from "./anime-text";
import { makeMangaText } from "./manga-text";

export class ShikimoriSearchHandler extends BaseHandler {
  constructor(private shikimori: IShikimoriService) {
    super();

    const msg = this.comp.on("message:text");
    msg.command("animes", ctx => this.onSearchCommand(ctx, "animes", ctx.match));
    msg.command("mangas", ctx => this.onSearchCommand(ctx, "mangas", ctx.match));

    const cbd = this.comp.on("callback_query:data");
    cbd
      .filter(this.cb.has("shikiT", ctx => ctx.data.type === "animes"))
      .filter(Callbacks.checkId, ctx => this.onAnimeTitleData(ctx, ctx.data));
    cbd
      .filter(this.cb.has("shikiT", ctx => ctx.data.type === "mangas"))
      .filter(Callbacks.checkId, ctx => this.onMangaTitleData(ctx, ctx.data));
    cbd
      .filter(this.cb.has("shikiQ"))
      .filter(Callbacks.checkId, ctx => this.onChangePageData(ctx, ctx.data));

    this.comp.inlineQuery(/^anime-screenshots:(\w+)$/, ctx => this.onAnimeScreenshotsInline(ctx));
    this.comp.inlineQuery(/^anime-video:(\w+)$/, ctx => this.onAnimeVideoInline(ctx));
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
    if (data.page < 1) {
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

  async onAnimeTitleData(
    ctx: Filter<Context, "callback_query:data">,
    data: z.infer<(typeof this.cb)["schemas"]["shikiT"]>,
  ) {
    const anime = await this.shikimori.anime(data.titleId);
    if (!anime) {
      await Promise.all([ctx.deleteMessage(), ctx.answerCallbackQuery("Что-то пошло не так")]);
      return;
    }

    const caption = compact([anime.russian, anime.name]).join(" | ");

    await ctx.answerCallbackQuery();
    const m = await ctx.replyWithPhoto(anime.poster, { caption });
    await ctx.reply(makeAnimeText(anime), {
      parse_mode: "HTML",
      reply_parameters: makeReply(m),
      link_preview_options: { is_disabled: true },
      reply_markup: InlineKeyboard.from([
        [
          InlineKeyboard.switchInlineCurrent("Скриншоты", `anime-screenshots:${anime.id}`),
          InlineKeyboard.switchInlineCurrent("Видео", `anime-video:${anime.id}`),
        ],
      ]),
    });
  }

  async onMangaTitleData(
    ctx: Filter<Context, "callback_query:data">,
    data: z.infer<(typeof this.cb)["schemas"]["shikiT"]>,
  ) {
    const manga = await this.shikimori.manga(data.titleId);
    if (!manga) {
      await Promise.all([ctx.deleteMessage(), ctx.answerCallbackQuery("Что-то пошло не так")]);
      return;
    }

    const caption = compact([manga.russian, manga.name]).join(" | ");

    await ctx.answerCallbackQuery();
    const m = await ctx.replyWithPhoto(manga.poster, { caption });
    await ctx.reply(makeMangaText(manga), {
      parse_mode: "HTML",
      reply_parameters: makeReply(m),
      link_preview_options: { is_disabled: true },
    });
  }

  async onAnimeScreenshotsInline(ctx: InlineQueryContext<Context>) {
    const titleId = ctx.match![1];

    const data = await this.shikimori.screenshots(titleId);
    if (!data?.screenshots.length) {
      await ctx.answerInlineQuery([]);
      return;
    }

    const results = data.screenshots
      .slice(0, 50)
      .map(scr => InlineQueryResultBuilder.photo(`anime-scr:${scr.id}`, scr.originalUrl));
    await ctx.answerInlineQuery(results);
  }

  async onAnimeVideoInline(ctx: InlineQueryContext<Context>) {
    const titleId = ctx.match![1];

    const data = await this.shikimori.videos(titleId);
    if (!data?.videos.length) {
      await ctx.answerInlineQuery([]);
      return;
    }

    const getName = (kind: VideoKind) =>
      ({
        pv: "PV",
        cm: "CM",
        op: "Опенинг",
        ed: "Эндинг",
        clip: "Клип",
        op_ed_clip: "OP&ED клип",
        character_trailer: "Трейлер персонажа",
        episode_preview: "Превью к эпизоду",
        other: "Другое",
      })[kind];

    const results = data.videos
      .slice(0, 50)
      .map(vid =>
        InlineQueryResultBuilder.videoHtml(
          vid.id,
          vid.name ?? getName(vid.kind),
          vid.playerUrl,
          vid.imageUrl,
        ).text((vid.name ?? getName(vid.kind)) + "\n" + vid.url),
      );

    await ctx.answerInlineQuery(results);
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
