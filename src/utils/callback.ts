import type { Context, Filter } from "grammy";
import { ZodError, type ZodObject, type ZodRawShape, z } from "zod";

type FilteredContext = Filter<Context, "callback_query:data">;
type RawObj<T extends ZodRawShape> = z.output<ZodObject<T>>;

export type CallbackContext<T, C extends Context = Context> = Filter<C, "callback_query:data"> & {
  data: T;
};

export type CallbackData<T extends Callback<any>> = z.output<T["schema"]>;

export class Callback<T extends ZodRawShape> {
  constructor(
    readonly ns: string,
    rawSchema: T,
  ) {
    this.schema = z.object(rawSchema);
    this.keys = Object.keys(rawSchema);
  }

  readonly schema: ZodObject<T>;
  private keys: string[];

  make(args: RawObj<T>): string {
    args = this.schema.parse(args);
    const data: unknown[] = [];

    for (const k of this.keys) {
      data.push(args[k]);
    }

    return this.ns + JSON.stringify(data);
  }

  has() {
    return <C extends FilteredContext>(ctx: C): ctx is C & { data: RawObj<T> } => {
      let rawData = ctx.callbackQuery.data;

      const actualNS = rawData.slice(0, rawData.indexOf("["));
      if (this.ns !== actualNS) return false;
      rawData = rawData.slice(this.ns.length);

      let data: RawObj<T>;
      try {
        data = this.parse(rawData);
      } catch (e) {
        if (e instanceof SyntaxError || e instanceof ZodError) return false;
        throw e;
      }

      (ctx as any).data = data;
      return true;
    };
  }

  parse(rawData: string): RawObj<T> {
    rawData = rawData.slice(rawData.indexOf("["));
    const keys = this.keys;
    const values = JSON.parse(rawData);

    const res: Record<string, unknown> = {};
    for (let i = 0; i < keys.length; i++) {
      res[keys[i]] = values[i];
    }

    return this.schema.parse(res);
  }

  static async checkId(ctx: CallbackContext<{ fromId: number }>) {
    if (ctx.from.id === ctx.data.fromId) return true;

    await ctx.answerCallbackQuery("Эта кнопка не для вас");
    return false;
  }
}
