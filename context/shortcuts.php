<?php

trait ContextShortcuts
{
  public function msg(): mixed
  {
    return $this->message ?? $this->callbackQuery?->message;
  }

  public function msgId(): ?int
  {
    return $this->msg()?->message_id;
  }

  public function chat(): mixed
  {
    return $this->msg()?->chat;
  }

  public function chatId(): ?int
  {
    return $this->chat()?->id;
  }

  public function from(): mixed
  {
    return ($this->message ?? $this->callbackQuery ?? $this->inlineQuery ?? $this->chosenInlineResult)?->from;
  }

  public function inlineMsgId(): ?string
  {
    return $this->chosenInlineResult?->inline_message_id;
  }
}