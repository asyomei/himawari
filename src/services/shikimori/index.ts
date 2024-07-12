import { type Video, execute, graphql } from "#/gql";

const GRAPHQL_URL = "https://shikimori.one/api/graphql";
const maybe = <T>(x: T): T | undefined => x;

export class ShikimoriService {
  async searchAnime(search: string, page?: number, limit = 10) {
    const SearchAnimeQuery = graphql(
      `query SearchAnime($search: String!, $page: PositiveInt, $limit: PositiveInt!) {
        animes(search: $search, page: $page, limit: $limit) {
          id
          name
          russian
          japanese
          isCensored
          url
          poster { originalUrl }
        }
      }`,
    );

    const res = await execute(GRAPHQL_URL, SearchAnimeQuery, { search, page, limit });
    return res.animes;
  }

  async searchManga(search: string, page?: number, limit = 10) {
    const SearchMangaQuery = graphql(
      `query SearchManga($search: String!, $page: PositiveInt, $limit: PositiveInt!) {
        mangas(search: $search, page: $page, limit: $limit) {
          id
          name
          russian
          japanese
          isCensored
          url
          poster { originalUrl }
        }
      }`,
    );

    const res = await execute(GRAPHQL_URL, SearchMangaQuery, { search, page, limit });
    return res.mangas;
  }

  async anime(id: string) {
    const AnimeTitleQuery = graphql(
      `query AnimeTitle($id: String!) {
        animes(ids: $id) {
          id
          name
          russian
          japanese
          kind
          rating
          score
          status
          episodes
          episodesAired
          duration
          airedOn { day month year }
          releasedOn { day month year }
          url
          poster { originalUrl }
          fandubbers
          fansubbers
          nextEpisodeAt
          isCensored
          genres { russian }
          studios { name }
          descriptionHtml
          descriptionSource
        }
      }`,
    );

    const res = await execute(GRAPHQL_URL, AnimeTitleQuery, { id });
    return maybe(res.animes[0]);
  }

  async screenshots(animeId: string) {
    const AnimeScreenshotsQuery = graphql(
      `query AnimeScreenshots($animeId: String!) {
        animes(ids: $animeId) {
          screenshots { id originalUrl }
        }
      }`,
    );

    const res = await execute(GRAPHQL_URL, AnimeScreenshotsQuery, { animeId });
    return maybe(res.animes[0]?.screenshots);
  }

  async videos(animeId: string) {
    const AnimeVideosQuery = graphql(
      `query AnimeVideos($animeId: String!) {
        animes(ids: $animeId) {
          videos { id kind name playerUrl imageUrl url }
        }
      }`,
    );

    const fix = (url: string) => url.replace(/^\/\//, "https://");
    const fixLinks = (vid: Video) => ({
      ...vid,
      url: fix(vid.url),
      playerUrl: fix(vid.playerUrl),
      imageUrl: fix(vid.imageUrl),
    });

    const res = await execute(GRAPHQL_URL, AnimeVideosQuery, { animeId });
    return maybe(res.animes[0]?.videos.map(fixLinks));
  }

  async manga(id: string) {
    const MangaTitleQuery = graphql(
      `query MangaTitle($id: String!) {
        mangas(ids: $id) {
          id
          kind
          name
          russian
          japanese
          score
          status
          volumes
          chapters
          airedOn { day month year }
          releasedOn { day month year }
          url
          poster { originalUrl }
          isCensored
          genres { russian }
          publishers { name }
          descriptionHtml
          descriptionSource
        }
      }`,
    );

    const res = await execute(GRAPHQL_URL, MangaTitleQuery, { id });
    return maybe(res.mangas[0]);
  }

  async animeCharacters(animeId: string) {
    const AnimeCharactersQuery = graphql(
      `query AnimeCharacters($animeId: String!) {
        animes(ids: $animeId) {
          characterRoles {
            character {
              id
              name
              russian
              japanese
              url
              poster { originalUrl }
            }
          }
        }
      }`,
    );

    const res = await execute(GRAPHQL_URL, AnimeCharactersQuery, { animeId });
    return maybe(res.animes[0]?.characterRoles?.map(x => x.character));
  }

  async mangaCharacters(mangaId: string) {
    const MangaCharactersQuery = graphql(
      `query MangaCharacters($mangaId: String!) {
        mangas(ids: $mangaId) {
          characterRoles {
            character {
              id
              name
              russian
              japanese
              url
              poster { originalUrl }
            }
          }
        }
      }`,
    );

    const res = await execute(GRAPHQL_URL, MangaCharactersQuery, { mangaId });
    return maybe(res.mangas[0]?.characterRoles?.map(x => x.character));
  }

  async character(id: string) {
    const CharacterQuery = graphql(
      `query Character($id: [ID!]) {
        characters(ids: $id) {
          id
          name
          russian
          japanese
          poster { originalUrl }
          url
          descriptionHtml
          descriptionSource
        }
      }`,
    );

    const res = await execute(GRAPHQL_URL, CharacterQuery, { id });
    return maybe(res.characters[0]);
  }
}
