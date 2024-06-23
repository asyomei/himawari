import type { Context, Filter } from "grammy";
import { type AnyZodObject, ZodError, type z } from "zod";

export type CallbackContext<T, C extends Context = Context> = Filter<C, "callback_query:data"> & {
  data: T;
};

export class Callbacks<T extends Record<string, AnyZodObject>> {
  constructor(private schemas: T) {
    this.keys = {} as Record<keyof T, string[]>;
    for (const k in schemas) {
      this.keys[k] = Object.keys(schemas[k].shape);
    }
  }

  private keys: Record<keyof T, string[]>;

  make<K extends string & keyof T>(ns: K, args: z.infer<T[K]>): string {
    args = this.schemas[ns].parse(args);
    const data: unknown[] = [];

    for (const k of this.keys[ns]) {
      data.push(args[k]);
    }

    return ns + JSON.stringify(data);
  }

  has<K extends string & keyof T>(ns: K, check?: (ctx: CallbackContext<z.infer<T[K]>>) => boolean) {
    return <C extends Filter<Context, "callback_query:data">>(
      ctx: C,
    ): ctx is C & { data: z.infer<T[K]> } => {
      let rawData = ctx.callbackQuery.data;

      const actualNS = rawData.slice(0, rawData.indexOf("["));
      if (ns !== actualNS) return false;
      rawData = rawData.slice(ns.length);

      let data: z.infer<T[K]>;
      try {
        data = this.parse(ns, rawData);
      } catch (e) {
        if (e instanceof SyntaxError || e instanceof ZodError) return false;
        throw e;
      }

      (ctx as any).data = data;
      return check ? check(ctx as any) : true;
    };
  }

  parse<K extends string & keyof T>(ns: K, rawData: string): z.infer<T[K]> {
    rawData = rawData.slice(rawData.indexOf("["));
    const keys = this.keys[ns];
    const values = JSON.parse(rawData);

    const res: Record<string, unknown> = {};
    for (let i = 0; i < keys.length; i++) {
      res[keys[i]] = values[i];
    }

    return this.schemas[ns].parse(res);
  }

  static async checkId(ctx: CallbackContext<{ fromId: number }>) {
    if (ctx.from.id === ctx.data.fromId) return true;

    await ctx.answerCallbackQuery("Эта кнопка не для вас");
    return false;
  }
}
