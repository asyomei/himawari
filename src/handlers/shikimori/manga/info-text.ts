import { parseDescription } from "../utils"

type Writer = (buf: any[], manga: any) => boolean

const MANGA_KIND_NAMES = {
  manga: "Манга",
  manhwa: "Манхва",
  manhua: "Манхуа",
  light_novel: "Лайт новелла",
  novel: "Новелла",
  one_shot: "Ваншот",
  doujin: "Додзин",
}

const MANGA_STATUS_NAMES = {
  anons: "Анонс",
  ongoing: "Онгоинг",
  released: "Выпущен",
  paused: "Приостановлен",
  discontinued: "Заброшен",
}

export function makeMangaInfoText(manga: any): string {
  return write(manga, [
    addTitle,
    addKind,
    addDate,
    addScore,
    addStatus,
    addDuration,
    addGenres,
    addPublishers,
    addNewLine,
    addDescription,
  ])
}

const addNewLine: Writer = () => true

const addTitle: Writer = (buf, manga) => {
  if (manga.russian) buf.push(`<b>${manga.russian}</b>\n| `)
  buf.push(`<b>${manga.name}</b>`)
  if (manga.japanese) buf.push(`\n| <b>${manga.japanese}</b>`)
  return true
}

const addKind: Writer = (buf, manga) => {
  if (!manga.kind) return false
  buf.push(`<b>Тип:</b> ${MANGA_KIND_NAMES[manga.kind as "manga"]}`)
  return true
}

const addDate: Writer = (buf, manga) => {
  const makeDate = (on: any) =>
    [on.day?.toString().padStart(2, "0"), on.month?.toString().padStart(2, "0"), on.year]
      .filter(x => x)
      .join(".")

  if (!manga.airedOn?.year) return false
  buf.push("<b>Дата:</b> ", makeDate(manga.airedOn))

  if (manga.releasedOn?.year) {
    buf.push(" | ", makeDate(manga.releasedOn))
  } else if (manga.status === "ongoing") {
    buf.push(" | Выходит до сих пор")
  }

  return true
}

const addScore: Writer = (buf, anime) => {
  if (!anime.score) return false
  buf.push(`<b>Оценка:</b> ${anime.score}/10`)
  return true
}

const addStatus: Writer = (buf, manga) => {
  if (!manga.status) return false
  buf.push(`<b>Статус:</b> ${MANGA_STATUS_NAMES[manga.status as "released"]}`)
  return true
}

const addDuration: Writer = (buf, manga) => {
  if (!manga.chapters && !manga.volumes) return false
  buf.push("<b>Продолжительность:</b> ")
  if (manga.chapters) {
    buf.push(`${manga.chapters} гл.`)
    if (manga.volumes) buf.push(` [${manga.volumes} т.]`)
  } else {
    buf.push(`${manga.volumes} т.`)
  }
  return true
}

const addGenres: Writer = (buf, manga) => {
  const genres = manga.genres?.map((x: any) => x.russian)
  if (!genres || genres.length === 0) return false
  const title = genres.length === 1 ? "Жанр" : "Жанры"
  buf.push(`<b>${title}:</b> ${genres.join(", ")}`)
  return true
}

const addPublishers: Writer = (buf, manga) => {
  const publishers = manga.publishers?.map((x: any) => x.name)
  if (!publishers || publishers.length === 0) return false
  const title = publishers.length === 1 ? "Издатель" : "Издатели"
  buf.push(`<b>${title}:</b> ${publishers.join(", ")}`)
  return true
}

const addDescription: Writer = (buf, anime) => {
  if (!anime.descriptionHtml) return false
  buf.push(parseDescription(anime.descriptionHtml))

  if (anime.descriptionSource) {
    buf.push(`\n— <a href="${anime.descriptionSource}">Источник</a>`)
  }

  return true
}

function write(manga: any, writers: Writer[]): string {
  const buf: any[] = []
  for (const writer of writers) {
    const writed = writer(buf, manga)
    if (writed) buf.push("\n")
  }
  return buf.join("").trimEnd()
}
