import type { Redis } from "ioredis";

export interface MiddlewareDeps {
  redis: Redis;
}
