import type { z } from "zod";
import type { zHistory } from "./schemas";

export type History = z.output<typeof zHistory>;
