<?php

function command(string ...$commands)
{
  return function (Context $ctx) use ($commands) {
    $text = $ctx->message?->text;
    if (!$text)
      return false;

    [$cmd, $rest] = preg_split('/\s+/', $text, 2);
    if ($cmd[0] !== '/')
      return false;

    $lower = strtolower($cmd);
    [$name, $mention] = explode('@', substr($lower, 1), 2);

    if ($mention && $mention !== $ctx->getMe()->username)
      return false;

    foreach ($commands as $c) {
      if ($name === $c) {
        $ctx->match = $rest ?? '';
        return true;
      }
    }

    return false;
  };
}