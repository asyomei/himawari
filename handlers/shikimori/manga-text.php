<?php

function makeMangaText(mixed $manga): string
{
  // ++ Title
  $titles = [$manga->russian, $manga->name, $manga->japanese];
  $titles = array_filter($titles);
  $titles = array_map(fn($s) => "<b>$s</b>", $titles);
  $result[] = implode("\n| ", $titles);
  // -- Title

  // ++ Kind
  $kind = [
    'manga' => 'Манга',
    'manhwa' => 'Манхва',
    'manhua' => 'Манхуа',
    'light_novel' => 'Лайт новелла',
    'novel' => 'Ранобэ',
    'one_shot' => 'Ваншот',
    'doujin' => 'Додзин',
  ][$manga->kind];
  $result[] = "\n<b>Тип:</b> $kind";
  // -- Kind

  // ++ Date
  $result[] = "\n<b>Дата:</b> ";
  if ($manga->kind === 'tv' || $manga->kind === 'ova') {
    $dates = array_filter([$manga->airedOn, $manga->releasedOn]);
    $dates = array_map('parse_date', $dates);
    $result[] = !empty($dates) ? implode(' | ', $dates) : 'Неизвестно';
  } else {
    $result[] = isset($manga->airedOn) ? parse_date($manga->airedOn) : 'Неизвестно';
  }
  // -- Date

  // ++ Score
  $result[] = "\n<b>Оценка:</b> $manga->score/10";
  // -- Score

  // ++ Status
  if (isset($manga->status)) {
    $status = [
      'anons' => 'Анонс',
      'ongoing' => 'Онгоинг',
      'released' => 'Выпущен',
      'paused' => 'Приостановлен',
      'discontinued' => 'Заброшен',
    ][$manga->status];
    $result[] = "\n<b>Статус:</b> $status";
  }
  // -- Status

  // ++ Volumes & chapters
  if (isset($manga->volumes))
    $result[] = "\n<b>Томов:</b> $manga->volumes";
  if (isset($manga->chapters))
    $result[] = "\n<b>Глав:</b> $manga->chapters";
  // -- Volumes & chapters

  // ++ Rating
  if (isset($manga->rating)) {
    $rating = strtoupper($manga->rating);
    $rating = str_replace(['_PLUS', '_'], ['+', '-'], $rating);
    $result[] = "\n<b>Рейтинг:</b> $rating";
  }
  // -- Rating

  // ++ Genres
  if (!empty($manga->genres)) {
    $title = count($manga->genres) > 1 ? 'Жанры' : 'Жанр';
    $genres = array_map(fn($x) => $x->russian, $manga->genres);
    $genres = implode(', ', $genres);
    $result[] = "\n<b>$title:</b> $genres";
  }
  // -- Genres

  // ++ Publishers
  if (!empty($manga->publishers)) {
    $title = count($manga->publishers) > 1 ? 'Издатели' : 'Издатель';
    $publishers = array_map(fn($x) => $x->name, $manga->publishers);
    $publishers = implode(', ', $publishers);
    $result[] = "\n<b>$title:</b> $publishers";
  }
  // -- Publishers

  // ++ Description
  if (isset($manga->descriptionHtml))
    $result[] = "\n\n" . parse_description($manga->descriptionHtml);
  if (isset($manga->descriptionSource))
    $result[] = "\n— $manga->descriptionSource";
  // -- Description

  return implode($result);
}