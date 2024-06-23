import type { ReplyParameters } from "grammy/types";

export function makeReply(m?: number | { message_id: number }): ReplyParameters | undefined {
  if (m == null) return;
  const message_id = typeof m === "number" ? m : m.message_id;

  return { message_id, allow_sending_without_reply: true };
}
