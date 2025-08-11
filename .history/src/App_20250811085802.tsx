import axios from 'axios';
import { useState } from 'react';
import { Button } from '@mantine/core';

import { createStore } from 'effector';

export const $counter = createStore(2);

$counter.watch((state) => {
  console.log('Counter changed:', state);
});

export const App = () => {
  const [count, setCount] = useState(0);

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
