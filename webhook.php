<?php

require_once __DIR__ . '/config.php';

$token = $_GET['secret'] ?? null;
if ($token !== SECRET_TOKEN) {
  echo 'Invalid secret token!';
  return;
}

require_once __DIR__ . '/telegram.php';
$tg = new Telegram(BOT_TOKEN);
$name = $tg->getMe()->username;

$mode = $_GET['mode'] ?? null;
switch ($mode) {
  case 'set':
    $url = "https://$_SERVER[HTTP_HOST]";
    $url .= dirname($_SERVER['REQUEST_URI']);
    $url .= '/handle.php';

    $allowed[] = 'message';
    $allowed[] = 'callback_query';
    $allowed[] = 'inline_query';
    $allowed[] = 'chosen_inline_result';

    $tg->setWebhook(
      url: $url,
      allowed_updates: $allowed,
      secret_token: SECRET_TOKEN
    );
    echo "Webhook for @$name is setted to $url";
    break;
  case 'delete':
    $tg->deleteWebhook();
    echo "Webhook for @$name is deleted";
    break;
  default:
    echo 'I don\'t know what do';
}