import { describe, it } from "node:test";
import dedent from "dedent";
import { expect } from "expect";
import type { InlineKeyboardButton, Message } from "grammy/types";
import type { Type } from "#/services/shikimori";
import { ShikimoriMock } from "#/services/shikimori/mock";
import { type ApiRequest, getTestApi, getTestContext, mockResponse } from "#/utils/testing";
import { ShikimoriSearchHandler } from ".";

describe("ShikimoriSearchHandler", async () => {
  const handler = new ShikimoriSearchHandler(new ShikimoriMock());

  for (const type of ["animes", "mangas"] satisfies Type[]) {
    const name = { animes: "аниме", mangas: "манги" }[type];

    it(`should send ${type} list`, async () => {
      const [api, reqs] = getTestApi();
      const ctx = getTestContext(api, "message", {
        message_id: 1,
        chat: { id: 1 },
        from: { id: 1 },
      });

      mockResponse(api, "sendMessage", {
        message_id: 2,
        chat: { id: 1 },
      } as Message);

      await handler.onSearchCommand(ctx, type, "Some>Query");

      expect(reqs).toEqual([
        {
          method: "sendMessage",
          chat_id: 1,
          text: `Поиск ${name}: Some>Query...`,
          reply_parameters: {
            message_id: 1,
            allow_sending_without_reply: true,
          },
        },
        {
          method: "editMessageText",
          chat_id: 1,
          message_id: 2,
          text: `Поиск ${name}: Some>Query`,
          reply_markup: expect.objectContaining({
            inline_keyboard: expect.any(Array),
          }) as any,
        },
      ] satisfies ApiRequest[]);

      const kb = (reqs[1] as any).reply_markup.inline_keyboard as InlineKeyboardButton[][];
      for (let i = 1; i <= 10; i++) {
        expect(kb[i - 1]).toEqual([
          {
            text: i <= 8 ? `${i === 5 ? "[18+] " : ""}"Some>Query ${i}"` : `Some>Query ${i}`,
            callback_data: `shikiT["${type}","${10000 + i}",1]`,
          },
        ]);
      }
      expect(kb[10]).toEqual([
        { text: "<< Назад", callback_data: `shikiQ["${type}",0,1]` },
        { text: "1", callback_data: "nop" },
        { text: "Вперёд >>", callback_data: `shikiQ["${type}",2,1]` },
      ]);
    });
  }

  it("should change page on click button", async () => {
    const [api, reqs] = getTestApi();
    const ctx = getTestContext(api, "callback_query", {
      id: "1",
      from: { id: 1 },
      message: {
        message_id: 1,
        chat: { id: 1 },
        from: { id: 4242 },
        text: "Поиск аниме: Another<Query",
      },
    });

    await handler.onChangePageData(ctx, {
      type: "animes",
      page: 2,
      fromId: 1,
    });

    expect(reqs).toEqual([
      {
        method: "answerCallbackQuery",
        callback_query_id: "1",
      },
      {
        method: "editMessageReplyMarkup",
        chat_id: 1,
        message_id: 1,
        reply_markup: expect.objectContaining({
          inline_keyboard: expect.any(Array),
        }) as any,
      },
    ] satisfies ApiRequest[]);
  });

  it("should send info about anime title", async () => {
    const [api, reqs] = getTestApi();
    const ctx = getTestContext(api, "callback_query", {
      id: "1",
      from: { id: 1 },
      message: {
        message_id: 1,
        chat: { id: 1 },
        from: { id: 4242 },
      },
    });

    mockResponse(api, "sendPhoto", {
      message_id: 2,
      chat: { id: 1 },
      from: { id: 2 },
    } as Message);

    await handler.onAnimeTitleData(ctx, { type: "animes", titleId: "47", fromId: 1 });

    const text = dedent`
      <b>Russian 47</b>
      | <b>English 47</b>
      | <b>Japanese 47</b>
      | <a href="some_url">Shikimori</a>
      <b>Тип: </b>TV сериал
      <b>Дата: </b>23.08.2015 | 16.09.2016
      <b>Оценка: </b>5.86/10
      <b>Статус: </b>Выпущено
      <b>Эпизоды: </b>12 эп. по 24 мин.
      <b>Рейтинг: </b>PG-13
      <b>Жанры: </b>Genre #1, Genre #2
      <b>Студии: </b>Studio One, Studio Two
      <b>Озвучка: </b>dub1, dub2
      <b>Субтитры: </b>sub1, sub2

      <blockquote expandable>Hey, <a href="/another/url">Eiko</a>!</blockquote>
    `;

    expect(reqs).toEqual([
      {
        method: "answerCallbackQuery",
        callback_query_id: "1",
      },
      {
        method: "sendPhoto",
        chat_id: 1,
        photo: "/url/to/poster",
        caption: "Russian 47 | English 47",
      },
      {
        method: "sendMessage",
        chat_id: 1,
        text: text,
        parse_mode: "HTML",
        link_preview_options: { is_disabled: true },
        reply_parameters: {
          message_id: 2,
          allow_sending_without_reply: true,
        },
      },
    ] satisfies ApiRequest[]);
  });
});
