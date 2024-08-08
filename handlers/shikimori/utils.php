<?php

require_once __SRC__ . '/simple_html_dom.php';

function parse_date(mixed $date): string
{
  $zero = fn($s) => $s ? str_pad($s, 2, '0', STR_PAD_LEFT) : $s;
  return implode('.', array_filter([$zero($date->day), $zero($date->month), $date->year]));
}

function parse_description(string $html): string
{
  $doc = str_get_html($html);
  $text = $doc->plaintext;

  foreach ($doc->find('div[data-dynamic="spoiler_block"]') as $el) {
    $raw = $doc->plaintext;
    $spoiler = htmlspecialchars(str_replace('спойлер', '', $raw));
    $text = str_replace($raw, "<b>Спойлер:</b> <tg-spoiler>$spoiler</tg-spoiler>", $text);
  }

  $offset = 0;
  foreach ($doc->find('a') as $el) {
    $url = $el->href;
    $name = $el->plaintext;
    $escaped = htmlspecialchars($name);
    $block = "<a href=\"$url\">$escaped</a>";
    $index = mb_strpos($text, $name, $offset);
    $text = mb_substr($text, 0, $offset) . str_replace($name, $block, mb_substr($text, $offset));
    $offset = $index + mb_strlen($block);
  }

  return "<blockquote expandable>$text</blockquote>";
}