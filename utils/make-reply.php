<?php

function makeReply(mixed $msgId): mixed
{
  if (!$msgId)
    return null;

  if (is_object($msgId))
    $msgId = $msgId->message_id;

  return [
    'message_id' => $msgId,
    'allow_sending_without_reply' => true
  ];
}