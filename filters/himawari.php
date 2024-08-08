<?php

function himawari(string ...$commands)
{
  return function (Context $ctx) use ($commands) {
    $text = $ctx->message?->text;
    if (!$text)
      return false;

    [$mention, $rest] = preg_split('/\s+/', $text, 2);
    $lower = mb_strtolower($mention);
    if ($lower === 'himawari' || $lower === 'химавари') {
      if (!$rest)
        return false;
      $text = $rest;
    } else if ($ctx->chat()?->type !== 'private') {
      return false;
    }

    [$command, $rest] = preg_split('/\s+/', $text, 2);
    $lower = mb_strtolower($command);
    foreach ($commands as $c) {
      if ($lower === $c) {
        $ctx->match = $rest ?? '';
        return true;
      }
    }

    return false;
  };
}