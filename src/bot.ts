import { Bot, GrammyError } from "grammy";
import type { MyContext } from "./types/context";

export function createBot(token: string) {
  const bot = new Bot<MyContext>(token);

  bot.catch(({ error, stack }) => {
    if (error instanceof GrammyError) {
      if (error.description.includes("message is not modified")) return;
    }

    console.error(stack);
  });

  return bot;
}
