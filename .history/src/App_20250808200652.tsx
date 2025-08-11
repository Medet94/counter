import axios from 'axios';
import {
  baseURL,
  connection,
  connectionSearch,
  connectorTypes,
  connectionById,
} from './url';

export const App = () => {
  fetch(`${baseURL}${connectorTypes}`)
    .then((res) => res.json())
    .then((data) => console.log('This is the data', data));

  return <></>;
};
