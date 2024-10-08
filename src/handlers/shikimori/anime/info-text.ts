import { parseDescription } from "../utils"

type Writer = (buf: any[], anime: any) => boolean

export const ANIME_KIND_NAMES = {
  tv: "TV сериал",
  movie: "Фильм",
  ova: "OVA",
  ona: "ONA",
  special: "Спэшл",
  tv_special: "TV спэшл",
  music: "Клип",
  pv: "Проморолик",
  cm: "Реклама",
}

export const ANIME_STATUS_NAMES = {
  anons: "Анонс",
  ongoing: "Онгоинг",
  released: "Выпущено",
}

export function makeAnimeInfoText(anime: any): string {
  return write(anime, [
    addTitle,
    addKind,
    addDate,
    addScore,
    addStatus,
    addDuration,
    addNextEpisodeAt,
    addRating,
    addGenres,
    addStudios,
    addDubs,
    addSubs,
    addNewLine,
    addDescription,
  ])
}

const addNewLine: Writer = () => true

const addTitle: Writer = (buf, anime) => {
  if (anime.russian) buf.push(`<b>${anime.russian}</b>\n| `)
  buf.push(`<b>${anime.name}</b>`)
  if (anime.japanese) buf.push(`\n| <b>${anime.japanese}</b>`)
  return true
}

const addKind: Writer = (buf, anime) => {
  if (!anime.kind) return false
  buf.push(`<b>Тип:</b> ${ANIME_KIND_NAMES[anime.kind as "tv"]}`)
  return true
}

const addDate: Writer = (buf, anime) => {
  const makeDate = (on: any) =>
    [on.day?.toString().padStart(2, "0"), on.month?.toString().padStart(2, "0"), on.year]
      .filter(x => x)
      .join(".")

  if (!anime.airedOn?.year) return false
  buf.push("<b>Дата:</b> ", makeDate(anime.airedOn))

  if (anime.releasedOn?.year) {
    buf.push(" | ", makeDate(anime.releasedOn))
  } else if (anime.status === "ongoing") {
    buf.push(" | Выходит до сих пор")
  }

  return true
}

const addScore: Writer = (buf, anime) => {
  if (!anime.score) return false
  buf.push(`<b>Оценка:</b> ${anime.score}/10`)
  return true
}

const addStatus: Writer = (buf, anime) => {
  if (!anime.status) return false
  buf.push(`<b>Статус:</b> ${ANIME_STATUS_NAMES[anime.status as "released"]}`)
  return true
}

const addDuration: Writer = (buf, anime) => {
  if (anime.status === "ongoing") {
    if (!anime.episodesAired) return false
    buf.push(`<b>Продолжительность:</b> ${anime.episodesAired}`)
    if (anime.episodes) buf.push(`/${anime.episodes}`)
  } else {
    if (!anime.episodes) return false
    buf.push(`<b>Продолжительность:</b> ${anime.episodes}`)
  }
  buf.push(" эп.")

  if (anime.duration) buf.push(` по ${anime.duration} мин.`)

  return true
}

const addNextEpisodeAt: Writer = (buf, anime) => {
  if (anime.status !== "ongoing" || !anime.nextEpisodeAt) return false

  const [year, month, day, hours, minutes] = anime.nextEpisodeAt
    .match(/^(\d+)-(\d+)-(\d+)T(\d+):(\d+)/)
    .slice(1)
  const nextEpisodeAtFormatted = `${day}.${month}.${year} ${hours}:${minutes} по МСК`
  buf.push(`<b>Следующий эпизод:</b> ${nextEpisodeAtFormatted}`)
  return true
}

const addRating: Writer = (buf, anime) => {
  if (!anime.rating) return false
  const rating = anime.rating.replace("_plus", "+").replace("_", "-").toUpperCase()
  buf.push(`<b>Рейтинг:</b> ${rating}`)
  return true
}

const addGenres: Writer = (buf, anime) => {
  const genres = anime.genres?.map((x: any) => x.russian)
  if (!genres || genres.length === 0) return false
  const title = genres.length === 1 ? "Жанр" : "Жанры"
  buf.push(`<b>${title}:</b> ${genres.join(", ")}`)
  return true
}

const addStudios: Writer = (buf, anime) => {
  const studios = anime.studios?.map((x: any) => x.name)
  if (!studios || studios.length === 0) return false
  const title = studios.length === 1 ? "Студия" : "Студии"
  buf.push(`<b>${title}:</b> ${studios.join(", ")}`)
  return true
}

const addDubs: Writer = (buf, anime) => {
  const dubs = anime.fandubbers
  if (!dubs || dubs.length === 0) return false
  buf.push(`<b>Озвучка:</b> ${dubs.join(", ")}`)
  return true
}

const addSubs: Writer = (buf, anime) => {
  const subs = anime.fansubbers
  if (!subs || subs.length === 0) return false
  buf.push(`<b>Субтитры:</b> ${subs.join(", ")}`)
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

function write(anime: any, writers: Writer[]): string {
  const buf: any[] = []
  for (const writer of writers) {
    const writed = writer(buf, anime)
    if (writed) buf.push("\n")
  }

  return buf.join("").trimEnd()
}
