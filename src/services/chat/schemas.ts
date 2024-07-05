import { z } from "zod";

export const zHistory = z
  .object({
    role: z.enum(["user", "assistant"]),
    content: z.string(),
  })
  .array();
