<?php

function makeCharacterText(mixed $char): string
{
  // ++ Titles
  $titles = [$char->russian, $char->name, $char->japanese];
  $titles = array_filter($titles);
  $titles = array_map(fn($s) => "<b>$s</b>", $titles);
  $result[] = implode(' | ', $titles);
  // -- Titles

  // ++ Description
  if (isset($char->descriptionHtml))
    $result[] = "\n" . parse_description($char->descriptionHtml);
  if (isset($char->descriptionSource))
    $result[] = "\n— " . $char->descriptionSource;
  // -- Description

  return implode($result);
}