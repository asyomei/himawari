import { type Context, type Filter, InlineKeyboard } from "grammy";
import { himawari } from "#/filters/himawari";
import {
  type AnimePicService,
  type GifType,
  type PicType,
  zGifType,
  zPicType,
} from "#/services/anime-pic";
import { makeReply } from "#/utils/telegram";
import { BaseHandler } from "./base";

export class AnimePicHandler extends BaseHandler {
  constructor(private pic: AnimePicService) {
    super();

    const msg = this.comp.on("message:text");
    const addPic = (type: PicType, ...names: string[]) =>
      msg.filter(himawari(type, ...names), ctx => this.onPicCommand(ctx, type));
    const addGif = (type: GifType, ...names: string[]) =>
      msg.filter(himawari(type, ...names), ctx => this.onGifCommand(ctx, type));

    addPic("kitsune", "кицунэ", "кицуне", "anime-fox", "аниме-лиса");
    addPic("neko", "нэко", "неко", "anime-cat", "anime-meow", "аниме-кошка", "аниме-мяу");
    addPic("waifu", "вайфу");
    addGif("baka", "бака");
    addGif("bite", "кусь");
    addGif("blush", "смущение");
    addGif("bored", "скука");
    addGif("cry", "плак");
    addGif("cuddle", "тереться");
    addGif("dance", "танцы");
    addGif("facepalm", "рукалицо");
    addGif("feed", "кормить");
    addGif("handhold", "держаться-за-руки");
    addGif("handshake", "рукопожатие");
    addGif("happy", "ureshii", "счастье", "радость");
    addGif("highfive", "дай-пять");
    addGif("hug", "обнимашки");
    addGif("kick", "пинок");
    addGif("kiss", "поцелуй");
    addGif("laugh", "смех");
    addGif("lurk", "затаиться");
    addGif("nod", "кивок");
    addGif("nom", "ом", "ном");
    addGif("nope", "неа");
    addGif("pat", "гладить");
    addGif("peck", "щечка", "щёчка");
    addGif("poke", "тык");
    addGif("punch", "удар");
    addGif("shoot", "стрелять");
    addGif("shrug", "хз");
    addGif("slap", "пощечина", "пощёчина");
    addGif("sleep", "споки", "спать");
    addGif("smile", "улыбка");
    addGif("smug", "ухмылка");
    addGif("stare", "пристально");
    addGif("think", "думать");
    addGif("thumbsup", "лайк");
    addGif("tickle", "щекотать", "щекотка");
    addGif("wave", "махать");
    addGif("wink", "подмигивание");
    addGif("yawn", "зевок", "зевать");
    addGif("yeet", "бросок");

    msg.filter(himawari("anime-pic"), ctx => this.onHelpCommand(ctx));
  }

  async onPicCommand(ctx: Context, type: PicType) {
    const pic = await this.pic.pic(type);
    await ctx.replyWithPhoto(pic.url, {
      caption: pic.source_url,
    });
  }

  async onGifCommand(ctx: Filter<Context, "message:text">, type: GifType) {
    const gif = await this.pic.gif(type);
    await ctx.replyWithAnimation(gif.url, {
      reply_parameters: makeReply(ctx.message.reply_to_message),
      reply_markup: InlineKeyboard.from([
        [InlineKeyboard.switchInlineCurrent(gif.anime_name, `anime ${gif.anime_name}`)],
      ]),
    });
  }

  async onHelpCommand(ctx: Context) {
    const pics = [...zPicType.options, ...zGifType.options];
    await ctx.reply(`<b>Доступные картинки (химавари &lt;команда&gt;):</b>\n${pics.join(", ")}`, {
      parse_mode: "HTML",
    });
  }
}
