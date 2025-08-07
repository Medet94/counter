import { baseURL, connection, connectionSearch } from './url';

export const App = () => {
  fetch(`${baseURL}${connectionSearch}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name: 'Test', age: 30 }),
  })
    .then((res) => res.json())
    .then((data) => console.log(data));

  fetch(`${baseURL}${connection}`).then((data) =>
    console.log('This is a Data', data)
  );

  return <></>;
};
