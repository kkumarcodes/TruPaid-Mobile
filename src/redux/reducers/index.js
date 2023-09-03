import { combineReducers } from 'redux';
import { auth } from './auth';
import { app } from './app';
import { configReducer } from './config';
import { plaidReducer } from './plaid';
import { aptoReducer } from './apto';

export default combineReducers({
  auth: auth,
  app: app,
  config: configReducer,
  plaid: plaidReducer,
  apto: aptoReducer,
});
