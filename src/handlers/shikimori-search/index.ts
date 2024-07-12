import {
  type Context,
  type Filter,
  InlineKeyboard,
  type InlineQueryContext,
  InlineQueryResultBuilder,
} from "grammy";
import compact from "just-compact";
import { z } from "zod";
import { INLINE_CACHE_TIME, MAX_INLINE_RESULTS } from "#/consts";
import { nodeEnv } from "#/env";
import { himawari } from "#/filters/himawari";
import type { VideoKindEnum } from "#/gql";
import type { ShikimoriService } from "#/services/shikimori";
import type { AnimeBasic, MangaBasic } from "#/services/shikimori/types";
import { Callback, type CallbackData } from "#/utils/callback";
import escapeHTML from "#/utils/escape-html";
import { makeReply, nextOffset } from "#/utils/telegram";
import { BaseHandler } from "../base";
import { makeAnimeText } from "./anime-text";
import { makeCharacterText } from "./character-text";
import { makeMangaText } from "./manga-text";
import { b } from "./utils";

type Type = "anime" | "manga";

export class ShikimoriSearchHandler extends BaseHandler {
  constructor(private shikimori: ShikimoriService) {
    super();

    const msg = this.comp.on("message:text");
    msg.filter(himawari("anime", "animes", "аниме"), ctx =>
      this.onSearchCommand(ctx, "anime", ctx.match),
    );
    msg.filter(himawari("manga", "mangas", "манга"), ctx =>
      this.onSearchCommand(ctx, "manga", ctx.match),
    );

    const cbd = this.comp.on("callback_query:data");
    cbd.filter(this.titleData.has()).filter(Callback.checkId, async (ctx, next) => {
      if (ctx.data.type === "anime") return await this.onAnimeTitleData(ctx, ctx.data);
      if (ctx.data.type === "manga") return await this.onMangaTitleData(ctx, ctx.data);
      await next();
    });
    cbd
      .filter(this.queryData.has())
      .filter(Callback.checkId, ctx => this.onChangePageData(ctx, ctx.data));

    this.comp.inlineQuery(/^(?:anime|аниме) (.+)$/i, ctx =>
      this.onSearchInline(ctx, "anime", ctx.match[1]),
    );
    this.comp.inlineQuery(/^(?:manga|манга) (.+)$/i, ctx =>
      this.onSearchInline(ctx, "manga", ctx.match[1]),
    );
    this.comp.inlineQuery(/^anime-screenshots:(\w+)$/, ctx =>
      this.onAnimeScreenshotsInline(ctx, ctx.match[1]),
    );
    this.comp.inlineQuery(/^anime-video:(\w+)$/, ctx =>
      this.onAnimeVideosInline(ctx, ctx.match[1]),
    );
    this.comp.inlineQuery(/^title-characters:(anime|manga):(\w+)$/, ctx =>
      this.onCharacterInline(ctx, ctx.match[1] as never, ctx.match[2]),
    );

    this.comp.chosenInlineResult(/^(anime|manga)-title:(\w+)$/, async ctx => {
      const [type, titleId] = ctx.match.slice(1);
      if (type === "anime") return await this.onAnimeSearchChosen(ctx, titleId);
      if (type === "manga") return await this.onMangaSearchChosen(ctx, titleId);
    });
    this.comp.chosenInlineResult(/^title-character:(\w+)$/, ctx =>
      this.onCharacterChosen(ctx, ctx.match[1]),
    );
  }

  async onSearchCommand(ctx: Filter<Context, "message:text">, type: Type, search: string) {
    if (!search) {
      await ctx.reply("Введите название для поиска", {
        reply_parameters: makeReply(ctx.msg),
      });
      return;
    }

    const action = b({ anime: "Поиск аниме", manga: "Поиск манги" }[type]);
    const query = escapeHTML(search);

    const m = await ctx.reply(`${action}: ${query}...`, {
      parse_mode: "HTML",
      reply_parameters: makeReply(ctx.msg),
    });

    const basics =
      type === "anime"
        ? await this.shikimori.searchAnime(search)
        : await this.shikimori.searchManga(search);

    await ctx.api.editMessageText(m.chat.id, m.message_id, `${action}: ${query}`, {
      parse_mode: "HTML",
      reply_markup: this.buildBasicListMenu(basics, type, 1, ctx.from.id),
    });
  }

