import { Composer, type Context } from "grammy";

export abstract class BaseHandler<C extends Context = Context> {
  constructor() {
    this.init(this.comp);
  }

  protected abstract init(comp: Composer<C>): void;

  private comp = new Composer<C>();

  readonly middleware = this.comp.middleware.bind(this.comp);
}
