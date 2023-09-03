import { createStore, applyMiddleware, compose } from 'redux';

import reducers from './reducers';
import middlewares from './middlewares';

const composeEnhancers =
  typeof window === 'object' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
    }) : compose;

const enhancer = composeEnhancers(
  applyMiddleware(...middlewares),
  // other store enhancers if any
);
const store = createStore(
  reducers,
  enhancer
);
// const persistor = persistStore(store);

// export {store, persistor};
export { store };