  async onChangePageData(
    ctx: Filter<Context, "callback_query">,
    data: CallbackData<typeof this.queryData>,
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
    const basics =
      data.type === "anime"
        ? await this.shikimori.searchAnime(search, data.page)
        : await this.shikimori.searchManga(search, data.page);

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
    data: CallbackData<typeof this.titleData>,
  ) {
    const anime = await this.shikimori.anime(data.titleId);
    if (!anime) {
      await Promise.all([ctx.deleteMessage(), ctx.answerCallbackQuery("Что-то пошло не так")]);
      return;
    }

    const caption = compact([anime.russian, anime.name]).join(" | ");

    await ctx.answerCallbackQuery();

    let msgId: number | undefined = undefined;
    if (anime.poster) {
      const m = await ctx.replyWithPhoto(anime.poster.originalUrl, { caption });
      msgId = m.message_id;
    }

    await ctx.reply(makeAnimeText(anime), {
      parse_mode: "HTML",
      reply_parameters: makeReply(msgId),
      link_preview_options: { is_disabled: true },
      reply_markup: InlineKeyboard.from([
        [
          InlineKeyboard.switchInlineCurrent("Скриншоты", `anime-screenshots:${anime.id}`),
          InlineKeyboard.switchInlineCurrent("Видео", `anime-video:${anime.id}`),
        ],
        [InlineKeyboard.switchInlineCurrent("Персонажи", `title-characters:anime:${anime.id}`)],
        [InlineKeyboard.url("Shikimori", anime.url)],
      ]),
    });
  }

  async onMangaTitleData(
    ctx: Filter<Context, "callback_query:data">,
    data: CallbackData<typeof this.titleData>,
  ) {
    const manga = await this.shikimori.manga(data.titleId);
    if (!manga) {
      await Promise.all([ctx.deleteMessage(), ctx.answerCallbackQuery("Что-то пошло не так")]);
      return;
    }

    const caption = compact([manga.russian, manga.name]).join(" | ");

    await ctx.answerCallbackQuery();

    let msgId: number | undefined = undefined;
    if (manga.poster) {
      const m = await ctx.replyWithPhoto(manga.poster.originalUrl, { caption });
      msgId = m.message_id;
    }

    await ctx.reply(makeMangaText(manga), {
      parse_mode: "HTML",
      reply_parameters: makeReply(msgId),
      link_preview_options: { is_disabled: true },
      reply_markup: InlineKeyboard.from([
        [InlineKeyboard.switchInlineCurrent("Персонажи", `title-characters:manga:${manga.id}`)],
        [InlineKeyboard.url("Shikimori", manga.url)],
      ]),
    });
  }

  async onSearchInline(ctx: InlineQueryContext<Context>, type: Type, search: string) {
    const offset = Number(ctx.inlineQuery.offset);
    const page = offset / MAX_INLINE_RESULTS + 1;

    const basics =
      type === "anime"
        ? await this.shikimori.searchAnime(search, page, MAX_INLINE_RESULTS)
        : await this.shikimori.searchManga(search, page, MAX_INLINE_RESULTS);

    const results = basics.slice(offset, offset + MAX_INLINE_RESULTS).map(basic => {
      let title = basic.russian || basic.name;
      if (basic.isCensored) title = `[18+] ${title}`;
      const description = basic.russian ? basic.name : undefined;
      return InlineQueryResultBuilder.article(`${type}-title:${basic.id}`, title, {
        description,
        url: basic.url,
        thumbnail_url: !basic.isCensored ? basic.poster?.originalUrl : undefined,
        reply_markup: InlineKeyboard.from([[InlineKeyboard.text("Загрузка...", "nop")]]),
      }).text(title);
    });

    await ctx.answerInlineQuery(results, {
      next_offset: nextOffset(results.length, offset),
      cache_time: INLINE_CACHE_TIME[nodeEnv],
    });
  }

  async onAnimeSearchChosen(ctx: Context, titleId: string) {
    const anime = await this.shikimori.anime(titleId);
    if (!anime) {
      await ctx.editMessageText("Что-то пошло не так");
      return;
    }

    await ctx.editMessageText(makeAnimeText(anime), {
      parse_mode: "HTML",
      link_preview_options: anime.poster
        ? { show_above_text: true, url: anime.poster.originalUrl }
        : { is_disabled: true },
      reply_markup: InlineKeyboard.from([
        [
          InlineKeyboard.switchInlineCurrent("Скриншоты", `anime-screenshots:${anime.id}`),
          InlineKeyboard.switchInlineCurrent("Видео", `anime-video:${anime.id}`),
        ],
        [InlineKeyboard.switchInlineCurrent("Персонажи", `title-characters:anime:${anime.id}`)],
        [InlineKeyboard.url("Shikimori", anime.url)],
      ]),
    });
  }

