import type { Context } from "grammy";

export async function unhandledUpdate(ctx: Context) {
  if (ctx.callbackQuery?.data) {
    const data = ctx.callbackQuery.data;

    if (data !== "nop") {
      console.log(`Callback query with data "${data}" didn't handle`);
    }
    await ctx.answerCallbackQuery();
  } else if (ctx.inlineQuery) {
    const query = ctx.inlineQuery.query;

    if (query !== "nop") {
      console.log(`Callback query with data "${query}" didn't handle`);
    }
    await ctx.answerInlineQuery([], { cache_time: 0 });
  } else if (ctx.chosenInlineResult) {
    const id = ctx.chosenInlineResult.result_id;
    console.log(`Chosen inline result with id "${id}" didn't handle`);
  }
}
