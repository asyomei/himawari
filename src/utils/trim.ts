import escapeRegExp from "./escape-regex";

export default function trim(s: string, a: string) {
  const b = `[${escapeRegExp(a)}]`;
  const r = new RegExp(`^${b}+|${b}+$`, "g");
  return s.replaceAll(r, "");
}
