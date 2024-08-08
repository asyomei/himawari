<?php

define(
  'MYJSON_OPTS',
  JSON_UNESCAPED_UNICODE
  | JSON_UNESCAPED_SLASHES
  | JSON_UNESCAPED_LINE_TERMINATORS
  | JSON_THROW_ON_ERROR
);

function myjson_decode(string $json)
{
  return json_decode($json, false, 512, MYJSON_OPTS);
}

function myjson_encode(mixed $value, bool $pretty = false)
{
  $opts = MYJSON_OPTS;
  if ($pretty)
    $opts |= JSON_PRETTY_PRINT;

  return json_encode($value, $opts);
}