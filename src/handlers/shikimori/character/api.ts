import { request } from "../request"

export const api = { search, info }

async function search(search: string, limit: number, page: number): Promise<any[]> {
  const query = `query($search: String!, $limit: Int!, $page: Int!) {
    characters(search: $search, limit: $limit, page: $page) {
      id name russian japanese synonyms url
      poster { originalUrl }
    }
  }`

  const res = await request(query, { search, limit, page })
  return res.characters ?? []
}

async function info(id: string): Promise<any> {
  const query = `query($id: [ID!]) {
    characters(ids: $id, limit: 1) {
      id name russian japanese synonyms url
      descriptionHtml descriptionSource
      poster { originalUrl }
    }
  }`

  const res = await request(query, { id })
  return res.characters[0]
}
