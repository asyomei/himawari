import { Composer, type Context } from "grammy";
import type { MyContext } from "#/types/context";

export abstract class BaseHandler<C extends Context = MyContext> {
  protected readonly comp = new Composer<C>();

  readonly middleware = this.comp.middleware.bind(this.comp);
}
