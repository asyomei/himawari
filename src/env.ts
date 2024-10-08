import "dotenv/config"
import { cleanEnv, str } from "envalid"

declare global {
  export const NODE_ENV: "development" | "production"
}

export const env = cleanEnv(process.env, {
  BOT_TOKEN: str(),
})
