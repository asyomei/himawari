import { compact } from "lodash-es";
import type { Anime, AnimeKind } from "#/services/shikimori";
import { a, b, parseDescription } from "./utils";

export function makeAnimeText(anime: Anime) {
  const result: any[] = [];

  // ++ Titles
  const titles = compact([
    b(anime.russian),
    b(anime.name),
    b(anime.japanese),
    a("Shikimori", anime.url),
  ]);
  result.push(titles.join("\n| "));
  // -- Titles
  // ++ Kind
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
  // -- Kind
  // ++ Date
  result.push("\n", b("Дата: "));
  if (hasEps(anime.kind)) {
    const dates = compact([anime.airedOn, anime.releasedOn]).map(x => x.toLocaleDateString("ru"));
    result.push(dates.join(" | ") || "Неизвестно");
  } else {
    result.push(anime.airedOn?.toLocaleDateString("ru") || "Неизвестно");
  }
  // -- Date
  // ++ Score
  result.push("\n", b("Оценка: "), `${anime.score}/10`);
  // -- Score
  // ++ Status
  const statusName = {
    anons: "Анонс",
    ongoing: "Онгоинг",
    released: "Выпущено",
  }[anime.status];
  result.push("\n", b("Статус: "), statusName);
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
  const rating = anime.rating.toUpperCase().replace("_PLUS", "+").replaceAll("_", "-");
  result.push("\n", b("Рейтинг: "), rating);
  // -- Rating
  // ++ Genres
  const genresTitle = anime.genres.length > 1 ? "Жанры" : "Жанр";
  result.push("\n", b(`${genresTitle}: `), anime.genres.join(", "));
  // -- Genres
  // ++ Studios
  if (anime.studios) {
    const studiosTitle = anime.studios.length > 1 ? "Студии" : "Студия";
    result.push("\n", b(`${studiosTitle}: `), anime.studios.join(", "));
  }
  // -- Studios
  // ++ Fandubbers & fansubbers
  result.push("\n", b("Озвучка: "), anime.fandubbers.join(", "));
  result.push("\n", b("Субтитры: "), anime.fansubbers.join(", "));
  // -- Fandubbers & fansubbers
  // ++ Description
  if (anime.descriptionHtml) {
    result.push("\n\n", parseDescription(anime.descriptionHtml));
  }
  // -- Description

  return result.join("");
}

const hasEps = (kind: AnimeKind) => kind === "tv" || kind === "ova";
