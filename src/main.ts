import { run } from "@grammyjs/runner";
import { createBot } from "./bot";
import { env } from "./env";
import { setupHandlers } from "./handlers";
import { setupMiddlewares } from "./middlewares";
import { createRedis } from "./redis";
import { setupThrottlers } from "./transformers";

await start();

async function start() {
  const redis = createRedis(env.REDIS_URL);
  await redis.connect();

  const bot = createBot(env.BOT_TOKEN);
  setupThrottlers(bot.api);
  setupMiddlewares(bot, { redis });
  setupHandlers(bot, { redis });

  run(bot, {
    runner: {
      fetch: {
        allowed_updates: ["message", "callback_query", "inline_query", "chosen_inline_result"],
      },
    },
  });

  await bot.init();
  console.log(`@${bot.botInfo.username} started`);
}
