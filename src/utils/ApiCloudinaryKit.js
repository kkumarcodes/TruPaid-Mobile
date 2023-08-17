import axios from 'axios';
import {API_CLOUDINARY_PRODUCT, API_CLOUDINARY_STAGING} from './index';

export const API_ENDPOINT = __DEV__
  ? API_CLOUDINARY_STAGING
  : API_CLOUDINARY_PRODUCT;

const ApiCloudinaryKit = axios.create({
  baseURL: API_ENDPOINT,
  timeout: 30000,
  headers: {
    'Accept': 'application/json',
  },
});

export default ApiCloudinaryKit;
