import axios from 'axios';
import {
  FLOW_ENDPOINT_PRODUCT,
  FLOW_ENDPOINT_STAGING,
} from './index';

export const SERVER_BASE_URL = __DEV__
  ? FLOW_ENDPOINT_STAGING
  : FLOW_ENDPOINT_PRODUCT;

const ApiFlowKit = axios.create({
  baseURL: SERVER_BASE_URL,
  timeout: 30000,
  headers: {'Content-Type': 'application/json'},
});

export default ApiFlowKit;
