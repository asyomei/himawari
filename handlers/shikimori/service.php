<?php

class ShikimoriService
{
  const URL = 'https://shikimori.one/api/graphql';

  public function search(string $type, string $search, ?int $page = null, int $limit = 10): array
  {
    $type = "{$type}s";
    $query = <<<GQL
    query search(\$search: String!, \$page: PositiveInt, \$limit: PositiveInt!) {
      $type(search: \$search, page: \$page, limit: \$limit) {
        id, name, russian, japanese, isCensored, url,
        poster { originalUrl }
      }
    }
    GQL;

    return curl_request_gql(self::URL, $query, [
      'search' => $search,
      'page' => $page,
      'limit' => $limit,
    ])->animes;
  }

  public function anime(string $id): mixed
  {
    $query = <<<GQL
    query anime(\$id: String!) {
      animes(ids: \$id) {
        id, name, russian, japanese, kind, rating, score, status, episodes, episodesAired, duration,
        url, fandubbers, fansubbers, nextEpisodeAt, isCensored, descriptionHtml, descriptionSource,
        airedOn { day, month, year },
        releasedOn { day, month, year },
        poster { originalUrl },
        genres { russian },
        studios { name }
      }
    }
    GQL;

    return curl_request_gql(self::URL, $query, ['id' => $id])->animes[0];
  }

  public function manga(string $id): mixed
  {
    $query = <<<GQL
    query manga(\$id: String!) {
      mangas(ids: \$id) {
        id, kind, name, russian, japanese, score, status, volumes, chapters,
        url, isCensored, descriptionHtml, descriptionSource,
        airedOn { day, month, year },
        releasedOn { day, month, year },
        poster { originalUrl },
        genres { russian },
        publishers { name }
      }
    }
    GQL;

    return curl_request_gql(self::URL, $query, ['id' => $id])->mangas[0];
  }

  public function screenshots(string $animeId): array
  {
    $query = <<<GQL
    query animeScreenshots(\$animeId: String!) {
      animes(ids: \$animeId) {
        screenshots { id, originalUrl }
      }
    }
    GQL;

    return curl_request_gql(self::URL, $query, ['animeId' => $animeId])->animes[0]?->screenshots ?? [];
  }

  public function videos(string $animeId): array
  {
    $query = <<<GQL
    query animeVideos(\$animeId: String!) {
      animes(ids: \$animeId) {
        videos { id, kind, name, playerUrl, imageUrl, url }
      }
    }
    GQL;

    $fix = fn(string $url) => preg_replace('/^\/\//', 'https://', $url);
    return array_map(
      function (mixed $vid) use ($fix) {
        $vid->url = $fix($vid->url);
        $vid->imageUrl = $fix($vid->imageUrl);
        $vid->playerUrl = $fix($vid->playerUrl);
        return $vid;
      },
      curl_request_gql(self::URL, $query, ['animeId' => $animeId])->animes[0]?->videos ?? []
    );
  }

  public function listCharacters(string $type, string $titleId): array
  {
    $type = "{$type}s";
    $query = <<<GQL
    query animeCharacters(\$titleId: String!) {
      $type(ids: \$titleId) {
        characterRoles {
          character {
            id, name, russian, japanese, url
            poster { originalUrl }
          }
        }
      }
    }
    GQL;

    return array_map(
      fn($x) => $x->character,
      curl_request_gql(self::URL, $query, ['titleId' => $titleId])->{$type}[0]?->characterRoles ?? []
    );
  }

  public function character(string $id): mixed
  {
    $query = <<<GQL
    query character(\$id: [ID!]) {
      characters(ids: \$id) {
        id, name, russian, japanese, url,
        descriptionHtml, descriptionSource,
        poster { originalUrl }
      }
    }
    GQL;

    return curl_request_gql(self::URL, $query, ['id' => $id])->characters[0];
  }
}