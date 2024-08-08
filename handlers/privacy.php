<?php

define('PRIVACY_TEXT', <<<EOF
Данный бот предоставляет свои услуги бесплатно и хранит следующие данные для работы функционала:
- ID пользователей и чатов - для ограничения по количеству запросов в единицу времени, для работы функционала "Чат с GPT-4"
- Текст сообщений пользователей функционала "Чат с GPT-4" для работы данного функционала
Чтобы удалить данные, связанные с функционалом "Чат с GPT-4", воспользуйтесь очисткой контекста чата (/help)
---
This bot provides its services for free and stores the following data for the functionality:
- IDs of users and chats - to limit the number of requests per unit of time, for the operation of the "Chat with GPT-4" functionality
- Text of messages of users of the "Chat with GPT-4" functionality for operation of this functionality
To remove data associated with the "Chat with GPT-4" functionality, use clear chat context (/help)

Исходный код / Source code: https://github.com/asyomei/himawari-bot
EOF);

class PrivacyHandler
{
  public function handle(Context $ctx)
  {
    if (command('privacy')($ctx))
      return $this->onPrivacyCommand($ctx);

    return 'next';
  }

  public function onPrivacyCommand(Context $ctx)
  {
    $ctx->reply(PRIVACY_TEXT);
  }
}