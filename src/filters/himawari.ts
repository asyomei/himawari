import type { Context } from "grammy";
import { splitOnce } from "#/utils/split-once";

type NarrowMatch<C extends Context, T extends C["match"]> = {
  [K in keyof C]: K extends "match" ? (T extends C[K] ? T : never) : C[K];
};

export function himawari(...commands: string[]) {
  return <C extends Context>(ctx: C): ctx is NarrowMatch<C, string> => {
    let text = ctx.msg?.text?.toLowerCase();
    if (!text) return false;

    if (text.startsWith("himawari") || text.startsWith("химавари")) {
      text = splitOnce(text, /\s+/)[1];
    } else if (ctx.chat?.type !== "private") {
      return false;
    }

    if (commands.some(c => text!.startsWith(c))) {
      (ctx as any).match = splitOnce(text, /\s+/)[1];
      return true;
    }

    return false;
  };
}
