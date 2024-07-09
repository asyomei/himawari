import type { Anime, Basic, Manga, Screenshot, Type, Video } from "./types";

export interface IShikimoriService {
  search(type: Type, search: string, page?: number, limit?: number): Promise<Basic[]>;
  anime(id: string): Promise<Anime | undefined>;
  screenshots(animeId: string): Promise<Screenshot[]>;
  videos(animeId: string): Promise<Video[]>;
  manga(id: string): Promise<Manga | undefined>;
}
