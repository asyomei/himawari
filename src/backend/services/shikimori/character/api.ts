import { z } from 'zod'
import { gql, request } from '../request'

export const api = { search, info }

async function search(search: string, limit: number, page: number) {
  const query = gql`
    query($search: String!, $limit: Int!, $page: Int!) {
      characters(search: $search, limit: $limit, page: $page) {
        id name russian japanese synonyms url
        poster { originalUrl }
      }
    }
  `

  const res = await request(query, { search, limit, page })
  const data = res.characters ?? []

  return z
    .object({
      id: z.string(),
      name: z.string(),
      russian: z.string().nullish(),
      japanese: z.string().nullish(),
      synonyms: z.string().array().nullish(),
      url: z.string().url(),
      poster: z.object({ originalUrl: z.string().url() }).nullish(),
    })
    .array()
    .parse(data)
}

async function info(id: string) {
  const query = gql`
    query($id: [ID!]) {
      characters(ids: $id, limit: 1) {
        id name russian japanese synonyms url
        descriptionHtml descriptionSource
        poster { originalUrl }
      }
    }
  `

  const res = await request(query, { id })
  const data = res.characters[0]

  return z
    .object({
      id: z.string(),
      name: z.string(),
      russian: z.string().nullish(),
      japanese: z.string().nullish(),
      synonyms: z.string().array().nullish(),
      url: z.string().url(),
      descriptionHtml: z.string().nullish(),
      descriptionSource: z.string().nullish(),
      poster: z.object({ originalUrl: z.string().url() }).nullish(),
    })
    .parse(data)
}
