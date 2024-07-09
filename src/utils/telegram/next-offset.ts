import { MAX_INLINE_RESULTS } from "#/consts";

export function nextOffset(results: number, offset: number): string {
  return results === MAX_INLINE_RESULTS ? String(offset + MAX_INLINE_RESULTS) : "";
}
