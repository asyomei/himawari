import { z } from 'zod'
import { gql, request } from '../request'

export const api = { search, info, screenshots, videos, characters }

async function search(search: string, limit: number, page: number) {
  const query = gql`
    query($search: String!, $limit: Int!, $page: Int!) {
      animes(search: $search, limit: $limit, page: $page) {
        id name russian isCensored url
        poster { originalUrl }
      }
    }
  `

  const res = await request(query, { search, limit, page })
  const data = res.animes

  return z
    .object({
      id: z.string(),
      name: z.string(),
      russian: z.string().nullish(),
      isCensored: z.boolean().nullish(),
      url: z.string().url(),
      poster: z.object({ originalUrl: z.string().url() }).nullish(),
    })
    .array()
    .parse(data)
}

async function info(id: string) {
  const query = gql`
    query($id: String!) {
      animes(ids: $id, limit: 1) {
        id name russian japanese isCensored url
        kind status rating score duration
        episodesAired episodes nextEpisodeAt
        fandubbers fansubbers
        descriptionHtml descriptionSource
        airedOn { day month year }
        releasedOn { day month year }
        genres { russian }
        studios { name }
        poster { originalUrl }
      }
    }
  `

  const res = await request(query, { id })
  const data = res.animes[0]

  return z
    .object({
      id: z.string(),
      name: z.string(),
      russian: z.string().nullish(),
      japanese: z.string().nullish(),
      isCensored: z.boolean().nullish(),
      url: z.string().url(),
      kind: z.string().nullish(),
      status: z.string().nullish(),
      rating: z.string().nullish(),
      score: z.number().nullish(),
      duration: z.number().nullish(),
      episodesAired: z.number().nullish(),
      episodes: z.number().nullish(),
      nextEpisodeAt: z.string().nullish(),
      fandubbers: z.string().array().nullish(),
      fansubbers: z.string().array().nullish(),
      descriptionHtml: z.string().nullish(),
      descriptionSource: z.string().nullish(),
      airedOn: z
        .object({
          day: z.number().nullish(),
          month: z.number().nullish(),
          year: z.number().nullish(),
        })
        .nullish(),
      releasedOn: z
        .object({
          day: z.number().nullish(),
          month: z.number().nullish(),
          year: z.number().nullish(),
        })
        .nullish(),
      genres: z.object({ russian: z.string() }).array().nullish(),
      studios: z.object({ name: z.string() }).array().nullish(),
      poster: z.object({ originalUrl: z.string().url() }).nullish(),
    })
    .parse(data)
}

async function screenshots(id: string) {
  const query = gql`
    query($id: String!) {
      animes(ids: $id, limit: 1) {
        screenshots { id originalUrl }
      }
    }
  `

  const res = await request(query, { id })
  const data = res.animes[0]?.screenshots ?? []

  return z
    .object({
      id: z.string(),
      originalUrl: z.string().url(),
    })
    .array()
    .parse(data)
}

async function videos(id: string) {
  const query = gql`
    query($id: String!) {
      animes(ids: $id, limit: 1) {
        videos { id kind name imageUrl playerUrl url }
      }
    }
  `

  const fixUrls = (video: any) => {
    video.imageUrl = video.imageUrl.replace(/^\/\//, 'https://')
    video.playerUrl = video.playerUrl.replace(/^\/\//, 'https://')
    return video
  }

  const res = await request(query, { id })
  const data = res.animes[0]?.videos?.map(fixUrls) ?? []

  return z
    .object({
      id: z.string(),
      kind: z.string().nullish(),
      name: z.string(),
      imageUrl: z.string().url(),
      playerUrl: z.string().url().nullish(),
      url: z.string().url(),
    })
    .array()
    .parse(data)
}

async function characters(id: string) {
  const query = gql`
    query($id: String!) {
      animes(ids: $id, limit: 1) {
        characterRoles {
          character {
            id name russian url
            poster { originalUrl }
          }
        }
      }
    }
  `

  const res = await request(query, { id })
  const data = res.animes[0]?.characterRoles.map((x: any) => x.character) ?? []

  return z
    .object({
      id: z.string(),
      name: z.string(),
      russian: z.string().nullish(),
      url: z.string().url(),
      poster: z.object({ originalUrl: z.string() }).nullish(),
    })
    .array()
    .parse(data)
}
