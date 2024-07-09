import request from "graphql-request";
import { type ZodTypeAny, z } from "zod";
import { makeGraphql } from "#/utils/make-graphql";
import type { IShikimoriService } from "./interface";
import { zAnime, zBasic, zManga, zScreenshot, zVideo } from "./schemas";
import type { Anime, Basic, Manga, Screenshot, Type, Video } from "./types";

const getSearchGql = (type: Type) =>
  makeGraphql(u => {
    const search = u.var("search", "String!");
    const page = u.var("page", "PositiveInt");
    const limit = u.var("limit", "PositiveInt!");

    return u.query(type, zBasic, { search, page, limit });
  });

const animeGql = makeGraphql(u => {
  const id = u.var("id", "String!");

  return u.query("animes", zAnime, { ids: id });
});

const mangaGql = makeGraphql(u => {
  const id = u.var("id", "String!");

  return u.query("mangas", zManga, { ids: id });
});

const screenshotGql = makeGraphql(u => {
  const id = u.var("id", "String!");

  const schema = z.object({ screenshots: zScreenshot.array() });
  return u.query("animes", schema, { ids: id });
});

const videoGql = makeGraphql(u => {
  const id = u.var("id", "String!");

  const schema = z.object({ videos: zVideo.array() });
  return u.query("animes", schema, { ids: id });
});

export class ShikimoriService implements IShikimoriService {
  async search(type: Type, search: string, page?: number, limit = 10): Promise<Basic[]> {
    const schema = z.object({ [type]: zBasic.array() }).transform(x => x[type]);
    return graphql(getSearchGql(type), schema, { search, page, limit });
  }

  async anime(id: string): Promise<Anime | undefined> {
    const schema = z.object({ animes: zAnime.array().max(1) }).transform(x => x.animes[0]);
    return graphql(animeGql, schema, { id });
  }

  async screenshots(animeId: string): Promise<Screenshot[]> {
    const schema = z
      .object({ animes: z.object({ screenshots: zScreenshot.array() }).array().max(1) })
      .transform(x => x.animes[0]?.screenshots ?? []);
    return graphql(screenshotGql, schema, { id: animeId });
  }

  async videos(animeId: string): Promise<Video[]> {
    const schema = z
      .object({ animes: z.object({ videos: zVideo.array() }).array().max(1) })
      .transform(x => x.animes[0]?.videos ?? []);
    return graphql(videoGql, schema, { id: animeId });
  }

  async manga(id: string): Promise<Manga | undefined> {
    const schema = z.object({ mangas: zManga.array().max(1) }).transform(x => x.mangas[0]);
    return graphql(mangaGql, schema, { id });
  }
}

const GRAPHQL_URL = "https://shikimori.one/api/graphql";
async function graphql<T extends ZodTypeAny>(
  gql: string,
  schema: T,
  args: Record<string, unknown>,
): Promise<z.output<T>> {
  const res = await request(GRAPHQL_URL, gql, args);
  return schema.parse(res);
}
