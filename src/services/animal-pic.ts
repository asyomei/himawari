import { z } from "zod";

export type Type = z.output<typeof zType>;

const zType = z.enum(["cat", "dog", "fox", "fish", "alpaca", "bird"]);
const schema = z.object({ message: z.string().url() });

export class AnimalPicService {
  async get(type: Type) {
    const res = await fetch(`https://api.sefinek.net/api/v2/random/animal/${type}`);
    return schema.parse(await res.json()).message;
  }
}
