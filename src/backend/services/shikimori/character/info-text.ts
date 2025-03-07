import { parseDescription } from '../parse-description'
import type { api } from './api'

type Character = Awaited<ReturnType<typeof api.info>>
type Writer = (buf: any[], character: Character) => boolean

export function makeCharacterInfoText(character: Character): string {
  return write(character, [addTitle, addSynonyms, addDescription])
}

function write(character: Character, writers: Writer[]): string {
  const buf: any[] = []
  for (const writer of writers) {
    const writed = writer(buf, character)
    if (writed) buf.push('\n')
  }
  return buf.join('').trimEnd()
}

const addTitle: Writer = (buf, character) => {
  if (character.russian) buf.push(`<b>${character.russian}</b> | `)
  buf.push(`<b>${character.name}</b>`)
  if (character.japanese) buf.push(` | <b>${character.japanese}</b>`)
  return true
}

const addSynonyms: Writer = (buf, character) => {
  if (!character.synonyms || character.synonyms.length === 0) return false
  buf.push('<b>Другие имена:</b> ', character.synonyms.filter(x => x !== character.name).join(', '))
  return true
}

const addDescription: Writer = (buf, character) => {
  if (!character.descriptionHtml) return false
  buf.push(parseDescription(character.descriptionHtml))

  if (character.descriptionSource) {
    buf.push(`\n— <a href="${character.descriptionSource}">Источник</a>`)
  }

  return true
}
