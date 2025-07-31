import { useReducer } from 'react';

enum Types {
  inc = 'increment',
  dec = 'decrement',
}

const initialState = { count: 0 };

function reducer(state: any, action: any) {
  switch (action.type) {
    case 'increment': {
      return {
        ...state,
        count: state.count + 1,
      };
    }
    case 'decrement':
      return {
        ...state,
        count: state.count - 1,
      };

    default:
      break;
  }
}

export const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <div className="App">
      Count: {state.count}
      <button onClick={() => dispatch({ type: Types.dec })}>-</button>
      <button onClick={() => dispatch({ type: Types.inc })}>+</button>
    </div>
  );
};
