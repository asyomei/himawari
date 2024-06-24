import type { Redis } from "ioredis";

export interface HandlerDeps {
  redis: Redis;
}
