import type { Context } from "grammy";
import { himawari } from "#/filters/himawari";
import type { AnimalPicService, Type } from "#/services/animal-pic";
import { BaseHandler } from "./base";

export class AnimalHandler extends BaseHandler {
  constructor(private pic: AnimalPicService) {
    super();

    const msg = this.comp.on("message:text");
    msg.filter(himawari("cat", "meow", "кот", "кошка", "мяу"), ctx => this.onCommand(ctx, "cat"));
    msg.filter(himawari("dog", "woof", "пес", "собака", "гав"), ctx => this.onCommand(ctx, "dog"));
    msg.filter(himawari("fox", "лис", "лиса"), ctx => this.onCommand(ctx, "fox"));
    msg.filter(himawari("fish", "рыба", "рыбка"), ctx => this.onCommand(ctx, "fish"));
    msg.filter(himawari("alpaca", "альпака"), ctx => this.onCommand(ctx, "alpaca"));
    msg.filter(himawari("bird", "птица", "птичка"), ctx => this.onCommand(ctx, "bird"));
  }

  async onCommand(ctx: Context, type: Type) {
    await ctx.replyWithPhoto(await this.pic.get(type));
  }
}
