<?php

require_once __DIR__ . '/utils/index.php';

class TelegramError extends Exception
{
  public function getDescription(): string
  {
    return $this->getMessage();
  }
}

class Telegram
{
  private string $token;
  private bool $asynced;
  private array $requests;

  public function __construct(string $token)
  {
    $this->token = $token;
    $this->asynced = false;
    $this->requests = [];
  }

  public function __call(string $method, array $params): mixed
  {
    $params = array_deep_compact($params);

    $url = "https://api.telegram.org/bot{$this->token}/$method";

    if (!$this->asynced)
      return $this->sync($url, $params);

    $this->requests[] = [
      $url,
      [
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => myjson_encode($params),
        CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
      ]
    ];
    return null;
  }

  public function multi($fn, bool $suppress = false): mixed
  {
    $this->asynced = true;

    $fn();

    $results = curl_request_multi($this->requests);
    foreach ($results as &$result) {
      $res = myjson_decode($result);
      if (!$suppress && !$res->ok) {
        throw new TelegramError($res->description, $res->error_code);
      }
      $result = $res->result;
    }

    $this->asynced = false;
    $this->requests = [];

    return $results;
  }

  private function sync(string $url, array $params): mixed
  {
    $res = curl_request_json($url, $params);

    if (!$res->ok) {
      throw new TelegramError($res->description, $res->error_code);
    }

    return $res->result;
  }
}