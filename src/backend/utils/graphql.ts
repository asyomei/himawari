export async function request(
  url: string,
  query: string,
  variables: Record<string, any>,
): Promise<any> {
  const resp = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'asyomei-himawari/1.0',
    },
    method: 'POST',
    body: JSON.stringify({ query, variables }),
  })

  const res = await resp.json()
  if (res.errors) {
    throw new Error(res.errors[0].message)
  }

  return res.data
}
