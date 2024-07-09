import { z } from "zod";

const zUrlLike = z.preprocess(x => String(x).replace(/^\/\//, "https://"), z.string().url());

export const zType = z.enum(["animes", "mangas"]);
export const zBasic = z.object({
  id: z.string(),
  name: z.string(),
  russian: z.string().nullish(),
  isCensored: z.boolean().nullish(),
});

export const zRating = z.enum(["none", "g", "pg", "pg_13", "r", "r_plus", "rx"]);
export const zScreenshot = z.object({
  id: z.string(),
  originalUrl: z.string().url(),
});
export const zVideoKind = z.enum([
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
export const zVideo = z.object({
  id: z.string(),
  kind: zVideoKind,
  name: z.string().nullish(),
  imageUrl: zUrlLike,
  playerUrl: zUrlLike,
  url: zUrlLike,
});

export const zAnimeKind = z.enum([
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
export const zAnimeStatus = z.enum(["anons", "ongoing", "released"]);
export const zAnime = z.object({
  id: z.string(),
  name: z.string(),
  russian: z.string().nullish(),
  japanese: z.string().nullish(),
  kind: zAnimeKind,
  rating: zRating,
  score: z.number(),
  status: zAnimeStatus,
  episodes: z.number().int(),
  episodesAired: z.number().int().nullish(),
  duration: z.number().int().nullish(),
  airedOn: z.object({ date: z.coerce.date().nullish() }).nullish(),
  releasedOn: z.object({ date: z.coerce.date().nullish() }).nullish(),
  url: z.string().url(),
  poster: z.object({ originalUrl: z.string().url() }),
  fandubbers: z.array(z.string()),
  fansubbers: z.array(z.string()),
  nextEpisodeAt: z.coerce.date().nullish(),
  isCensored: z.boolean().nullish(),
  genres: z.object({ russian: z.string() }).array(),
  studios: z.object({ name: z.string() }).array(),
  descriptionHtml: z.string().nullish(),
  descriptionSource: z.string().nullish(),
});

export const zMangaKind = z.enum([
  "manga",
  "manhwa",
  "manhua",
  "light_novel",
  "novel",
  "one_shot",
  "doujin",
]);
export const zMangaStatus = z.enum(["anons", "ongoing", "released", "paused", "discontinued"]);
export const zManga = z.object({
  id: z.string(),
  name: z.string(),
  russian: z.string().nullish(),
  japanese: z.string().nullish(),
  kind: zMangaKind,
  score: z.number(),
  status: zMangaStatus,
  volumes: z.number(),
  chapters: z.number(),
  airedOn: z.object({ date: z.coerce.date().nullish() }).nullish(),
  releasedOn: z.object({ date: z.coerce.date().nullish() }).nullish(),
  url: z.string().url(),
  poster: z.object({ originalUrl: z.string().url() }),
  isCensored: z.boolean().nullish(),
  genres: z.object({ russian: z.string() }).array(),
  publishers: z.object({ name: z.string() }).array(),
  descriptionHtml: z.string().nullish(),
  descriptionSource: z.string().nullish(),
});
