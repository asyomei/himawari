export function escapeHTML(s: string) {
  const lookup = {
    '&': '&amp;',
    '"': '&quot;',
    "'": '&apos;',
    '<': '&lt;',
    '>': '&gt;',
  }
  return s.replace(/[&"'<>]/g, c => lookup[c as never])
}
