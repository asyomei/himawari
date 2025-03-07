import { load } from 'cheerio'
import { chunk, randomInt } from 'es-toolkit'

const FACTS_COUNT = 1713
const PAGES_COUNT = 172

const getUrl = (page: number) => `https://sefan.ru/fakt/ru/2/page-${page}.html`

export async function getRandomFact() {
  const id = randomInt(1, FACTS_COUNT + 1)
  return await getFact(id)
}

export async function getFact(id: number) {
  id = Math.max(1, Math.min(FACTS_COUNT, id))

  const page = PAGES_COUNT - getPage(id)
  const url = getUrl(page)
  const res = await fetch(url, { headers: { 'User-Agent': 'asyomei-himawari/1.0' } })
  const html = await res.text()
  const $ = load(html)

  const elems = $('.f > .f').toArray()
  const facts = elems.flatMap(x => {
    const child = x.firstChild
    if (!child) return []

    if (child.type === 'tag' && child.tagName === 'small') {
      const child2 = child.firstChild
      return child2?.type === 'text' ? [child2.data] : []
    }

    return child.type === 'text' ? [child.data] : []
  })

  const fact = chunk(facts, 2).at(-getPos(id)) as [string, string]
  if (!fact) throw new Error(`Fact #${id} is not found`)

  return { text: fact[0], info: fact[1], url }
}

function getPage(id: number): number {
  if (id <= 3) return 0

  const last = id % 10
  const page = Math.floor(id / 10)
  return 4 <= last ? page + 1 : page
}

function getPos(id: number): number {
  return id <= 3 ? id : (id % 10) - 3
}
