import type { Context } from "grammy";

export async function unusedCallback(ctx: Context) {
  if (ctx.callbackQuery?.data) {
    const data = ctx.callbackQuery.data;

    if (data !== "nop") {
      console.log(`Callback query with data "${data}" didn't handle`);
    }
    await ctx.answerCallbackQuery();
  } else if (ctx.inlineQuery) {
    await ctx.answerInlineQuery([], { cache_time: 0 });
  }
}
