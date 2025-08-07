import { baseURL, connection, connectionSearch } from './url';

export const App = () => {
  fetch(`${baseURL}${connectionSearch}`)
    .then((res) => res.json())
    .then((data) => console.log(data));

  fetch(`${baseURL}${connection}`).then((data) =>
    console.log('This is a Data', data)
  );

  return <></>;
};
