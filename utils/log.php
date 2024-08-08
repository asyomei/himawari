<?php

function log_error(Throwable $e)
{
  $date = new DateTime('now', new DateTimeZone('UTC'));

  $text = <<<EOF
  ---------------
  on {$date->format('d.m.Y H:i:s.v')} (UTC)
  
  $e
  
  
  EOF;
  mkdir('logs', 0777, true);
  file_put_contents('logs/errors.log', $text, FILE_APPEND);
}

function log_info(string $msg)
{
  $date = new DateTime('now', new DateTimeZone('UTC'));

  $text = <<<EOF
  ---------------
  on {$date->format('d.m.Y H:i:s.v')} (UTC)
  
  $msg
  
  
  EOF;
  mkdir('logs', 0777, true);
  file_put_contents('logs/out.log', $text, FILE_APPEND);
}

function log_var(mixed $value)
{
  log_info(myjson_encode($value, true));
}