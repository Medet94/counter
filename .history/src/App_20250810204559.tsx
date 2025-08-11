import axios from 'axios';
import {
  baseURL,
  connection,
  connectionSearch,
  connectorTypes,
  connectionById,
} from './url';

import { createStore } from 'effector';

export const $counter = createStore(0);

$counter.watch((state) => {
  console.log('Counter changed:', state);
});

export const App = () => {
  fetch(`${baseURL}${connectorTypes}`)
    .then((res) => res.json())
    .then((data) => console.log('This is the data', data));

  return <></>;
};
