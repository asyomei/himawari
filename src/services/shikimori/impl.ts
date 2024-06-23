import request from "graphql-request";
import { z } from "zod";
import { makeGraphql } from "#/utils/make-graphql";
import type { IShikimoriService } from "./interface";
import {
  type Anime,
  type Basic,
  type Screenshots,
  type Type,
  type Videos,
  anime,
  basic,
  screenshots,
  type,
  videos,
} from "./types";

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

const screenshotsGql = makeGraphql(u => {
  const ids = u.var("ids", "String!");
  return u.query("animes", { ids }, screenshots);
});
const screenshotsSchema = z.object({ animes: z.array(screenshots).max(1) });

const videosGql = makeGraphql(u => {
  const ids = u.var("ids", "String!");
  return u.query("animes", { ids }, videos);
});
const videosSchema = z.object({ animes: z.array(videos).max(1) });

export class ShikimoriService implements IShikimoriService {
  async search(type: Type, search: string, page?: number): Promise<Basic[]> {
    const res = await request(GRAPHQL_URL, getSearchGql(type), { search, page });
    return searchSchema.parse(res)[type]!;
  }

  async anime(id: string): Promise<Anime | undefined> {
    const res = await request(GRAPHQL_URL, animeGql, { ids: id });
    return animeSchema.parse(res).animes[0];
  }

  async screenshots(animeId: string): Promise<Screenshots | undefined> {
    const res = await request(GRAPHQL_URL, screenshotsGql, { ids: animeId });
    return screenshotsSchema.parse(res).animes[0];
  }

  async videos(animeId: string): Promise<Videos | undefined> {
    const res = await request(GRAPHQL_URL, videosGql, { ids: animeId });
    return videosSchema.parse(res).animes[0];
  }
}
