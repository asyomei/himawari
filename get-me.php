<?php

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/telegram.php';

$tg = new Telegram(BOT_TOKEN);

$me = $tg->getMe();
$name = $me->first_name;
if (isset($me->last_name)) {
  $name .= " $me->last_name";
}

echo "I am $name (@$me->username)";