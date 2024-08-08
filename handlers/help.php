<?php

class HelpHandler
{
  public function handle(Context $ctx)
  {
    $f = any(
      command('start', 'help'),
      himawari('start', 'help', 'старт', 'помощь'),
    );
    if ($f($ctx))
      return $this->onHelpCommand($ctx);

    return 'next';
  }

  public function onHelpCommand(Context $ctx)
  {
    $me = $ctx->getMe();
    $text = <<<EOF
    Команды (химавари <команда>):
    - аниме [название] - поиск аниме
    - манга [название] - поиск манги
    - чат [сообщение] - общение с GPT-4
    - сброс, очистка - очистка контекста чата
    - кошка, собака, лиса, рыбка, альпака, птичка - картинка животного
    - anime-pic - аниме картинка/гифка

    Инлайн-режим (@$me->username <команда>):
    - аниме [название] - поиск аниме
    - манга [название] - поиск манги
    EOF;

    $ctx->reply($text);
  }
}