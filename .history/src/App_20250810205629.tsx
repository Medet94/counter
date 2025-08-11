import axios from 'axios';
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
  // fetch(`${baseURL}${connectorTypes}`)
  //   .then((res) => res.json())
  //   .then((data) => console.log('This is the data', data));

  return (
    <>
      <Button size="md">Click</Button>
    </>
  );
};
