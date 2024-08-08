<?php

require_once __SRC__ . '/filters/index.php';
require_once __DIR__ . '/help.php';
require_once __DIR__ . '/privacy.php';
require_once __DIR__ . '/chat/index.php';
require_once __DIR__ . '/animal-pic.php';
require_once __DIR__ . '/anime-pic.php';
require_once __DIR__ . '/shikimori/index.php';
require_once __DIR__ . '/unhandled.php';

$handlers = [
  new HelpHandler(),
  new PrivacyHandler(),
  new ChatHandler(new ChatService()),
  new AnimalPicHandler(),
  new AnimePicHandler(),
  new ShikimoriHandler(new ShikimoriService()),
];

function handle(Context $ctx)
{
  global $handlers;

  foreach ($handlers as $handler) {
    $res = $handler->handle($ctx);

    if ($res !== 'next')
      return true;
  }

  onUnhandledUpdate($ctx);
  return false;
}