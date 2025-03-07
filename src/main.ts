import { run } from '@grammyjs/runner'
import { bot } from './bot'
import './middlewares'
import './handlers'

await bot.init()

run(bot, {
  runner: {
    fetch: {
      allowed_updates: ['message', 'callback_query', 'inline_query', 'chosen_inline_result'],
    },
  },
})

console.log(`@${bot.botInfo.username} started`)
