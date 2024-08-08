<?php

function inline_filter(string $pattern)
{
  return function (Context $ctx) use ($pattern) {
    $q = $ctx->inlineQuery?->query;
    if (!$q)
      return false;

    preg_match($pattern, $q, $m);
    if (empty($m))
      return false;

    $ctx->match = $m;
    return true;
  };
}