import { z } from 'zod'
import { gql, request } from '../request'

export const api = { search, info, characters }

async function search(search: string, limit: number, page: number) {
  const query = gql`
    query($search: String!, $limit: Int!, $page: Int!) {
      mangas(search: $search, limit: $limit, page: $page) {
        id name russian isCensored url
        poster { originalUrl }
      }
    }
  `

  const res = await request(query, { search, limit, page })
  const data = res.mangas

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
      mangas(ids: $id, limit: 1) {
        id name russian japanese isCensored url
        kind status score
        chapters volumes
        descriptionHtml descriptionSource
        airedOn { day month year }
        releasedOn { day month year }
        genres { russian }
        publishers { name }
        poster { originalUrl }
      }
    }
  `

  const res = await request(query, { id })
  const data = res.mangas[0]

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
      score: z.number().nullish(),
      chapters: z.number().nullish(),
      volumes: z.number().nullish(),
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
      publishers: z.object({ name: z.string() }).array().nullish(),
      poster: z.object({ originalUrl: z.string().url() }).nullish(),
    })
    .parse(data)
}

async function characters(id: string) {
  const query = gql`
    query($id: String!) {
      mangas(ids: $id, limit: 1) {
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
  const data = res.mangas[0]?.characterRoles.map((x: any) => x.character) ?? []

  return z
    .object({
      id: z.string(),
      name: z.string(),
      russian: z.string().nullish(),
      url: z.string().url(),
      poster: z.object({ originalUrl: z.string().url() }).nullish(),
    })
    .array()
    .parse(data)
}
