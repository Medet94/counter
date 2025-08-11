import axios from 'axios';
import { baseURL, connection, connectionSearch, connectorTypes } from './url';

export const App = () => {
  // fetch(`${baseURL}${connection}`, {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     Accept: 'text/plain',
  //   },
  //   body: JSON.stringify({
  //     name: 'My Test Connection',
  //     description: 'Created from frontend',
  //     type: 'MySQL',
  //     projectId: 'project_123',
  //     folderId: 'folder_123',
  //     rid: 'rid_123',
  //     createdBy: 'user_123',
  //     config: {
  //       additionalProp1: 'value1',
  //       additionalProp2: 'value2',
  //       additionalProp3: 'value3',
  //     },
  //   }),
  // })
  //   .then((res) => {
  //     if (!res.ok) {
  //       throw new Error(`Server error ${res.status}`);
  //     }
  //     return res.json();
  //   })
  //   .then((data) => {
  //     console.log('✅ Connection created:', data);
  //   })
  //   .catch((err) => {
  //     console.error('❌ Error:', err);
  //   });

  fetch(
    'https://phoenix-dev.datamicron.com/api/data-loader-bff/api/v1/Connection/search'
  )
    .then((res) => res.json())
    .then((data) => console.log(data));

  return <></>;
};
