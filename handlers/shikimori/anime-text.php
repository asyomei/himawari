<?php

function makeAnimeText(mixed $anime): string
{
  // ++ Title
  $titles = [$anime->russian, $anime->name, $anime->japanese];
  $titles = array_filter($titles);
  $titles = array_map(fn($s) => "<b>$s</b>", $titles);
  $result[] = implode("\n| ", $titles);
  // -- Title

  // ++ Kind
  $kind = [
    'tv' => 'TV сериал',
    'movie' => 'Фильм',
    'ova' => 'OVA',
    'ona' => 'ONA',
    'special' => 'Спэшл',
    'tv_special' => 'TV спэшл',
    'music' => 'Клип',
    'pv' => 'Проморолик',
    'cm' => 'Реклама',
  ][$anime->kind];
  $result[] = "\n<b>Тип:</b> $kind";
  // -- Kind

  // ++ Date
  $result[] = "\n<b>Дата:</b> ";
  if ($anime->kind === 'tv' || $anime->kind === 'ova') {
    $dates = array_filter([$anime->airedOn, $anime->releasedOn]);
    $dates = array_map('parse_date', $dates);
    $result[] = !empty($dates) ? implode(' | ', $dates) : 'Неизвестно';
  } else {
    $result[] = isset($anime->airedOn) ? parse_date($anime->airedOn) : 'Неизвестно';
  }
  // -- Date

  // ++ Score
  $result[] = "\n<b>Оценка:</b> $anime->score/10";
  // -- Score

  // ++ Status
  if (isset($anime->status)) {
    $status = [
      'anons' => 'Анонс',
      'ongoing' => 'Онгоинг',
      'released' => 'Выпущено',
    ][$anime->status];
    $result[] = "\n<b>Статус:</b> $status";
  }
  // -- Status

  // ++ Episodes
  $result[] = "\n<b>Эпизоды:</b> ";
  if ($anime->status === 'ongoing') {
    $episodes = $anime->episodes ?? '?';
    $result[] = "$anime->episodesAired/$episodes";
  } else {
    $result[] = $anime->episodes;
  }
  $result[] = ' эп.';
  if (isset($anime->duration)) {
    $result[] = " по $anime->duration мин.";
  }
  // -- Episodes

  // ++ Rating
  if (isset($anime->rating)) {
    $rating = strtoupper($anime->rating);
    $rating = str_replace(['_PLUS', '_'], ['+', '-'], $rating);
    $result[] = "\n<b>Рейтинг:</b> $rating";
  }
  // -- Rating

  // ++ Genres
  if (!empty($anime->genres)) {
    $title = count($anime->genres) > 1 ? 'Жанры' : 'Жанр';
    $genres = array_map(fn($x) => $x->russian, $anime->genres);
    $genres = implode(', ', $genres);
    $result[] = "\n<b>$title:</b> $genres";
  }
  // -- Genres

  // ++ Studios
  if (!empty($anime->studios)) {
    $title = count($anime->studios) > 1 ? 'Студии' : 'Студия';
    $studios = array_map(fn($x) => $x->name, $anime->studios);
    $studios = implode(', ', $studios);
    $result[] = "\n<b>$title:</b> $studios";
  }
  // -- Studios

  // ++ Fandubbers & fansubbers
  if (!empty($anime->fandubbers)) {
    $names = implode(', ', $anime->fandubbers);
    $result[] = "\n<b>Озвучка:</b> $names";
  }
  if (!empty($anime->fansubbers)) {
    $names = implode(', ', $anime->fansubbers);
    $result[] = "\n<b>Субтитры:</b> $names";
  }
  // -- Fandubbers & fansubbers

  // ++ Description
  if (isset($anime->descriptionHtml))
    $result[] = "\n\n" . parse_description($anime->descriptionHtml);
  if (isset($anime->descriptionSource))
    $result[] = "\n— $anime->descriptionSource";
  // -- Description

  return implode($result);
}