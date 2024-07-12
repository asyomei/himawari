import { request } from "graphql-request";
import { graphql as _graphql } from "./_gen";
import type { TypedDocumentString } from "./_gen/graphql";

export type * from "./_gen/graphql";

export const graphql: typeof _graphql & ((source: string) => unknown) = _graphql as any;

export async function execute<TResult, TVariables extends object>(
  url: string,
  query: TypedDocumentString<TResult, TVariables>,
  ...[variables]: TVariables extends Record<string, never> ? [] : [TVariables]
) {
  return await request<TResult>(url, query.toString(), variables);
}
