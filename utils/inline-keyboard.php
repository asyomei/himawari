<?php

function inline_keyboard(array $buttons): array
{
  return ['inline_keyboard' => $buttons];
}

function inline_text(string $text, string $callback_data): array
{
  return [
    'text' => $text,
    'callback_data' => $callback_data
  ];
}

function inline_url(string $text, string $url): array
{
  return ['text' => $text, 'url' => $url];
}

function inline_switchInlineCurrent(string $text, string $query): array
{
  return [
    'text' => $text,
    'switch_inline_query_current_chat' => $query
  ];
}