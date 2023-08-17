import {createStore, applyMiddleware} from 'redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {persistStore, persistReducer} from 'redux-persist';

import reducers from './reducers';
import middlewares from './middlewares';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  blacklist: [],
};

const pReducer = persistReducer(persistConfig, reducers);

const store = createStore(pReducer, applyMiddleware(...middlewares));

// const persistor = persistStore(store);

// export {store, persistor};
export {store};

