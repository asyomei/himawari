import { z } from "zod";

export type MangaKind = z.infer<typeof mangaKind>;
export const mangaKind = z.enum([
  "manga",
  "manhwa",
  "manhua",
  "light_novel",
  "novel",
  "one_shot",
  "doujin",
]);

export type MangaStatus = z.infer<typeof mangaStatus>;
export const mangaStatus = z.enum(["anons", "ongoing", "released", "paused", "discontinued"]);

export type Manga = z.infer<typeof manga>;
export const manga = z.object({
  id: z.string(),
  name: z.string(),
  russian: z.string().nullish(),
  japanese: z.string().nullish(),
  kind: mangaKind,
  score: z.number(),
  status: mangaStatus,
  volumes: z.number(),
  chapters: z.number(),
  airedOn: z.object({ date: z.coerce.date().nullish() }).transform(x => x.date),
  releasedOn: z.object({ date: z.coerce.date().nullish() }).transform(x => x.date),
  url: z.string().url(),
  poster: z.object({ originalUrl: z.string().url() }).transform(x => x.originalUrl),
  isCensored: z.boolean().nullish(),
  genres: z.array(z.object({ russian: z.string() }).transform(x => x.russian)),
  publishers: z.array(z.object({ name: z.string() }).transform(x => x.name)),
  descriptionHtml: z.string().nullish(),
});
