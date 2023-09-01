import { createStore } from 'redux'
import { devToolsEnhancer } from 'redux-devtools-extension'


import reducers from './reducers';

const store = createStore(
  reducers,
  /* preloadedState, */ devToolsEnhancer({})
)

export { store };

