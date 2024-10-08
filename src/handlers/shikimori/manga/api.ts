import { request } from "../request"

export const api = { search, info, characters }

async function search(search: string, limit: number, page: number): Promise<any[]> {
  const query = `query($search: String!, $limit: Int!, $page: Int!) {
    mangas(search: $search, limit: $limit, page: $page) {
      id name russian isCensored url
      poster { originalUrl }
    }
  }`

  const res = await request(query, { search, limit, page })
  return res.mangas
}

async function info(id: string): Promise<any> {
  const query = `query($id: String!) {
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
  }`

  const res = await request(query, { id })
  return res.mangas[0]
}

async function characters(id: string): Promise<any[]> {
  const query = `query($id: String!) {
    mangas(ids: $id, limit: 1) {
      characterRoles {
        character {
          id name russian url
          poster { originalUrl }
        }
      }
    }
  }`

  const res = await request(query, { id })
  return res.mangas[0]?.characterRoles.map((x: any) => x.character) ?? []
}
