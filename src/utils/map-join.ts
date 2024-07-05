export default function mapJoin<T>(xs: T[], f: keyof T | ((x: T) => any), sep = ", "): string {
  if (typeof f !== "function") {
    const p = f;
    f = x => x[p];
  }

  return xs.map(f).join(sep);
}
