<?php

require_once __DIR__ . '/service.php';

class ChatHandler
{
  private ChatService $chat;
  public function __construct(ChatService $chat)
  {
    $this->chat = $chat;
  }

  public function handle(Context $ctx)
  {
    if (himawari('chat', 'чат')($ctx))
      return $this->onChatCommand($ctx, $ctx->match);
    if (himawari('reset', 'clear', 'сброс', 'очистка')($ctx))
      return $this->onResetCommand($ctx);

    return 'next';
  }

  public function onChatCommand(Context $ctx, string $prompt)
  {
    if (!$prompt) {
      return $ctx->reply('Введите текст', [
        'reply_parameters' => makeReply($ctx->message)
      ]);
    }

    $m = $ctx->reply('<i>Запрос отправлен. Ответ появится здесь.</i>', [
      'reply_parameters' => makeReply($ctx->message),
      'parse_mode' => 'HTML'
    ]);

    $answer = $this->chat->chat($ctx->from()->id, $prompt);
    $ctx->editMessageText($m->chat->id, $m->message_id, $answer);
  }

  public function onResetCommand(Context $ctx)
  {
    $this->chat->clear($ctx->from()->id);
    $m = $ctx->reply('Контекст очищен.', [
      'reply_parameters' => makeReply($ctx->message)
    ]);

    sleep(3);
    $ctx->tg->multi(function () use ($ctx, $m) {
      $ctx->deleteMessage($ctx->chatId(), $ctx->msgId());
      $ctx->deleteMessage($m->chat->id, $m->message_id);
    }, true);
  }
}