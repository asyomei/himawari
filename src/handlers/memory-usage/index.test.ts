import { describe, it } from "node:test";
import { expect } from "expect";
import { type ApiRequest, getTestApi } from "#/utils/testing";
import { MemoryUsageHandler } from ".";

describe("MemoryUsageHandler", () => {
  const handler = new MemoryUsageHandler();

  for (const megabytes of [3.45, 42]) {
    it(`should send memory usage when it is ${megabytes} MB`, async () => {
      const [api, reqs] = getTestApi();

      await handler.onMemoryCommand(api, {
        chatId: 1,
        memoryUsageBytes: megabytes * 1024 * 1024,
      });

      expect(reqs).toEqual([
        {
          method: "sendMessage",
          chat_id: 1,
          text: `Потребление памяти: ${megabytes} МБ`,
        } satisfies ApiRequest,
      ]);
    });
  }
});
