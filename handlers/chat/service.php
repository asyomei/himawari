<?php

class ChatService
{
  public function chat(string $id, string $msg): string
  {
    $history = $this->load($id) ?? [];

    $res = curl_request_json('https://nexra.aryahcr.cc/api/chat/gpt', [
      'model' => 'gpt-4',
      'messages' => $history,
      'prompt' => $msg,
      'markdown' => false,
    ], [], false);
    $res = myjson_decode(trim($res, '_'));

    $history[] = ['role' => 'user', 'content' => $msg];
    $history[] = ['role' => 'assistant', 'content' => $res->original ?? $res->gpt];
    $this->save($id, $history);

    return $res->gpt;
  }

  public function clear(string $id): void
  {
    unlink("data/chat/$id.json");
  }

  private function load(string $id): ?array
  {
    $data = file_get_contents("data/chat/$id.json");
    if ($data === false)
      return null;

    foreach (myjson_decode($data) as [$role, $msg]) {
      $res[] = ['role' => $role, 'content' => $msg];
    }

    return $res;
  }

  private function save(string $id, array $history): void
  {
    foreach ($history as ['role' => $role, 'content' => $msg]) {
      $raw[] = [$role, $msg];
    }

    mkdir('data/chat', 0777, true);
    file_put_contents("data/chat/$id.json", myjson_encode($raw));
  }
}