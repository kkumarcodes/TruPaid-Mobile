import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_ENDPOINT_PRODUCT, API_ENDPOINT_STAGING} from './index';

// export const API_ENDPOINT = __DEV__
//   ? API_ENDPOINT_STAGING
//   : API_ENDPOINT_PRODUCT;

export const API_ENDPOINT = __DEV__
  ? 'https://trupaid-plaid-server.herokuapp.com'
  : 'https://trupaid-plaid-server.herokuapp.com';


const ApiPlaidKit = axios.create({
  baseURL: API_ENDPOINT,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

export default ApiPlaidKit;
