import type { Anime, Basic, Screenshots, Type, Videos } from "./types";

export interface IShikimoriService {
  search(type: Type, search: string, page?: number): Promise<Basic[]>;
  anime(id: string): Promise<Anime | undefined>;
  screenshots(animeId: string): Promise<Screenshots | undefined>;
  videos(animeId: string): Promise<Videos | undefined>;
}
