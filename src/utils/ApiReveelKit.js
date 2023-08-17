import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_ENDPOINT_PRODUCT, API_ENDPOINT_STAGING} from './index';

export const API_ENDPOINT = __DEV__
  ? API_ENDPOINT_STAGING
  : API_ENDPOINT_PRODUCT;

const ApiReveelKit = axios.create({
  baseURL: API_ENDPOINT,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Cookie': 'x-session-token=readAuthorization',
  },
});

export const setApiReveelToken = token => {
  return new Promise(async (resolve) => {
    if (token) {
      ApiReveelKit.defaults.headers.Authorization = 'Bearer ' + token;
      try {
        await AsyncStorage.setItem('@trupaid_token', token);
      } catch (e) {
      }
      resolve();
    } else {
      delete ApiReveelKit.defaults.headers.Authorization;
      try {
        await AsyncStorage.removeItem('@trupaid_token');
      } catch (e) {
      }
      resolve();
    }
  });
};

export default ApiReveelKit;
