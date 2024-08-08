<?php

trait ContextMethods
{
  public function getMe(): mixed
  {
    $this->_me ??= $this->tg->getMe();
    return $this->_me;
  }

  public function sendMessage(string|int $chat_id, string $text, array $params = []): mixed
  {
    return $this->tg->sendMessage(
      ...$params,
      chat_id: $chat_id,
      text: $text,
    );
  }

  public function sendPhoto(string|int $chat_id, mixed $photo, array $params = []): mixed
  {
    return $this->tg->sendPhoto(
      ...$params,
      chat_id: $chat_id,
      photo: $photo,
    );
  }

  public function sendAnimation(string|int $chat_id, mixed $animation, array $params = []): mixed
  {
    return $this->tg->sendAnimation(
      ...$params,
      chat_id: $chat_id,
      animation: $animation,
    );
  }

  public function editMessageText(string|int $chat_id, string|int $message_id, string $text, array $params = []): mixed
  {
    return $this->tg->editMessageText(
      ...$params,
      chat_id: $chat_id,
      message_id: $message_id,
      text: $text,
    );
  }

  public function editMessageReplyMarkup(array $params = []): mixed
  {
    return $this->tg->editMessageReplyMarkup(
      ...$params,
      chat_id: $this->chat()->id,
      message_id: $this->msgId(),
    );
  }

  public function deleteMessage(string|int $chat_id, string|int $message_id, array $params = []): mixed
  {
    return $this->tg->deleteMessage(
      ...$params,
      chat_id: $chat_id,
      message_id: $message_id,
    );
  }

  public function answerCallbackQuery(?string $text = null, array $params = []): mixed
  {
    return $this->tg->answerCallbackQuery(
      ...$params,
      callback_query_id: $this->callbackQuery->id,
      text: $text,
    );
  }

  public function answerInlineQuery(array $results, array $params = []): mixed
  {
    return $this->tg->answerInlineQuery(
      ...$params,
      inline_query_id: $this->inlineQuery->id,
      results: $results,
    );
  }

  public function editInlineMessageText(string $text, array $params = []): mixed
  {
    return $this->tg->editMessageText(
      ...$params,
      inline_message_id: $this->chosenInlineResult->inline_message_id,
      text: $text,
    );
  }
}