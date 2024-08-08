<?php

require_once __DIR__ . '/utils.php';
require_once __DIR__ . '/anime-text.php';
require_once __DIR__ . '/manga-text.php';
require_once __DIR__ . '/character-text.php';
require_once __DIR__ . '/service.php';

class ShikimoriHandler
{
  private ShikimoriService $shiki;
  public function __construct(ShikimoriService $shiki)
  {
    $this->shiki = $shiki;
  }

  public function handle(Context $ctx)
  {
    if (himawari('anime', 'аниме')($ctx))
      return $this->search($ctx, 'anime', $ctx->match);

    if (cbd_filter('shikiQ')($ctx))
      return $this->changePage($ctx, $ctx->match);

    if (cbd_filter('shikiT', type: 'anime')($ctx))
      return $this->sendAnimeInfo($ctx, $ctx->match);
    if (cbd_filter('shikiT', type: 'manga')($ctx))
      return $this->sendMangaInfo($ctx, $ctx->match);

    if (inline_filter('/^(?:anime|аниме)\s+(.+)$/i')($ctx))
      return $this->searchInline($ctx, 'anime', $ctx->match[1]);
    if (inline_filter('/^(?:manga|манга)\s+(.+)$/i')($ctx))
      return $this->searchInline($ctx, 'manga', $ctx->match[1]);

    if (chosen_inline_filter('/^anime-title:(\w+)$/')($ctx))
      return $this->animeSearchChosen($ctx, $ctx->match[1]);
    if (chosen_inline_filter('/^manga-title:(\w+)$/')($ctx))
      return $this->mangaSearchChosen($ctx, $ctx->match[1]);

    if (inline_filter('/^anime-screenshots:(\w+)$/')($ctx))
      return $this->animeScreenshotsInline($ctx, $ctx->match[1]);
    if (inline_filter('/^anime-videos:(\w+)$/')($ctx))
      return $this->animeVideosInline($ctx, $ctx->match[1]);

    if (inline_filter('/^title-characters:(anime|manga):(\w+)$/')($ctx))
      return $this->charactersInline($ctx, $ctx->match[1], $ctx->match[2]);
    if (chosen_inline_filter('/^title-character:(\w+)$/')($ctx))
      return $this->characterChosen($ctx, $ctx->match[1]);

    return 'next';
  }

  public function search(Context $ctx, string $type, string $query)
  {
    if (!$query) {
      return $ctx->reply('Введите название для поиска', [
        'reply_parameters' => makeReply($ctx->message)
      ]);
    }

    $action = ['anime' => 'Поиск аниме', 'manga' => 'Поиск манги'][$type];
    $escaped = htmlspecialchars($query);

    $m = $ctx->reply("<b>$action:</b> $escaped...", [
      'parse_mode' => 'HTML',
      'reply_parameters' => makeReply($ctx->message)
    ]);

    $basics = $this->shiki->search($type, $query);

    $ctx->editMessageText($m->chat->id, $m->message_id, "<b>$action:</b> $escaped", [
      'parse_mode' => 'HTML',
      'reply_markup' => $this->basicsListMenu($basics, $type, 1, $ctx->from()->id)
    ]);
  }

  public function changePage(Context $ctx, mixed $data)
  {
    if ($data->page < 1) {
      return $ctx->answerCallbackQuery('Достигнуто начало поиска');
    }

    $text = $ctx->msg()?->text;
    if (!$text) {
      return $ctx->answerCallbackQuery('Что-то пошло не так');
    }

    $query = substr($text, strpos($text, ':') + 2);
    $basics = $this->shiki->search($data->type, $query, $data->page);

    if (empty($basics)) {
      return $ctx->answerCallbackQuery('Достигнут конец поиска');
    }

    $ctx->tg->multi(function () use ($ctx, $basics, $data) {
      $ctx->answerCallbackQuery();
      $ctx->editMessageReplyMarkup([
        'reply_markup' => $this->basicsListMenu($basics, $data->type, $data->page, $ctx->from()->id)
      ]);
    });
  }

