import { Api, type Transformer } from "grammy";

type TransformerParams = Parameters<Transformer>;
export type ApiRequest = TransformerParams[2] & { method: TransformerParams[1] };

export function getTestApi(): [Api, ApiRequest[]] {
  const api = new Api(":");

  const reqs: ApiRequest[] = [];
  api.config.use(async (_prev, method, payload) => {
    reqs.push({ method, ...payload });
    return { ok: true, result: null as any };
  });

  return [api, reqs];
}
