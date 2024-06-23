import { describe, it } from "node:test";
import { expect } from "expect";
import { z } from "zod";
import { Callbacks } from "./callbacks";

describe("CallbackData", () => {
  it("should generate callback data", () => {
    const schema = z.object({
      kind: z.enum(["a", "b"]),
      name: z.string(),
      info: z.string().nullish(),
      id: z.number(),
    });
    const cbData = new Callbacks({ foo: schema });

    const data = cbData.make("foo", { id: 1, name: "John", kind: "b" });

    expect(data).toBe('foo["b","John",null,1]');
  });

  it("should parse from raw callback data string", () => {
    const schema = z.object({
      kind: z.enum(["a", "b"]),
      name: z.string(),
      info: z.string().nullish(),
      id: z.number(),
    });
    const cbData = new Callbacks({ foo: schema });

    const object = cbData.parse("foo", 'foo["a","Adam",null,42]');

    expect(object).toEqual({
      id: 42,
      info: null,
      name: "Adam",
      kind: "a",
    });
  });
});
