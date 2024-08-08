<?php

class AnimePicHandler
{
  public function handle(Context $ctx)
  {
    if (himawari('kitsune', 'кицуне', 'кицунэ', 'anime-fox', 'аниме-лиса')($ctx))
      return $this->sendPic($ctx, 'kitsune');
    if (himawari('neko', 'неко', 'нэко', 'anime-cat', 'аниме-кошка')($ctx))
      return $this->sendPic($ctx, 'neko');
    if (himawari('waifu', 'вайфу')($ctx))
      return $this->sendPic($ctx, 'waifu');

    if (himawari('baka', 'бака')($ctx))
      return $this->sendGif($ctx, 'baka');
    if (himawari('bite', 'кусь')($ctx))
      return $this->sendGif($ctx, 'bite');
    if (himawari('blush', 'смущение')($ctx))
      return $this->sendGif($ctx, 'blush');
    if (himawari('bored', 'скука')($ctx))
      return $this->sendGif($ctx, 'bored');
    if (himawari('cry', 'плак')($ctx))
      return $this->sendGif($ctx, 'cry');
    if (himawari('cuddle', 'тереться')($ctx))
      return $this->sendGif($ctx, 'cuddle');
    if (himawari('dance', 'танцы')($ctx))
      return $this->sendGif($ctx, 'dance');
    if (himawari('facepalm', 'рукалицо')($ctx))
      return $this->sendGif($ctx, 'facepalm');
    if (himawari('feed', 'кормить')($ctx))
      return $this->sendGif($ctx, 'feed');
    if (himawari('handhold', 'держаться-за-руки')($ctx))
      return $this->sendGif($ctx, 'handhold');
    if (himawari('handshake', 'рукопожатие')($ctx))
      return $this->sendGif($ctx, 'handshake');
    if (himawari('happy', 'ureshii', 'счастье', 'радость')($ctx))
      return $this->sendGif($ctx, 'happy');
    if (himawari('highfive', 'дай-пять')($ctx))
      return $this->sendGif($ctx, 'highfive');
    if (himawari('hug', 'обнимашки')($ctx))
      return $this->sendGif($ctx, 'hug');
    if (himawari('kick', 'пинок')($ctx))
      return $this->sendGif($ctx, 'kick');
    if (himawari('kiss', 'поцелуй')($ctx))
      return $this->sendGif($ctx, 'kiss');
    if (himawari('laugh', 'смех')($ctx))
      return $this->sendGif($ctx, 'laugh');
    if (himawari('lurk', 'затаиться')($ctx))
      return $this->sendGif($ctx, 'lurk');
    if (himawari('nod', 'кивок')($ctx))
      return $this->sendGif($ctx, 'nod');
    if (himawari('nom', 'ом', 'ном')($ctx))
      return $this->sendGif($ctx, 'nom');
    if (himawari('nope', 'неа')($ctx))
      return $this->sendGif($ctx, 'nope');
    if (himawari('pat', 'гладить')($ctx))
      return $this->sendGif($ctx, 'pat');
    if (himawari('peck', 'щечка', 'щёчка')($ctx))
      return $this->sendGif($ctx, 'peck');
    if (himawari('poke', 'тык')($ctx))
      return $this->sendGif($ctx, 'poke');
    if (himawari('punch', 'удар')($ctx))
      return $this->sendGif($ctx, 'punch');
    if (himawari('shoot', 'стрелять')($ctx))
      return $this->sendGif($ctx, 'shoot');
    if (himawari('shrug', 'хз')($ctx))
      return $this->sendGif($ctx, 'shrug');
    if (himawari('slap', 'пощечина', 'пощёчина')($ctx))
      return $this->sendGif($ctx, 'slap');
    if (himawari('sleep', 'споки', 'спать')($ctx))
      return $this->sendGif($ctx, 'sleep');
    if (himawari('smile', 'улыбка')($ctx))
      return $this->sendGif($ctx, 'smile');
    if (himawari('smug', 'ухмылка')($ctx))
      return $this->sendGif($ctx, 'smug');
    if (himawari('stare', 'пристально')($ctx))
      return $this->sendGif($ctx, 'stare');
    if (himawari('think', 'думать')($ctx))
      return $this->sendGif($ctx, 'think');
    if (himawari('thumbsup', 'лайк')($ctx))
      return $this->sendGif($ctx, 'thumbsup');
    if (himawari('tickle', 'щекотать', 'щекотка')($ctx))
      return $this->sendGif($ctx, 'tickle');
    if (himawari('wave', 'махать')($ctx))
      return $this->sendGif($ctx, 'wave');
    if (himawari('wink', 'подмигивание')($ctx))
      return $this->sendGif($ctx, 'wink');
    if (himawari('yawn', 'зевок', 'зевать')($ctx))
      return $this->sendGif($ctx, 'yawn');
    if (himawari('yeet', 'бросок')($ctx))
      return $this->sendGif($ctx, 'yeet');

    if (himawari('anime-pic')($ctx))
      return $this->onHelpCommand($ctx);

    return 'next';
  }

  public function sendPic(Context $ctx, string $type)
  {
    $pic = $this->request($type);
    $ctx->replyWithPhoto($pic->url, ['caption' => $pic->source_url]);
  }

  public function sendGif(Context $ctx, string $type)
  {
    $gif = $this->request($type);
    $ctx->replyWithAnimation($gif->url, [
      'reply_parameter' => makeReply($ctx->message->reply_to_message),
      'reply_markup' => inline_keyboard([
        [inline_switchInlineCurrent($gif->anime_name, "anime $gif->anime_name")]
      ])
    ]);
  }

  public function onHelpCommand(Context $ctx)
  {
    $names = [
      'kitsune',
      'neko',
      'waifu',
      'baka',
      'bite',
      'blush',
      'bored',
      'cry',
      'cuddle',
      'dance',
      'facepalm',
      'feed',
      'handhold',
      'handshake',
      'happy',
      'highfive',
      'hug',
      'kick',
      'kiss',
      'laugh',
      'lurk',
      'nod',
      'nom',
      'nope',
      'pat',
      'peck',
      'poke',
      'pout',
      'punch',
      'shoot',
      'shrug',
      'slap',
      'sleep',
      'smile',
      'smug',
      'stare',
      'think',
      'thumbsup',
      'tickle',
      'wave',
      'wink',
      'yawn',
      'yeet'
    ];
    $names = implode(', ', $names);
    $text = <<<EOF
    <b>Доступные картинки (химавари &lt;команда&gt;):</b>
    $names
    EOF;

    $ctx->reply($text, ['parse_mode' => 'HTML']);
  }

  private function request(string $type)
  {
    $res = curl_request("https://nekos.best/api/v2/$type");
    return myjson_decode($res)->results[0];
  }
}