import { parse as parseHTML } from "node-html-parser";
import escapeHTML from "#/utils/escape-html";

export const a = (name: any, url: any) => `<a href="${url}">${escapeHTML(name)}</a>`;
export const b = (text: any) => `<b>${escapeHTML(text)}</b>`;

export function parseDescription(html: string): string {
  const doc = parseHTML(html);
  let text = doc.innerText;

  let offset = 0;
  for (const el of doc.getElementsByTagName("a")) {
    const url = el.attributes.href;
    const name = el.innerText;
    const block = `<a href="${url}">${name}</a>`;
    const index = text.indexOf(name, offset);
    text = text.slice(0, offset) + text.slice(offset).replace(name, block);
    offset = index + block.length;
  }

  return `<blockquote expandable>${text}</blockquote>`;
}
