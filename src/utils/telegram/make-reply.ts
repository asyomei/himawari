import type { ReplyParameters } from "grammy/types";

export function makeReply(message_id: number): ReplyParameters {
  return {
    message_id,
    allow_sending_without_reply: true,
  };
}
