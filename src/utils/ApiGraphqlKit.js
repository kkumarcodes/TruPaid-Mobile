import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {GRAPHQL_ENDPOINT_STAGING, GRAPHQL_ENDPOINT_PRODUCT} from './index';
import {GraphQLClient} from 'graphql-request';

export const GRAPHQL_ENDPOINT = __DEV__
  ? GRAPHQL_ENDPOINT_STAGING
  : GRAPHQL_ENDPOINT_PRODUCT;

const ApiGraphqlKit = axios.create({
  baseURL: GRAPHQL_ENDPOINT,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Cookie': 'x-session-token=readAuthorization',
  },
});

export const setGraphqlToken = token => {
  return new Promise(async (resolve) => {
    if (token) {
      ApiGraphqlKit.defaults.headers.Authorization = 'Bearer ' + token;
      try {
        await AsyncStorage.setItem('@trupaid_token', token);
      } catch (e) {
      }
      resolve();
    } else {
      delete ApiGraphqlKit.defaults.headers.Authorization;
      try {
        await AsyncStorage.removeItem('@trupaid_token');
      } catch (e) {
      }
      resolve();
    }
  });
};

export function graphQLRequest(token, query, variables) {
  let headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Cookie': 'x-session-token=readAuthorization',
  };
  if (token) {
    headers = {
      ...headers,
      Authorization: 'Bearer ' + token,
    };
  }
  const graphQLClient = new GraphQLClient(
    GRAPHQL_ENDPOINT,
    {
      headers,
    });

  return graphQLClient.request(query, variables);
}

export async function getHeader() {
  let headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Cookie': 'x-session-token=readAuthorization',
  };

  const token = await AsyncStorage.setItem('@trupaid_token');

  if (token) {
    headers = {
      ...headers,
      Authorization: 'Bearer ' + token,
    };
  }

  return headers;
}

export default ApiGraphqlKit;
