import React, {useReducer} from 'react';

/**
Helper to easily create new Contexts.
- reducer: the reducer containing the actions that modify the state.
- actions: helper functions to dispatch actions.
- defaultValue: the default state
*/
export default (reducer, actions, defaultValue) => {
  const Context = React.createContext();

  const Provider = ({children}) => {
    const [state, dispatch] = useReducer(reducer, defaultValue);

    const boundActions = {};
    for (let key in actions) {
      boundActions[key] = actions[key](dispatch);
    }

    return (
      <Context.Provider value={{state, ...boundActions}}>
        {children}
      </Context.Provider>
    );
  };

  return {Context, Provider};
};
