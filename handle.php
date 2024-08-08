<?php

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/consts.php';
define('__SRC__', __DIR__);

$token = $_SERVER['HTTP_X_TELEGRAM_BOT_API_SECRET_TOKEN'];
if ($token !== SECRET_TOKEN) {
  echo 'Invalid secret token!';
  return;
}

$data = file_get_contents('php://input');
if (!$data) {
  echo 'Empty input!';
  return;
}

require_once __DIR__ . '/utils/index.php';

try {
  $update = myjson_decode($data);
} catch (JsonException $e) {
  log_error($e);
  return;
}

require_once __DIR__ . '/telegram.php';
require_once __DIR__ . '/context/index.php';

$tg = new Telegram(BOT_TOKEN);
$ctx = new Context($tg, $update);

try {
  require_once __DIR__ . '/handlers/index.php';
  handle($ctx);
} catch (Throwable $e) {
  log_error($e);
}