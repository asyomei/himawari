import { z } from "zod";

export type Rating = z.infer<typeof rating>;
export const rating = z.enum(["none", "g", "pg", "pg_13", "r", "r_plus", "rx"]);

export type Basic = z.infer<typeof basic>;
export const basic = z.object({
  id: z.string(),
  name: z.string(),
  russian: z.string().nullish(),
  isCensored: z.boolean().nullish(),
});
