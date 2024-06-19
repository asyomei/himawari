import { Composer, type Context } from "grammy";

export abstract class BaseHandler<C extends Context = Context> {
  protected readonly comp = new Composer<C>();

  readonly middleware = this.comp.middleware.bind(this.comp);
}
