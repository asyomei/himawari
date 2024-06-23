import type { Anime, Basic, Type } from "./types";

export interface IShikimoriService {
  search(type: Type, search: string, page?: number): Promise<Basic[]>;
  anime(id: string): Promise<Anime | undefined>;
}
