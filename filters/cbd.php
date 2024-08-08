<?php

function cbd_filter(string $ns, ...$values)
{
  return function (Context $ctx) use ($ns, $values) {
    $data = $ctx->callbackQuery?->data;
    if (!$data)
      return false;

    $index = strpos($data, '[');
    $data_ns = substr($data, 0, $index);
    if ($data_ns !== $ns)
      return false;

    $data = cbd_parse($ns, $data);
    if (isset($data->fromId) && $ctx->from()?->id !== $data->fromId) {
      $ctx->answerCallbackQuery('Эта кнопка не для вас');
      return false;
    }


    if (empty($values)) {
      $ctx->match = $data;
      return true;
    }

    $fields = cbd_fields($ns);
    foreach ($values as $key => $value) {
      if (is_numeric($key))
        $key = $fields[$key];
      if ($data->{$key} !== $value)
        return false;
    }

    $ctx->match = $data;
    return true;
  };
}