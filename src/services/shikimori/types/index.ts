import { z } from "zod";

export * from "./anime";
export * from "./basic";

export type Type = z.infer<typeof type>;
export const type = z.enum(["animes", "mangas"]);
