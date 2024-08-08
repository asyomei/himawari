<?php

require_once __SRC__ . '/telegram.php';
require_once __DIR__ . '/shortcuts.php';
require_once __DIR__ . '/methods.php';
require_once __DIR__ . '/helpers.php';

class Context
{
  use ContextShortcuts;
  use ContextMethods;
  use ContextHelpers;

  public Telegram $tg;
  public mixed $update;
  public mixed $match;

  public mixed $message;
  public mixed $callbackQuery;
  public mixed $inlineQuery;
  public mixed $chosenInlineResult;

  public function __construct(Telegram $tg, mixed $update)
  {
    $this->tg = $tg;
    $this->update = $update;

    $this->message = $update->message;
    $this->callbackQuery = $update->callback_query;
    $this->inlineQuery = $update->inline_query;
    $this->chosenInlineResult = $update->chosen_inline_result;
  }
}