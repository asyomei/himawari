import type { CharacterInfo } from "#/services/shikimori/types";
import { compact } from "#/utils/compact";
import { b, parseDescription } from "./utils";

export function makeCharacterText(char: CharacterInfo) {
  const result: any[] = [];

  // ++ Titles
  const titles = compact([char.russian, char.name, char.japanese]).map(b);
  result.push(titles.join(" | "));
  // -- Titles
  // ++ Description
  if (char.descriptionHtml) {
    result.push("\n", parseDescription(char.descriptionHtml));
  }
  if (char.descriptionSource) {
    result.push("\n", "— ", char.descriptionSource);
  }
  // -- Description

  return result.join("");
}
