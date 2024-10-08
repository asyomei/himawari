import { run } from "@grammyjs/runner"
import { Bot, GrammyError } from "grammy"
import { env } from "./env"
import { setupHandlers } from "./handlers"
import { setupMiddlewares } from "./middlewares"
import type { MyContext } from "./types/context"

start()

export async function start() {
  const bot = new Bot<MyContext>(env.BOT_TOKEN)
  bot.catch(({ error, stack }) => {
    if (error instanceof GrammyError) {
      if (error.description.includes("the same")) return
    }

    console.error(stack)
  })

  setupMiddlewares(bot)
  setupHandlers(bot)

  run(bot, {
    runner: {
      fetch: {
        allowed_updates: ["message", "callback_query", "inline_query", "chosen_inline_result"],
      },
    },
  })

  await bot.init()
  const { username } = bot.botInfo
  console.log(`@${username} started`)
}
