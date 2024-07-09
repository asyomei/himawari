import "dotenv/config";
import { cleanEnv, str } from "envalid";

export const env = cleanEnv(process.env, {
  BOT_TOKEN: str(),
  REDIS_URL: str(),
});

export const nodeEnv = env.isDev ? ("development" as const) : ("production" as const);
