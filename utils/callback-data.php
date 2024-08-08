<?php

function cbd_init(string $ns, array $fields): void
{
  global $cbd_fields;
  $cbd_fields[$ns] = $fields;
}

function cbd_fields(string $ns): array
{
  global $cbd_fields;
  return $cbd_fields[$ns];
}

function cbd(string $ns, ...$values): string
{
  $fields = cbd_fields($ns);

  foreach ($values as $key => $value) {
    if (!is_numeric($key))
      $key = array_search($key, $fields, true);
    $res[$key] = $value;
  }

  $raw = myjson_encode($res);
  return "$ns$raw";
}

function cbd_parse(string $ns, string $raw): mixed
{
  $fields = cbd_fields($ns);

  $cbd = myjson_decode(substr($raw, strpos($raw, '[')));
  foreach ($cbd as $i => $value) {
    $res[$fields[$i]] = $value;
  }

  return (object) $res;
}
