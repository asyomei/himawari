import { request } from "../request"

export const api = { search, info, screenshots, videos, characters }

async function search(search: string, limit: number, page: number): Promise<any[]> {
  const query = `query($search: String!, $limit: Int!, $page: Int!) {
    animes(search: $search, limit: $limit, page: $page) {
      id name russian isCensored url
      poster { originalUrl }
    }
  }`

  const res = await request(query, { search, limit, page })
  return res.animes
}

async function info(id: string): Promise<any> {
  const query = `query($id: String!) {
    animes(ids: $id, limit: 1) {
      id name russian japanese isCensored url
      kind status rating score
      episodesAired episodes nextEpisodeAt
      fandubbers fansubbers
      descriptionHtml descriptionSource
      airedOn { day month year }
      releasedOn { day month year }
      genres { russian }
      studios { name }
      poster { originalUrl }
    }
  }`

  const res = await request(query, { id })
  return res.animes[0]
}

async function screenshots(id: string): Promise<any[]> {
  const query = `query($id: String!) {
    animes(ids: $id, limit: 1) {
      screenshots { id originalUrl }
    }
  }`

  const res = await request(query, { id })
  return res.animes[0]?.screenshots ?? []
}

async function videos(id: string): Promise<any[]> {
  const query = `query($id: String!) {
    animes(ids: $id, limit: 1) {
      videos { id kind name imageUrl playerUrl url }
    }
  }`

  const fixUrls = (video: any) => {
    video.imageUrl = video.imageUrl.replace(/^\/\//, "https://")
    video.playerUrl = video.playerUrl.replace(/^\/\//, "https://")
    return video
  }

  const res = await request(query, { id })
  return res.animes[0]?.videos?.map(fixUrls) ?? []
}

async function characters(id: string): Promise<any[]> {
  const query = `query($id: String!) {
    animes(ids: $id, limit: 1) {
      characterRoles {
        character {
          id name russian url
          poster { originalUrl }
        }
      }
    }
  }`

  const res = await request(query, { id })
  return res.animes[0]?.characterRoles.map((x: any) => x.character) ?? []
}
