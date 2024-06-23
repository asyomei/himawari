import { type Api, Context } from "grammy";
import type { Update, UserFromGetMe } from "grammy/types";
import type { PartialDeep } from "type-fest";

export function getTestContext<T extends keyof Update>(
  api: Api,
  entity: T,
  update: PartialDeep<Update[T]>,
): any {
  return new Context({ update_id: 1, [entity]: update } as Update, api, testMe);
}

const testMe: UserFromGetMe = {
  id: 4242,
  is_bot: true,
  first_name: "TestBot",
  username: "test_bot",
  can_join_groups: false,
  can_read_all_group_messages: false,
  supports_inline_queries: false,
};
