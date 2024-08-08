<?php

trait ContextHelpers
{
  public function reply(string $text, array $params = []): mixed
  {
    return $this->sendMessage($this->chatId(), $text, $params);
  }

  public function replyWithPhoto(mixed $photo, array $params = []): mixed
  {
    return $this->sendPhoto($this->chatId(), $photo, $params);
  }

  public function replyWithAnimation(mixed $animation, array $params = []): mixed
  {
    return $this->sendAnimation($this->chatId(), $animation, $params);
  }
}