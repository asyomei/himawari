import type { z } from "zod";
import type {
  zAnime,
  zAnimeKind,
  zAnimeStatus,
  zBasic,
  zManga,
  zMangaKind,
  zMangaStatus,
  zRating,
  zScreenshot,
  zType,
  zVideo,
  zVideoKind,
} from "./schemas";

export type Type = z.output<typeof zType>;
export type Basic = z.output<typeof zBasic>;

export type Rating = z.output<typeof zRating>;
export type Screenshot = z.output<typeof zScreenshot>;
export type VideoKind = z.output<typeof zVideoKind>;
export type Video = z.output<typeof zVideo>;

export type AnimeKind = z.output<typeof zAnimeKind>;
export type AnimeStatus = z.output<typeof zAnimeStatus>;
export type Anime = z.output<typeof zAnime>;

export type MangaKind = z.output<typeof zMangaKind>;
export type MangaStatus = z.output<typeof zMangaStatus>;
export type Manga = z.output<typeof zManga>;
