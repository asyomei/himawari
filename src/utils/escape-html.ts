export default function escapeHTML(s: string) {
  return s.replace(/[&"'<>]/g, c => lookup[c as never]);
}

const lookup = {
  "&": "&amp;",
  '"': "&quot;",
  "'": "&apos;",
  "<": "&lt;",
  ">": "&gt;",
};
