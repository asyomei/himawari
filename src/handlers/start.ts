import { type CommandContext, Composer } from "grammy"
import type { MyContext } from "#/types/context"

const comp = new Composer<MyContext>()
export { comp as startHandler }

comp.on("message:text").command("start", start)

const START_TEXT = `Приветик, %s!
/help_chat - Разговор с нейросетью
/help_anime - Поиск аниме, манги и их персонажей`

async function start(ctx: CommandContext<MyContext>): Promise<void> {
  await ctx.reply(START_TEXT.replace("%s", ctx.from?.first_name ?? "пользователь"))
}
