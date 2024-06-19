import { Bot, GrammyError } from "grammy";

export function createBot(token: string) {
  const bot = new Bot(token);

  bot.catch(({ error, stack }) => {
    if (error instanceof GrammyError) {
      if (error.description.includes("message is not modified")) return;
    }

    console.error(stack);
  });

  return bot;
}
