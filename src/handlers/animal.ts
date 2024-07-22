import type { Context } from "grammy";
import { himawari } from "#/filters/himawari";
import type { AnimalPicService, Type } from "#/services/animal-pic";
import { BaseHandler } from "./base";

export class AnimalHandler extends BaseHandler {
  constructor(private pic: AnimalPicService) {
    super();

    const msg = this.comp.on("message:text");
    const addAnimal = (type: Type, ...names: string[]) =>
      msg.filter(himawari(type, ...names), ctx => this.onCommand(ctx, type));

    addAnimal("cat", "meow", "кот", "кошка", "мяу");
    addAnimal("dog", "woof", "пес", "собака", "гав");
    addAnimal("fox", "лис", "лиса");
    addAnimal("fish", "рыба", "рыбка");
    addAnimal("alpaca", "альпака");
    addAnimal("bird", "птица", "птичка");
  }

  async onCommand(ctx: Context, type: Type) {
    await ctx.replyWithPhoto(await this.pic.get(type));
  }
}
