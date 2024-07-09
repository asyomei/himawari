import type { Context } from "grammy";
import { splitOnce } from "#/utils/split-once";

type NarrowMatch<C extends Context, T extends C["match"]> = {
  [K in keyof C]: K extends "match" ? (T extends C[K] ? T : never) : C[K];
};

export function himawari(...commands: string[]) {
  return <C extends Context>(ctx: C): ctx is NarrowMatch<C, string> => {
    let text = ctx.msg?.text;
    if (!text) return false;

    let lower = splitOnce(text, /\s+/)[0].toLowerCase();
    if (lower === "himawari" || lower === "химавари") {
      text = splitOnce(text, /\s+/)[1];
    } else if (ctx.chat?.type !== "private") {
      return false;
    }

    const rest = splitOnce(text, /\s+/);
    lower = rest[0].toLowerCase();
    if (commands.some(c => c === lower)) {
      (ctx as any).match = rest[1];
      return true;
    }

    return false;
  };
}
