import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_ENDPOINT_PRODUCT, API_ENDPOINT_STAGING} from './index';

export const API_ENDPOINT = __DEV__
  ? API_ENDPOINT_STAGING
  : API_ENDPOINT_PRODUCT;

const ApiTruPaidKit = axios.create({
  baseURL: API_ENDPOINT,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Cookie': 'x-session-token=readAuthorization',
  },
});

export const setApiTruPaidToken = token => {
  return new Promise(async (resolve) => {
    if (token) {
      ApiTruPaidKit.defaults.headers.Authorization = 'Bearer ' + token;
      try {
        await AsyncStorage.setItem('@trupaid_token', token);
      } catch (e) {
      }
      resolve();
    } else {
      delete ApiTruPaidKit.defaults.headers.Authorization;
      try {
        await AsyncStorage.removeItem('@trupaid_token');
      } catch (e) {
      }
      resolve();
    }
  });
};

export default ApiTruPaidKit;
