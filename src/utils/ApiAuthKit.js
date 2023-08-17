import axios from 'axios';
import {AUTH_ENDPOINT_PRODUCT, AUTH_ENDPOINT_STAGING} from './index';

export const SERVER_BASE_URL = __DEV__
  ? AUTH_ENDPOINT_STAGING
  : AUTH_ENDPOINT_PRODUCT;

const ApiAuthKit = axios.create({
  baseURL: SERVER_BASE_URL,
  timeout: 30000,
  headers: {'Content-Type': 'application/json'},
});

export default ApiAuthKit;
