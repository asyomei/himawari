import type { IShikimoriService } from "./interface";
import type { Anime, Basic, Type } from "./types";

export class ShikimoriMock implements IShikimoriService {
  async search(_type: Type, search: string, page = 1): Promise<Basic[]> {
    const res: Basic[] = [];

    const start = 1 + (page - 1) * 10;

    for (let i = start; i < start + 10; i++) {
      res.push({
        id: String(10000 + i),
        name: `${search} ${i}`,
        russian: i < start + 8 ? `"${search} ${i}"` : undefined,
        isCensored: i === 5,
      });
    }

    return res;
  }

  async anime(id: string): Promise<Anime | undefined> {
    if (Number(id) % 2 === 0) return;

    return {
      id,
      kind: "tv",
      name: `English ${id}`,
      russian: `Russian ${id}`,
      japanese: `Japanese ${id}`,
      status: "released",
      episodes: 12,
      genres: ["Genre #1", "Genre #2"],
      fandubbers: ["dub1", "dub2"],
      fansubbers: ["sub1", "sub2"],
      poster: "/url/to/poster",
      rating: "pg_13",
      score: 5.86,
      studios: ["Studio One", "Studio Two"],
      duration: 24,
      airedOn: new Date(2015, 7, 23),
      releasedOn: new Date(2016, 8, 16),
      url: "some_url",
      descriptionHtml: `Hey, <a href="/another/url">Eiko</a>!`,
    };
  }
}
