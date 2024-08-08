<?php

function array_deep_compact(array $haystack): array
{
  foreach ($haystack as $key => $value) {
    if (is_array($value)) {
      $haystack[$key] = array_deep_compact($haystack[$key]);
    } elseif ($haystack[$key] === null) {
      unset($haystack[$key]);
    }
  }

  return $haystack;
}