  public function sendAnimeInfo(Context $ctx, mixed $data)
  {
    $anime = $this->shiki->anime($data->titleId);
    if (!$anime) {
      return $ctx->answerCallbackQuery('Аниме не найдено');
    }

    $caption = implode(' | ', array_filter([$anime->russian, $anime->name]));

    $ctx->answerCallbackQuery();

    if ($anime->poster) {
      $m = $ctx->replyWithPhoto($anime->poster->originalUrl, [
        'caption' => $caption,
        'has_spoiler' => !!$anime->isCensored,
      ]);
    }

    $ctx->reply(makeAnimeText($anime), [
      'parse_mode' => 'HTML',
      'reply_parameters' => makeReply($m),
      'link_preview_options' => ['is_disabled' => true],
      'reply_markup' => inline_keyboard([
        [
          inline_switchInlineCurrent('Скриншоты', "anime-screenshots:$anime->id"),
          inline_switchInlineCurrent('Видео', "anime-videos:$anime->id"),
        ],
        [inline_switchInlineCurrent('Персонажи', "title-characters:anime:$anime->id")],
        [inline_url('Shikimori', $anime->url)]
      ])
    ]);
  }

  public function sendMangaInfo(Context $ctx, mixed $data)
  {
    $manga = $this->shiki->manga($data->titleId);
    if (!$manga) {
      return $ctx->answerCallbackQuery('Манга не найдена');
    }

    $caption = implode(' | ', array_filter([$manga->russian, $manga->name]));

    $ctx->answerCallbackQuery();

    if ($manga->poster) {
      $m = $ctx->replyWithPhoto($manga->poster->originalUrl, [
        'caption' => $caption,
        'has_spoiler' => !!$manga->isCensored,
      ]);
    }

    $ctx->reply(makeMangaText($manga), [
      'parse_mode' => 'HTML',
      'reply_parameters' => makeReply($m),
      'link_preview_options' => ['is_disabled' => true],
      'reply_markup' => inline_keyboard([
        [inline_switchInlineCurrent('Персонажи', "title-characters:anime:$manga->id")],
        [inline_url('Shikimori', $manga->url)]
      ])
    ]);
  }

  public function searchInline(Context $ctx, string $type, string $query)
  {
    $offset = (int) $ctx->inlineQuery->offset;
    $page = $offset / MAX_INLINE_RESULTS + 1;

    $results = [];
    $basics = $this->shiki->search($type, $query, $page, MAX_INLINE_RESULTS);
    foreach ($basics as $basic) {
      $title = $basic->russian ?? $basic->name;
      if ($basic->isCensored)
        $title = "[18+] $title";
      $desc = isset($basic->russian) ? $basic->name : null;
      $results[] = [
        'type' => 'article',
        'id' => "$type-title:$basic->id",
        'title' => $title,
        'description' => $desc,
        'url' => $basic->url,
        'thumbnail_url' => !$basic->isCensored ? $basic->poster?->originalUrl : null,
        'reply_markup' => inline_keyboard([[inline_text('Загрузка...', 'nop')]]),
        'input_message_content' => ['message_text' => $title]
      ];
    }

    $ctx->answerInlineQuery($results, [
      'next_offset' => nextOffset(count($results), $offset),
      'cache_time' => INLINE_CACHE_TIME,
    ]);
  }

  public function animeSearchChosen(Context $ctx, string $titleId)
  {
    $anime = $this->shiki->anime($titleId);
    if (!$anime) {
      return $this->editInlineMessageText('Что-то пошло не так');
    }

    $ctx->editInlineMessageText(makeAnimeText($anime), [
      'parse_mode' => 'HTML',
      'link_preview_options' => $anime->poster
        ? ['show_above_text' => true, 'url' => $anime->poster->originalUrl]
        : ['is_disabled' => true],
      'reply_markup' => inline_keyboard([
        [
          inline_switchInlineCurrent('Скриншоты', "anime-screenshots:$anime->id"),
          inline_switchInlineCurrent('Видео', "anime-videos:$anime->id"),
        ],
        [inline_switchInlineCurrent('Персонажи', "title-characters:anime:$anime->id")],
        [inline_url('Shikimori', $anime->url)],
      ]),
    ]);
  }

  public function mangaSearchChosen(Context $ctx, string $titleId)
  {
    $manga = $this->shiki->manga($titleId);
    if (!$manga) {
      return $this->editInlineMessageText('Что-то пошло не так');
    }

    $ctx->editInlineMessageText(makeMangaText($manga), [
      'parse_mode' => 'HTML',
      'link_preview_options' => $manga->poster
        ? ['show_above_text' => true, 'url' => $manga->poster->originalUrl]
        : ['is_disabled' => true],
      'reply_markup' => inline_keyboard([
        [inline_switchInlineCurrent('Персонажи', "title-characters:manga:$manga->id")],
        [inline_url('Shikimori', $manga->url)],
      ]),
    ]);
  }

