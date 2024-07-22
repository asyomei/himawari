import { z } from "zod";

export type PicType = z.output<typeof zPicType>;
export type GifType = z.output<typeof zGifType>;

export const zPicType = z.enum(["kitsune", "neko", "waifu"]);
const zPicObj = z.object({
  results: z
    .object({
      source_url: z.string().url(),
      url: z.string().url(),
    })
    .array()
    .max(1),
});

export const zGifType = z.enum([
  "baka",
  "bite",
  "blush",
  "bored",
  "cry",
  "cuddle",
  "dance",
  "facepalm",
  "feed",
  "handhold",
  "handshake",
  "happy",
  "highfive",
  "hug",
  "kick",
  "kiss",
  "laugh",
  "lurk",
  "nod",
  "nom",
  "nope",
  "pat",
  "peck",
  "poke",
  "pout",
  "punch",
  "shoot",
  "shrug",
  "slap",
  "sleep",
  "smile",
  "smug",
  "stare",
  "think",
  "thumbsup",
  "tickle",
  "wave",
  "wink",
  "yawn",
  "yeet",
]);
const zGifObj = z.object({
  results: z
    .object({
      anime_name: z.string(),
      url: z.string().url(),
    })
    .array()
    .max(1),
});

export class AnimePicService {
  async pic(type: PicType) {
    const res = await fetch(`https://nekos.best/api/v2/${type}`);
    return zPicObj.parse(await res.json()).results[0];
  }

  async gif(type: GifType) {
    const res = await fetch(`https://nekos.best/api/v2/${type}`);
    return zGifObj.parse(await res.json()).results[0];
  }
}
