import { z } from "zod";
import { rating } from "./basic";

export type AnimeKind = z.infer<typeof animeKind>;
export const animeKind = z.enum([
  "tv",
  "movie",
  "ova",
  "ona",
  "special",
  "tv_special",
  "music",
  "pv",
  "cm",
]);

export type AnimeStatus = z.infer<typeof animeStatus>;
export const animeStatus = z.enum(["anons", "ongoing", "released"]);

export type Anime = z.infer<typeof anime>;
export const anime = z.object({
  id: z.string(),
  name: z.string(),
  russian: z.string().nullish(),
  japanese: z.string().nullish(),
  kind: animeKind,
  rating: rating,
  score: z.number(),
  status: animeStatus,
  episodes: z.number().int(),
  episodesAired: z.number().int().nullish(),
  duration: z.number().int().nullish(),
  airedOn: z.object({ date: z.coerce.date().nullish() }).transform(x => x.date),
  releasedOn: z.object({ date: z.coerce.date().nullish() }).transform(x => x.date),
  url: z.string().url(),
  poster: z.object({ originalUrl: z.string().url() }).transform(x => x.originalUrl),
  fandubbers: z.array(z.string()),
  fansubbers: z.array(z.string()),
  nextEpisodeAt: z.coerce.date().nullish(),
  isCensored: z.boolean().nullish(),
  genres: z.array(z.object({ russian: z.string() }).transform(x => x.russian)),
  studios: z.array(z.object({ name: z.string() }).transform(x => x.name)),
  descriptionHtml: z.string().nullish(),
});

export type Screenshots = z.infer<typeof screenshots>;
export const screenshots = z.object({
  screenshots: z.array(
    z.object({
      id: z.string(),
      originalUrl: z.string().url(),
    }),
  ),
});

export type VideoKind = z.infer<typeof videoKind>;
export const videoKind = z.enum([
  "pv",
  "character_trailer",
  "cm",
  "op",
  "ed",
  "op_ed_clip",
  "clip",
  "other",
  "episode_preview",
]);

const urlLike = z.preprocess(x => String(x).replace(/^\/\//, "https://"), z.string().url());

export type Videos = z.infer<typeof videos>;
export const videos = z.object({
  videos: z.array(
    z.object({
      id: z.string(),
      kind: videoKind,
      name: z.string().nullish(),
      imageUrl: urlLike,
      playerUrl: urlLike,
      url: urlLike,
    }),
  ),
});
