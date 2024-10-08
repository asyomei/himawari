export async function request(query: string, variables: Record<string, any>): Promise<any> {
  const resp = await fetch("https://shikimori.one/api/graphql", {
    headers: { "Content-Type": "application/json" },
    method: "POST",
    body: JSON.stringify({ query, variables }),
  })

  const res = await resp.json()
  if (res.errors) {
    throw new Error(res.errors[0].message)
  }

  return res.data
}
