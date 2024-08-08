<?php

class AnimalPicHandler
{
  public function handle(Context $ctx)
  {
    if (himawari('cat', 'meow', 'кот', 'кошка', 'мяу')($ctx))
      return $this->onCommand($ctx, 'cat');
    if (himawari('dog', 'woof', 'пес', 'собака', 'гав')($ctx))
      return $this->onCommand($ctx, 'dog');
    if (himawari('fox', 'лис', 'лиса')($ctx))
      return $this->onCommand($ctx, 'fox');
    if (himawari('fish', 'рыба', 'рыбка')($ctx))
      return $this->onCommand($ctx, 'fish');
    if (himawari('alpaca', 'альпака')($ctx))
      return $this->onCommand($ctx, 'alpaca');
    if (himawari('bird', 'птица', 'птичка')($ctx))
      return $this->onCommand($ctx, 'bird');

    return 'next';
  }

  public function onCommand(Context $ctx, string $type)
  {
    $ctx->replyWithPhoto($this->getUrl($type));
  }

  private function getUrl(string $type): string
  {
    // "cat", "dog", "fox", "fish", "alpaca", "bird"
    $res = curl_request("https://api.sefinek.net/api/v2/random/animal/$type");
    return myjson_decode($res)->message;
  }
}
