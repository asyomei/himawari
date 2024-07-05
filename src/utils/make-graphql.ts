import {
  type AnyZodObject,
  ZodArray,
  ZodEffects,
  ZodNullable,
  ZodObject,
  ZodOptional,
  type ZodTypeAny,
} from "zod";

export function makeGraphql(builder: (u: MakeGraphqlPublicUtils) => GQLQuery): string {
  const u = new MakeGraphqlUtils();
  const query = builder(u);

  let varsTmpl = u.variables.map(v => `$${v.name}:${v.type}`).join(",");
  if (varsTmpl) varsTmpl = `(${varsTmpl})`;

  let queryTmpl = `${query.query}(`;
  for (const [k, v] of Object.entries(query.args)) {
    queryTmpl += `${k}:`;
    if (v instanceof GQLVariable) queryTmpl += `$${v.name}`;
    else if (v instanceof GQLEnumItem) queryTmpl += v.value;
    else queryTmpl += JSON.stringify(v);
    queryTmpl += ",";
  }
  queryTmpl = `${queryTmpl.slice(0, -1)})${getZodObjectNames(query.schema)}`;

  return `query${varsTmpl}{${queryTmpl}}`;
}

export interface MakeGraphqlPublicUtils {
  var(name: string, type: string): GQLVariable;
  item(value: string): GQLEnumItem;
  query(query: string, schema: AnyZodObject, args: Record<string, unknown>): GQLQuery;
}

export class MakeGraphqlUtils implements MakeGraphqlPublicUtils {
  var(name: string, type: string): GQLVariable {
    const variable = new GQLVariable(name, type);

    if (this.variables.some(old => old.name === variable.name)) {
      throw new Error(`Variable "${variable.name}" is already existed`);
    }

    this.variables.push(variable);
    return variable;
  }

  item(value: string): GQLEnumItem {
    return new GQLEnumItem(value);
  }

  query(query: string, schema: AnyZodObject, args: Record<string, unknown>): GQLQuery {
    return new GQLQuery(query, schema, args);
  }

  variables: GQLVariable[] = [];
}

class GQLVariable {
  constructor(
    readonly name: string,
    readonly type: string,
  ) {}
}

class GQLEnumItem {
  constructor(readonly value: string) {}
}

class GQLQuery {
  constructor(
    readonly query: string,
    readonly schema: AnyZodObject,
    readonly args: Record<string, unknown>,
  ) {}
}

function getZodObjectNames(schema: ZodTypeAny): string {
  if (schema instanceof ZodEffects) {
    return getZodObjectNames(schema.sourceType());
  }

  if (schema instanceof ZodArray) {
    return getZodObjectNames(schema.element);
  }

  if (schema instanceof ZodOptional || schema instanceof ZodNullable) {
    return getZodObjectNames(schema.unwrap());
  }

  if (schema instanceof ZodObject) {
    const names: string[] = [];
    for (const [k, v] of Object.entries(schema.shape)) {
      names.push(k + getZodObjectNames(v as any));
    }
    return `{${names.join(",")}}`;
  }

  return "";
}
