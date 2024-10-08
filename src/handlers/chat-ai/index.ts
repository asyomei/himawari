import { setTimeout } from "node:timers/promises"
import mdparser from "@deskeen/markdown"
import { Composer, type Filter, type HearsContext } from "grammy"
import type { MyContext } from "#/types/context"
import { clearHistory, sayMessage } from "./service"

const comp = new Composer<MyContext>()
export { comp as chatAiHandler }

comp.on("message:text").command("help_chat", help)
comp.on("message:text").hears(/^(?:подсолнушка|хима|sunflowey|hima),?\s+(.+)/is, chat)

const HELP_TEXT = `<b>Разговор с нейросетью</b>
<i>(используется nexra.aryahcr.cc)</i>

подсолнушка [текст] ИЛИ хима [текст] - поговорить
подсолнушка забудь ИЛИ хима забудь - очистить историю разговора`
async function help(ctx: MyContext): Promise<void> {
  await ctx.reply(HELP_TEXT, {
    link_preview_options: { is_disabled: true },
    parse_mode: "HTML",
  })
}

async function chat(ctx: HearsContext<Filter<MyContext, "message:text">>): Promise<void> {
  const text = ctx.match[1]!

  if (/^забудь|forget$/i.test(text)) {
    await forgetChat(ctx)
    return
  }

  const m = await ctx.reply("<i>Ожидайте...</i>", {
    reply_parameters: { message_id: ctx.msgId },
    parse_mode: "HTML",
  })

  const answer = await sayMessage(ctx.from.id, text).catch(console.error)
  if (!answer) {
    await m.editText("<i>Возникла ошибка</i> :(", { parse_mode: "HTML" })
    return
  }

  try {
    await m.editText(parseAnswer(answer), { parse_mode: "HTML" })
  } catch {
    const text = `${answer}\n\n----------\n[Во время форматирования произошла ошибка. Ответ был отправлен как есть]`
    await m.editText(text)
  }
}

async function forgetChat(ctx: Filter<MyContext, "message:text">): Promise<void> {
  await clearHistory(ctx.from.id)

  const m = await ctx.reply("<i>Моя память была очищена</i>", {
    reply_parameters: { message_id: ctx.msgId },
    parse_mode: "HTML",
  })

  await setTimeout(3000)
  await ctx.deleteMessages([ctx.msgId, m.message_id]).catch(() => {})
}

function parseAnswer(text: string): string {
  let html: string = mdparser.parse(text, {
    allowHeader: false,
    allowUnorderedList: true,
    allowUnorderedNestedList: false,
    allowOrderedList: false,
    allowOrderedNestedList: false,
    allowHorizontalLine: false,
    allowFootnote: false,
    allowHTMLAttributes: false,
  }).innerHTML

  html = html
    .replaceAll("<p>", "")
    .replaceAll("</p>", "\n")
    .replaceAll("<br>", "\n")
    .replaceAll("<sup>", "^(")
    .replaceAll("</sup>", ")")
    .replaceAll("<sub>", "(")
    .replaceAll("</sub>", ")")

  const lines = html.split("\n")
  for (let i = 0; i < lines.length; i++) {
    if (lines[i]!.startsWith("* ")) {
      lines[i] = lines[i]!.replace("* ", "• ")
    }
  }

  html = lines.join("\n")
  return html
}
