import { describe, it } from "node:test";
import { expect } from "expect";
import { z } from "zod";
import { makeGraphql } from "./make-graphql";

describe("makeGraphql", () => {
  it("should create graphql string from zod schema", () => {
    const schema = z.object({
      id: z.number(),
      name: z.string(),
      email: z.string().email(),
      alias: z.string().optional(),
    });

    const gql = makeGraphql(u => u.query("somequery", { filter: "value" }, schema));

    expect(gql).toBe('query{somequery(filter:"value"){id,name,email,alias}}');
  });

  it("- when it has nested objects", () => {
    const schema = z.object({
      updateId: z.number(),
      user: z.object({
        name: z.string(),
        email: z.string(),
      }),
      rating: z.number(),
    });

    const gql = makeGraphql(u => u.query("update", { first: true }, schema));

    expect(gql).toBe("query{update(first:true){updateId,user{name,email},rating}}");
  });

  it("- when it has nested objects and variables", () => {
    const schema = z.object({
      updateId: z.number(),
      user: z.object({
        name: z.string(),
        email: z.string(),
      }),
      rating: z.number(),
    });

    const gql = makeGraphql(u => {
      const index = u.var("index", "String!");
      const foo = u.var("foo", "PositiveInt");

      return u.query("update", { index, bar: 23, foo }, schema);
    });

    expect(gql).toBe(
      "query($index:String!,$foo:PositiveInt)" +
        "{update(index:$index,bar:23,foo:$foo){updateId,user{name,email},rating}}",
    );
  });

  it("- when it has enum items in arguments", () => {
    const schema = z.object({
      id: z.number(),
      name: z.string(),
    });

    const gql = makeGraphql(u => u.query("some", { gender: u.item("male") }, schema));

    expect(gql).toBe("query{some(gender:male){id,name}}");
  });

  it("- when schema has object effects", () => {
    const schema = z.object({
      sample: z
        .object({
          foo: z.string(),
          bar: z.literal(true),
        })
        .transform(x => x.foo)
        .transform(x => x.length),
    });

    const gql = makeGraphql(u => u.query("some", { a: u.item("b") }, schema));

    expect(gql).toBe("query{some(a:b){sample{foo,bar}}}");
  });

  it("- when schema has objects in array", () => {
    const schema = z.object({
      sample: z.array(
        z.object({
          foo: z.string(),
          bar: z.literal(true),
        }),
      ),
    });

    const gql = makeGraphql(u => u.query("some", { a: u.item("b") }, schema));

    expect(gql).toBe("query{some(a:b){sample{foo,bar}}}");
  });
});
