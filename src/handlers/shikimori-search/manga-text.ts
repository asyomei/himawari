import type { MangaInfo } from "#/services/shikimori/types";
import { compact } from "#/utils/compact";
import mapJoin from "#/utils/map-join";
import { b, makeDate, parseDescription } from "./utils";

export function makeMangaText(manga: MangaInfo) {
  const result: any[] = [];

  // ++ Titles
  const titles = compact([manga.russian, manga.name, manga.japanese]).map(b);
  result.push(titles.join("\n| "));
  // -- Titles
  // ++ Kind
  if (manga.kind) {
    const kindName = {
      manga: "Манга",
      manhwa: "Манхва",
      manhua: "Манхуа",
      light_novel: "Лайт новелла",
      novel: "Новелла",
      one_shot: "Ваншот",
      doujin: "Додзин",
    }[manga.kind];
    result.push("\n", b("Тип: "), kindName);
  }
  // -- Kind
  // ++ Date
  result.push("\n", b("Дата: "));
  if (manga.kind !== "one_shot") {
    const dates = compact([manga.airedOn, manga.releasedOn]);
    result.push(mapJoin(dates, makeDate, " | ") || "Неизвестно");
  } else {
    result.push(manga.airedOn ? makeDate(manga.airedOn) : "Неизвестно");
  }
  // -- Date
  // ++ Score
  result.push("\n", b("Оценка: "), `${manga.score}/10`);
  // -- Score
  // ++ Status
  if (manga.status) {
    const statusName = {
      anons: "Анонс",
      ongoing: "Онгоинг",
      released: "Выпущен",
      paused: "Приостановлен",
      discontinued: "Заброшен",
    }[manga.status];
    result.push("\n", b("Статус: "), statusName);
  }
  // -- Status
  // ++ Volumes & chapters
  if (manga.volumes) result.push("\n", b("Томов: "), manga.volumes);
  if (manga.chapters) result.push("\n", b("Глав: "), manga.chapters);
  // -- Volumes & chapters
  // ++ Genres
  if (manga.genres?.length) {
    const genresTitle = manga.genres.length > 1 ? "Жанры" : "Жанр";
    result.push("\n", b(`${genresTitle}: `), mapJoin(manga.genres, "russian"));
  }
  // -- Genres
  // ++ Publishers
  if (manga.publishers.length) {
    const publishersTitle = manga.publishers.length > 1 ? "Издатели" : "Издатель";
    result.push("\n", b(`${publishersTitle}: `), mapJoin(manga.publishers, "name"));
  }
  // -- Publishers
  // ++ Description
  if (manga.descriptionHtml) {
    result.push("\n\n", parseDescription(manga.descriptionHtml));
  }
  if (manga.descriptionSource) {
    result.push("\n", "— ", manga.descriptionSource);
  }
  // -- Description

  return result.join("");
}
