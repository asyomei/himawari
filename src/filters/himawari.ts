import type { Context } from "grammy";
import { splitOnce } from "#/utils/split-once";

type NarrowMatch<C extends Context, T extends C["match"]> = {
  [K in keyof C]: K extends "match" ? (T extends C[K] ? T : never) : C[K];
};

export function himawari(...commands: string[]) {
  return <C extends Context>(ctx: C): ctx is NarrowMatch<C, string> => {
    let text = ctx.msg?.text;
    if (!text) return false;

    let lower = text.toLowerCase();
    if (lower.startsWith("himawari ") || lower.startsWith("химавари ")) {
      text = splitOnce(text, /\s+/)[1];
    } else if (ctx.chat?.type !== "private") {
      return false;
    }

    lower = text.toLowerCase();
    if (commands.some(c => lower.startsWith(c + " "))) {
      (ctx as any).match = splitOnce(text, /\s+/)[1];
      return true;
    }

    return false;
  };
}
