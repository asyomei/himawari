<?php

function chosen_inline_filter(string $pattern)
{
  return function (Context $ctx) use ($pattern) {
    $q = $ctx->chosenInlineResult?->result_id;
    if (!$q)
      return false;

    preg_match($pattern, $q, $m);
    if (empty($m))
      return false;

    $ctx->match = $m;
    return true;
  };
}