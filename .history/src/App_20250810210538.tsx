import axios from 'axios';
import { useState } from 'react';
import {
  baseURL,
  connection,
  connectionSearch,
  connectorTypes,
  connectionById,
} from './url';
import { Button } from '@mantine/core';

import { createStore } from 'effector';

export const $counter = createStore(2);

$counter.watch((state) => {
  console.log('Counter changed:', state);
});

export const App = () => {
  const [count, setCount] = useState(0);
  // fetch(`${baseURL}${connectorTypes}`)
  //   .then((res) => res.json())
  //   .then((data) => console.log('This is the data', data));

  console.log(count);

  const handleClick = () => {
    setCount((n) => n + 1);
  };

  return (
    <>
      <Button size="md" onClick={handleClick}>
        Click
      </Button>
    </>
  );
};
