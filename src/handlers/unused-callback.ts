import type { Context } from "grammy";

export async function unusedCallback(ctx: Context) {
  const data = ctx.callbackQuery?.data;
  if (!data) return;

  if (data !== "nop") {
    console.log(`Callback query with data "${data}" didn't handle`);
  }
  await ctx.answerCallbackQuery();
}
