import type { AnimeKindEnum } from "#/gql";
import type { AnimeInfo } from "#/services/shikimori/types";
import { compact } from "#/utils/compact";
import mapJoin from "#/utils/map-join";
import { b, makeDate, parseDescription } from "./utils";

export function makeAnimeText(anime: AnimeInfo) {
  const result: any[] = [];

  // ++ Titles
  const titles = compact([anime.russian, anime.name, anime.japanese]).map(b);
  result.push(titles.join("\n| "));
  // -- Titles
  // ++ Kind
  if (anime.kind) {
    const kindName = {
      tv: "TV сериал",
      movie: "Фильм",
      ova: "OVA",
      ona: "ONA",
      special: "Спэшл",
      tv_special: "TV спэшл",
      music: "Клип",
      pv: "PV",
      cm: "CM",
    }[anime.kind];
    result.push("\n", b("Тип: "), kindName);
  }
  // -- Kind
  // ++ Date
  result.push("\n", b("Дата: "));
  if (hasEps(anime.kind)) {
    const dates = compact([anime.airedOn, anime.releasedOn]);
    result.push(mapJoin(dates, makeDate, " | ") || "Неизвестно");
  } else {
    result.push(anime.airedOn ? makeDate(anime.airedOn) : "Неизвестно");
  }
  // -- Date
  // ++ Score
  result.push("\n", b("Оценка: "), `${anime.score}/10`);
  // -- Score
  // ++ Status
  if (anime.status) {
    const statusName = {
      anons: "Анонс",
      ongoing: "Онгоинг",
      released: "Выпущено",
    }[anime.status];
    result.push("\n", b("Статус: "), statusName);
  }
  // -- Status
  // ++ Episodes
  result.push("\n", b("Эпизоды: "));
  if (anime.status === "ongoing") {
    if (anime.episodes) {
      result.push(`${anime.episodesAired}/${anime.episodes}`);
    } else {
      result.push(anime.episodesAired);
    }
  } else {
    result.push(anime.episodes);
  }
  result.push(" эп.");
  if (anime.duration) {
    result.push(` по ${anime.duration} мин.`);
  }
  // -- Episodes
  // ++ Rating
  if (anime.rating) {
    const rating = anime.rating.toUpperCase().replace("_PLUS", "+").replaceAll("_", "-");
    result.push("\n", b("Рейтинг: "), rating);
  }
  // -- Rating
  // ++ Genres
  if (anime.genres?.length) {
    const genresTitle = anime.genres.length > 1 ? "Жанры" : "Жанр";
    result.push("\n", b(`${genresTitle}: `), mapJoin(anime.genres, "russian"));
  }
  // -- Genres
  // ++ Studios
  if (anime.studios.length) {
    const studiosTitle = anime.studios.length > 1 ? "Студии" : "Студия";
    result.push("\n", b(`${studiosTitle}: `), mapJoin(anime.studios, "name"));
  }
  // -- Studios
  // ++ Fandubbers & fansubbers
  if (anime.fandubbers.length) {
    result.push("\n", b("Озвучка: "), anime.fandubbers.join(", "));
  }
  if (anime.fansubbers.length) {
    result.push("\n", b("Субтитры: "), anime.fansubbers.join(", "));
  }
  // -- Fandubbers & fansubbers
  // ++ Description
  if (anime.descriptionHtml) {
    result.push("\n\n", parseDescription(anime.descriptionHtml));
  }
  if (anime.descriptionSource) {
    result.push("\n", "— ", anime.descriptionSource);
  }
  // -- Description

  return result.join("");
}

const hasEps = (kind: AnimeKindEnum | null | undefined) => kind === "tv" || kind === "ova";
