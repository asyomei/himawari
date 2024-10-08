import assert from "node:assert"
import { Storage } from "#/storage"

interface Message {
  role: "assistant" | "user"
  content: string
}

const API_URL = "https://nexra.aryahcr.cc/api/chat/complements"
const storage = new Storage<Message[]>("chat-ai")

export async function sayMessage(id: number, text: string): Promise<string> {
  const dialog = (await storage.load(id)) ?? []

  dialog.push({ role: "user", content: text })
  const answer = await continueDialog(dialog)
  dialog.push({ role: "assistant", content: answer })

  await storage.save(id, dialog)

  return answer
}

export async function clearHistory(id: number): Promise<void> {
  await storage.delete(id)
}

async function continueDialog(dialog: Message[]): Promise<string> {
  dialog = [{ role: "assistant", content: "" }, ...dialog]

  const resp = await fetch(API_URL, {
    headers: { "Content-Type": "application/json" },
    method: "POST",
    body: JSON.stringify({
      messages: dialog,
      model: "gemini-pro",
      markdown: false,
      stream: false,
    }),
  })

  const answer = parseResponse(await resp.text())
  assert(typeof answer.message === "string")

  return answer.message
}

function parseResponse(response: string): any {
  const begin = response.indexOf("{")
  const end = response.lastIndexOf("}")

  return JSON.parse(response.slice(begin, end + 1))
}
