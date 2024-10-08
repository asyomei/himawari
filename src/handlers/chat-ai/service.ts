import assert from "node:assert"
import { Storage } from "#/storage"

interface Message {
  role: "assistant" | "user"
  content: string
}

const API_URL = "https://nexra.aryahcr.cc/api/chat/gpt"
const storage = new Storage<Message[]>("chat-ai")

export async function sayMessage(id: number, text: string): Promise<string> {
  const history = (await storage.load(id)) ?? []

  const answer = await continueDialog(text, history)
  await storage.save(id, history)

  return answer
}

export async function clearHistory(id: number): Promise<void> {
  await storage.delete(id)
}

async function continueDialog(text: string, history: Message[]): Promise<string> {
  const res = await fetch(API_URL, {
    headers: { "Content-Type": "application/json" },
    method: "POST",
    body: JSON.stringify({
      messages: history,
      prompt: text,
      model: "GPT-4",
      markdown: false,
    }),
  })

  const answer = await res.json().then(x => x.gpt)
  assert(typeof answer === "string")

  history.push({ role: "user", content: text }, { role: "assistant", content: answer })
  return answer
}
