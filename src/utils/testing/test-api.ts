import { Api, type Transformer } from "grammy";
import { isUndefined, omitBy } from "lodash-es";

type TransformerParams = Parameters<Transformer>;
export type ApiMethod = TransformerParams[1];
export type ApiPayload = TransformerParams[2];
export type ApiRequest = ApiPayload & { method: ApiMethod };

const mockedResponses = new WeakMap<Api, Record<string, any[]>>();

export function getTestApi(): [Api, ApiRequest[]] {
  const api = new Api(":");
  mockedResponses.set(api, {});

  const reqs: ApiRequest[] = [];
  api.config.use(async (_prev, method, payload) => {
    reqs.push({ method, ...omitBy(payload, isUndefined) });

    const mocked = mockedResponses.get(api)?.[method]?.shift();
    return { ok: true, result: mocked };
  });

  return [api, reqs];
}

export function mockResponse(api: Api, method: ApiMethod, response: any) {
  const map = mockedResponses.get(api)!;
  map[method] ??= [];
  map[method].push(response);
}
