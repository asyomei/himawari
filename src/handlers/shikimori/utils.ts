import parseHTML from "node-html-parser"

export function escapeHTML(s: string) {
  const lookup = {
    "&": "&amp;",
    '"': "&quot;",
    "'": "&apos;",
    "<": "&lt;",
    ">": "&gt;",
  }
  return s.replace(/[&"'<>]/g, c => lookup[c as never])
}

export function parseDescription(html: string): string {
  const doc = parseHTML(html)
  let text = doc.innerText

  for (const el of doc.querySelectorAll('div[data-dynamic="spoiler_block"]')) {
    const raw = el.innerText
    const spoiler = escapeHTML(raw.replace("спойлер", ""))
    text = text.replace(raw, `\n<b>Спойлер:</b>\n<tg-spoiler>${spoiler}</tg-spoiler>`)
  }

  let offset = 0
  for (const el of doc.getElementsByTagName("a")) {
    const url = el.attributes.href
    const name = el.innerText
    const block = `<a href="${url}">${escapeHTML(name)}</a>`
    const index = text.indexOf(name, offset)
    text = text.slice(0, offset) + text.slice(offset).replace(name, block)
    offset = index + block.length
  }

  return `<blockquote expandable>${text}</blockquote>`
}
