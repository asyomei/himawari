import type { ShikimoriService } from ".";

type Funcs = (typeof ShikimoriService)["prototype"];
type Get<K extends keyof Funcs> = NonNullable<Awaited<ReturnType<Funcs[K]>>>;

export type AnimeBasic = Get<"searchAnime">[number];
export type MangaBasic = Get<"searchManga">[number];

export type AnimeInfo = Get<"anime">;
export type MangaInfo = Get<"manga">;
export type CharacterInfo = Get<"character">;
