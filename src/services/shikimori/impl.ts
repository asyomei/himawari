import request from "graphql-request";
import { z } from "zod";
import { makeGraphql } from "#/utils/make-graphql";
import type { IShikimoriService } from "./interface";
import { type Anime, type Basic, type Type, anime, basic, type } from "./types";

const GRAPHQL_URL = "https://shikimori.one/api/graphql";

const getSearchGql = (type: Type) =>
  makeGraphql(u => {
    const search = u.var("search", "String!");
    const page = u.var("page", "PositiveInt");
    return u.query(type, { search, page, limit: 10 }, basic);
  });
const searchSchema = z.record(type, z.array(basic));

const animeGql = makeGraphql(u => {
  const ids = u.var("ids", "String!");
  return u.query("animes", { ids }, anime);
});
const animeSchema = z.object({ animes: z.array(anime).max(1) });

export class ShikimoriService implements IShikimoriService {
  async search(type: Type, search: string, page?: number): Promise<Basic[]> {
    const res = await request(GRAPHQL_URL, getSearchGql(type), { search, page });
    return searchSchema.parse(res)[type]!;
  }

  async anime(id: string): Promise<Anime | undefined> {
    const res = await request(GRAPHQL_URL, animeGql, { ids: id });
    return animeSchema.parse(res).animes[0];
  }
}
