<?php

class GraphQLError extends Exception
{
}

function curl_request(string $url, array $params = []): string
{
  $ch = curl_init($url);

  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
  curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36');
  foreach ($params as $opt => $value) {
    curl_setopt($ch, $opt, $value);
  }

  try {
    $res = curl_exec($ch);
  } finally {
    curl_close($ch);
  }

  return $res;
}

function curl_request_json(string $url, mixed $value, array $params = [], bool $parse = true): mixed
{
  $res = curl_request($url, [
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => json_encode($value),
    CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
    ...$params
  ]);

  return $parse ? myjson_decode($res) : $res;
}

function curl_request_gql(string $url, string $query, array $variables = [], array $params = []): mixed
{
  $res = curl_request_json($url, [
    'query' => $query,
    'variables' => array_filter($variables),
  ], $params);

  if (!empty($res->errors)) {
    $msg = $res->errors[0]->message;
    $loc = $res->errors[0]->locations[0];
    $loc = "$loc->line:$loc->column";
    $path = implode('.', $res->errors[0]->path);
    throw new GraphQLError("$msg (on $path, $loc)");
  }

  return $res->data;
}

function curl_request_multi(array $requests): array
{
  foreach ($requests as [$url, $params]) {
    $ch = curl_init($url);

    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    foreach ($params as $opt => $value) {
      curl_setopt($ch, $opt, $value);
    }

    $chs[] = $ch;
  }

  $mh = curl_multi_init();
  foreach ($chs as $ch)
    curl_multi_add_handle($mh, $ch);

  do {
    curl_multi_exec($mh, $active);
    curl_multi_select($mh);
  } while ($active);

  try {
    foreach ($chs as $ch)
      $results[] = curl_multi_getcontent($ch);

    return $results;
  } finally {
    foreach ($chs as $ch) {
      curl_multi_remove_handle($mh, $ch);
      curl_close($ch);
    }

    curl_multi_close($mh);
  }
}
