import { request as originalRequest } from '#/backend/utils/graphql'

const URL = 'https://shikimori.one/api/graphql'

export const request = (query: string, variables: Record<string, any>) =>
  originalRequest(URL, query, variables)

export const gql = String.raw
