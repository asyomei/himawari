/* eslint-disable */
import * as types from "./graphql";

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
  "query SearchAnime($search: String!, $page: PositiveInt, $limit: PositiveInt!) {\n        animes(search: $search, page: $page, limit: $limit) {\n          id\n          name\n          russian\n          japanese\n          isCensored\n          url\n          poster { originalUrl }\n        }\n      }":
    types.SearchAnimeDocument,
  "query SearchManga($search: String!, $page: PositiveInt, $limit: PositiveInt!) {\n        mangas(search: $search, page: $page, limit: $limit) {\n          id\n          name\n          russian\n          japanese\n          isCensored\n          url\n          poster { originalUrl }\n        }\n      }":
    types.SearchMangaDocument,
  "query AnimeTitle($id: String!) {\n        animes(ids: $id) {\n          id\n          name\n          russian\n          japanese\n          kind\n          rating\n          score\n          status\n          episodes\n          episodesAired\n          duration\n          airedOn { day month year }\n          releasedOn { day month year }\n          url\n          poster { originalUrl }\n          fandubbers\n          fansubbers\n          nextEpisodeAt\n          isCensored\n          genres { russian }\n          studios { name }\n          descriptionHtml\n          descriptionSource\n        }\n      }":
    types.AnimeTitleDocument,
  "query AnimeScreenshots($animeId: String!) {\n        animes(ids: $animeId) {\n          screenshots { id originalUrl }\n        }\n      }":
    types.AnimeScreenshotsDocument,
  "query AnimeVideos($animeId: String!) {\n        animes(ids: $animeId) {\n          videos { id kind name playerUrl imageUrl url }\n        }\n      }":
    types.AnimeVideosDocument,
  "query MangaTitle($id: String!) {\n        mangas(ids: $id) {\n          id\n          kind\n          name\n          russian\n          japanese\n          score\n          status\n          volumes\n          chapters\n          airedOn { day month year }\n          releasedOn { day month year }\n          url\n          poster { originalUrl }\n          isCensored\n          genres { russian }\n          publishers { name }\n          descriptionHtml\n          descriptionSource\n        }\n      }":
    types.MangaTitleDocument,
  "query AnimeCharacters($animeId: String!) {\n        animes(ids: $animeId) {\n          characterRoles {\n            character {\n              id\n              name\n              russian\n              japanese\n              url\n              poster { originalUrl }\n            }\n          }\n        }\n      }":
    types.AnimeCharactersDocument,
  "query MangaCharacters($mangaId: String!) {\n        mangas(ids: $mangaId) {\n          characterRoles {\n            character {\n              id\n              name\n              russian\n              japanese\n              url\n              poster { originalUrl }\n            }\n          }\n        }\n      }":
    types.MangaCharactersDocument,
  "query Character($id: [ID!]) {\n        characters(ids: $id) {\n          id\n          name\n          russian\n          japanese\n          poster { originalUrl }\n          url\n          descriptionHtml\n          descriptionSource\n        }\n      }":
    types.CharacterDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "query SearchAnime($search: String!, $page: PositiveInt, $limit: PositiveInt!) {\n        animes(search: $search, page: $page, limit: $limit) {\n          id\n          name\n          russian\n          japanese\n          isCensored\n          url\n          poster { originalUrl }\n        }\n      }",
): typeof import("./graphql").SearchAnimeDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "query SearchManga($search: String!, $page: PositiveInt, $limit: PositiveInt!) {\n        mangas(search: $search, page: $page, limit: $limit) {\n          id\n          name\n          russian\n          japanese\n          isCensored\n          url\n          poster { originalUrl }\n        }\n      }",
): typeof import("./graphql").SearchMangaDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "query AnimeTitle($id: String!) {\n        animes(ids: $id) {\n          id\n          name\n          russian\n          japanese\n          kind\n          rating\n          score\n          status\n          episodes\n          episodesAired\n          duration\n          airedOn { day month year }\n          releasedOn { day month year }\n          url\n          poster { originalUrl }\n          fandubbers\n          fansubbers\n          nextEpisodeAt\n          isCensored\n          genres { russian }\n          studios { name }\n          descriptionHtml\n          descriptionSource\n        }\n      }",
): typeof import("./graphql").AnimeTitleDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "query AnimeScreenshots($animeId: String!) {\n        animes(ids: $animeId) {\n          screenshots { id originalUrl }\n        }\n      }",
): typeof import("./graphql").AnimeScreenshotsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "query AnimeVideos($animeId: String!) {\n        animes(ids: $animeId) {\n          videos { id kind name playerUrl imageUrl url }\n        }\n      }",
): typeof import("./graphql").AnimeVideosDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "query MangaTitle($id: String!) {\n        mangas(ids: $id) {\n          id\n          kind\n          name\n          russian\n          japanese\n          score\n          status\n          volumes\n          chapters\n          airedOn { day month year }\n          releasedOn { day month year }\n          url\n          poster { originalUrl }\n          isCensored\n          genres { russian }\n          publishers { name }\n          descriptionHtml\n          descriptionSource\n        }\n      }",
): typeof import("./graphql").MangaTitleDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "query AnimeCharacters($animeId: String!) {\n        animes(ids: $animeId) {\n          characterRoles {\n            character {\n              id\n              name\n              russian\n              japanese\n              url\n              poster { originalUrl }\n            }\n          }\n        }\n      }",
): typeof import("./graphql").AnimeCharactersDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "query MangaCharacters($mangaId: String!) {\n        mangas(ids: $mangaId) {\n          characterRoles {\n            character {\n              id\n              name\n              russian\n              japanese\n              url\n              poster { originalUrl }\n            }\n          }\n        }\n      }",
): typeof import("./graphql").MangaCharactersDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "query Character($id: [ID!]) {\n        characters(ids: $id) {\n          id\n          name\n          russian\n          japanese\n          poster { originalUrl }\n          url\n          descriptionHtml\n          descriptionSource\n        }\n      }",
): typeof import("./graphql").CharacterDocument;

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}
