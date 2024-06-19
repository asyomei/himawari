import { autoRetry as makeAutoRetry } from "@grammyjs/auto-retry";
import { apiThrottler } from "@grammyjs/transformer-throttler";
import type { Api } from "grammy";

const autoRetry = makeAutoRetry();
const throttler = apiThrottler();

export function setupThrottlers(api: Api) {
  api.config.use(autoRetry, throttler);
}
