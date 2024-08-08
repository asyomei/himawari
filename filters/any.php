<?php

function any(...$filters)
{
  return function (Context $ctx) use ($filters) {
    foreach ($filters as $f) {
      if ($f($ctx))
        return true;
    }
  };
}