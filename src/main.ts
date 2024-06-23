import { type RunnerHandle, run } from "@grammyjs/runner";
import type { Redis } from "ioredis";
import { once } from "lodash-es";
import { createBot } from "./bot";
import { env } from "./env";
import { setupHandlers } from "./handlers";
import { setupMiddlewares } from "./middlewares";
import { createRedis } from "./redis";
import { setupThrottlers } from "./transformers";

let redis: Redis | undefined;
let runner: RunnerHandle | undefined;

const exit = once(stop);
process.on("SIGINT", exit).on("SIGTERM", exit).on("SIGHUP", exit);

await start();

async function start() {
  redis = createRedis(env.REDIS_URL);

  const bot = createBot(env.BOT_TOKEN);
  setupThrottlers(bot.api);
  setupMiddlewares(bot, { redis });
  setupHandlers(bot);

  runner = run(bot, {
    runner: {
      fetch: {
        allowed_updates: ["message", "callback_query", "inline_query"],
      },
    },
  });

  await bot.init();
  console.log(`@${bot.botInfo.username} started`);
}

async function stop() {
  console.log("Goodbye!");

  if (runner?.isRunning()) {
    await runner.stop();
  }

  await redis?.quit();

  process.exit();
}