  public function animeScreenshotsInline(Context $ctx, string $titleId)
  {
    $offset = (int) $ctx->inlineQuery->offset;

    $screenshots = $this->shiki->screenshots($titleId);
    if (empty($screenshots))
      return $ctx->answerInlineQuery([]);

    $results = [];
    $screenshots = array_slice($screenshots, $offset, MAX_INLINE_RESULTS);
    foreach ($screenshots as $scr) {
      $results[] = [
        'type' => 'photo',
        'id' => "anime-scr:$scr->id",
        'photo_url' => $scr->originalUrl,
        'photo_width' => 1920,
        'photo_height' => 1080,
        'thumbnail_url' => $scr->originalUrl,
      ];
    }

    $ctx->answerInlineQuery($results, [
      'next_offset' => nextOffset(count($results), $offset),
      'cache_time' => INLINE_CACHE_TIME,
    ]);
  }

  public function animeVideosInline(Context $ctx, string $titleId)
  {
    $offset = (int) $ctx->inlineQuery->offset;

    $videos = $this->shiki->videos($titleId);
    if (empty($videos))
      return $ctx->answerInlineQuery([]);

    $getName = fn(string $kind) => [
      'pv' => 'Проморолик',
      'cm' => 'Реклама',
      'op' => 'Опенинг',
      'ed' => 'Эндинг',
      'clip' => 'Клип',
      'op_ed_clip' => 'OP&ED клип',
      'character_trailer' => 'Трейлер персонажа',
      'episode_preview' => 'Превью к эпизоду',
      'other' => 'Другое',
    ][$kind];

    $results = [];
    $videos = array_slice($videos, $offset, MAX_INLINE_RESULTS);
    foreach ($videos as $vid) {
      $name = $getName($vid->kind);
      if ($vid->name)
        $name = "[$name] $vid->name";
      $results[] = [
        'type' => 'video',
        'id' => $vid->id,
        'video_url' => $vid->playerUrl,
        'mime_type' => 'text/html',
        'thumbnail_url' => $vid->imageUrl,
        'title' => $name,
        'input_message_content' => ['message_text' => "$name\n$vid->url"],
      ];
    }

    $ctx->answerInlineQuery($results, [
      'next_offset' => nextOffset(count($results), $offset),
      'cache_time' => INLINE_CACHE_TIME,
    ]);
  }

  public function charactersInline(Context $ctx, string $titleType, string $titleId)
  {
    $offset = (int) $ctx->inlineQuery->offset;

    $chars = $this->shiki->listCharacters($titleType, $titleId);
    if (empty($chars))
      return $ctx->answerInlineQuery([]);

    $results = [];
    $chars = array_slice($chars, $offset, MAX_INLINE_RESULTS);
    foreach ($chars as $char) {
      $name = $char->russian ?? $char->name;
      $desc = $char->russian ? $char->name : null;
      $results[] = [
        'type' => 'article',
        'id' => "title-character:$char->id",
        'title' => $name,
        'description' => $desc,
        'url' => $char->url,
        'thumbnail_url' => $char->poster?->originalUrl,
        'reply_markup' => inline_keyboard([[inline_text('Загрузка...', 'nop')]]),
        'input_message_content' => ['message_text' => $name],
      ];
    }

    $ctx->answerInlineQuery($results, [
      'next_offset' => nextOffset(count($results), $offset),
      'cache_time' => INLINE_CACHE_TIME,
    ]);
  }

  public function characterChosen(Context $ctx, string $charId)
  {
    $char = $this->shiki->character($charId);
    if (!$char)
      return $ctx->editInlineMessageText('Персонаж не найден');

    $ctx->editInlineMessageText(makeCharacterText($char), [
      'parse_mode' => 'HTML',
      'link_preview_options' => $char->poster
        ? ['show_above_text' => true, 'url' => $char->poster->originalUrl]
        : ['is_disabled' => true],
      'reply_markup' => inline_keyboard([
        [inline_url('Shikimori', $char->url)],
      ]),
    ]);
  }

  private function basicsListMenu(array $basics, string $type, int $page, int $fromId): array
  {
    foreach ($basics as $basic) {
      $name = $basic->russian ?? $basic->name;
      if ($basic->isCensored)
        $name = "[18+] $name";
      $menu[] = [inline_text($name, cbd('shikiT', $type, $basic->id, $fromId))];
    }

    $menu[] = [
      inline_text('<< Назад', cbd('shikiQ', $type, $page - 1, $fromId)),
      inline_text("$page", 'nop'),
      inline_text('Вперёд >>', cbd('shikiQ', $type, $page + 1, $fromId)),
    ];

    return inline_keyboard($menu);
  }
}

cbd_init('shikiT', ['type', 'titleId', 'fromId']);
cbd_init('shikiQ', ['type', 'page', 'fromId']);