  async onMangaSearchChosen(ctx: Context, titleId: string) {
    const manga = await this.shikimori.manga(titleId);
    if (!manga) {
      await ctx.editMessageText("Что-то пошло не так");
      return;
    }

    await ctx.editMessageText(makeMangaText(manga), {
      parse_mode: "HTML",
      link_preview_options: manga.poster
        ? { show_above_text: true, url: manga.poster.originalUrl }
        : { is_disabled: true },
      reply_markup: InlineKeyboard.from([
        [InlineKeyboard.switchInlineCurrent("Персонажи", `title-characters:manga:${manga.id}`)],
        [InlineKeyboard.url("Shikimori", manga.url)],
      ]),
    });
  }

  async onAnimeScreenshotsInline(ctx: InlineQueryContext<Context>, titleId: string) {
    const offset = Number(ctx.inlineQuery.offset);

    const screenshots = await this.shikimori.screenshots(titleId);
    if (!screenshots?.length) {
      await ctx.answerInlineQuery([]);
      return;
    }

    const results = screenshots.slice(offset, offset + MAX_INLINE_RESULTS).map(scr =>
      InlineQueryResultBuilder.photo(`anime-scr:${scr.id}`, scr.originalUrl, {
        photo_width: 1920,
        photo_height: 1080,
        thumbnail_url: scr.originalUrl,
      }),
    );
    await ctx.answerInlineQuery(results, {
      next_offset: nextOffset(results.length, offset),
      cache_time: INLINE_CACHE_TIME[nodeEnv],
    });
  }

  async onAnimeVideosInline(ctx: InlineQueryContext<Context>, titleId: string) {
    const offset = Number(ctx.inlineQuery.offset);

    const videos = await this.shikimori.videos(titleId);
    if (!videos?.length) {
      await ctx.answerInlineQuery([]);
      return;
    }

    const getName = (kind: VideoKindEnum) =>
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

    const results = videos.slice(offset, offset + MAX_INLINE_RESULTS).map(vid => {
      const name = vid.name ?? getName(vid.kind);
      return InlineQueryResultBuilder.videoHtml(vid.id, name, vid.playerUrl, vid.imageUrl).text(
        name + "\n" + vid.url,
      );
    });

    await ctx.answerInlineQuery(results, {
      next_offset: nextOffset(results.length, offset),
      cache_time: INLINE_CACHE_TIME[nodeEnv],
    });
  }

  async onCharacterInline(ctx: InlineQueryContext<Context>, titleType: Type, titleId: string) {
    const offset = Number(ctx.inlineQuery.offset);

    const chars =
      titleType === "anime"
        ? await this.shikimori.animeCharacters(titleId)
        : await this.shikimori.mangaCharacters(titleId);
    if (!chars?.length) {
      await ctx.answerInlineQuery([]);
      return;
    }

    const results = chars.slice(offset, offset + MAX_INLINE_RESULTS).map(char => {
      const name = char.russian ?? char.name;
      const description = char.russian ? char.name : undefined;
      return InlineQueryResultBuilder.article(`title-character:${char.id}`, name, {
        description,
        url: char.url,
        thumbnail_url: char.poster?.originalUrl,
        reply_markup: InlineKeyboard.from([[InlineKeyboard.text("Загрузка...", "nop")]]),
      }).text(name);
    });

    await ctx.answerInlineQuery(results, {
      next_offset: nextOffset(results.length, offset),
      cache_time: INLINE_CACHE_TIME[nodeEnv],
    });
  }

  async onCharacterChosen(ctx: Context, charId: string) {
    const char = await this.shikimori.character(charId);
    if (!char) {
      await ctx.editMessageText("Что-то пошло не так");
      return;
    }

    await ctx.editMessageText(makeCharacterText(char), {
      parse_mode: "HTML",
      link_preview_options: char.poster
        ? { show_above_text: true, url: char.poster.originalUrl }
        : { is_disabled: true },
      reply_markup: InlineKeyboard.from([[InlineKeyboard.url("Shikimori", char.url)]]),
    });
  }

  buildBasicListMenu(
    basics: (AnimeBasic | MangaBasic)[],
    type: Type,
    page: number,
    fromId: number,
  ) {
    const kb = new InlineKeyboard();

    for (const basic of basics) {
      let name = basic.russian ?? basic.name;
      if (basic.isCensored) name = `[18+] ${name}`;
      kb.text(name, this.titleData.make({ type, titleId: basic.id, fromId })).row();
    }

    kb.text("<< Назад", this.queryData.make({ type, page: page - 1, fromId }));
    kb.text(String(page), "nop");
    kb.text("Вперёд >>", this.queryData.make({ type, page: page + 1, fromId }));

    return kb;
  }

  private titleData = new Callback("shikiT", {
    type: z.enum(["anime", "manga"]),
    titleId: z.string(),
    fromId: z.number().int(),
  });

  private queryData = new Callback("shikiQ", {
    type: z.enum(["anime", "manga"]),
    page: z.number().int(),
    fromId: z.number().int(),
  });
}
