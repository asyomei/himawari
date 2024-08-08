<?php

function nextOffset(int $resultsCount, int $offset)
{
  return $resultsCount === MAX_INLINE_RESULTS ? (string) ($offset + MAX_INLINE_RESULTS) : "";
}