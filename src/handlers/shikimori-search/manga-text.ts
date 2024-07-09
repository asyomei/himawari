import compact from "just-compact";
import type { Manga } from "#/services/shikimori/types";
import mapJoin from "#/utils/map-join";
import { b, parseDescription } from "./utils";

export function makeMangaText(manga: Manga) {
  const result: any[] = [];

  // ++ Titles
  const titles = compact([b(manga.russian), b(manga.name), b(manga.japanese)]);
  result.push(titles.join("\n| "));
  // -- Titles
  // ++ Kind
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
  // -- Kind
  // ++ Date
  result.push("\n", b("Дата: "));
  if (manga.kind !== "one_shot") {
    const dates = compact([manga.airedOn?.date, manga.releasedOn?.date]);
    result.push(mapJoin(dates, x => x.toLocaleDateString("ru"), " | ") || "Неизвестно");
  } else {
    result.push(manga.airedOn?.date?.toLocaleDateString("ru") || "Неизвестно");
  }
  // -- Date
  // ++ Score
  result.push("\n", b("Оценка: "), `${manga.score}/10`);
  // -- Score
  // ++ Status
  const statusName = {
    anons: "Анонс",
    ongoing: "Онгоинг",
    released: "Выпущен",
    paused: "Приостановлен",
    discontinued: "Заброшен",
  }[manga.status];
  result.push("\n", b("Статус: "), statusName);
  // -- Status
  // ++ Volumes & chapters
  if (manga.volumes) result.push("\n", b("Томов: "), manga.volumes);
  if (manga.chapters) result.push("\n", b("Глав: "), manga.chapters);
  // -- Volumes & chapters
  // ++ Genres
  const genresTitle = manga.genres.length > 1 ? "Жанры" : "Жанр";
  result.push("\n", b(`${genresTitle}: `), mapJoin(manga.genres, "russian"));
  // -- Genres
  // ++ Publishers
  const publishersTitle = manga.publishers.length > 1 ? "Издатели" : "Издатель";
  result.push("\n", b(`${publishersTitle}: `), mapJoin(manga.publishers, "name"));
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
