<?php

function onUnhandledUpdate(Context $ctx)
{
  if ($ctx->callbackQuery?->data) {
    $ctx->answerCallbackQuery();

    $data = $ctx->callbackQuery->data;
    if ($data !== 'nop') {
      log_info("Callback query with data '$data' wasn't handled");
    }
  } elseif ($ctx->chosenInlineResult) {
    $id = $ctx->chosenInlineResult->result_id;
    log_info("Chosen inline result with id '$id' wasn't handled");
  }
}