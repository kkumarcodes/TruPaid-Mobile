import AsyncStorage from '@react-native-async-storage/async-storage';
import {GRAPHQL_ENDPOINT_STAGING, GRAPHQL_ENDPOINT_PRODUCT} from './index';
import {ApolloClient, createHttpLink, InMemoryCache, ApolloLink, concat} from '@apollo/client';

export const GRAPHQL_ENDPOINT = __DEV__
  ? GRAPHQL_ENDPOINT_STAGING
  : GRAPHQL_ENDPOINT_PRODUCT;


const cache = new InMemoryCache({
  typePolicies: {
    ProfileImage: {
      fields: {
        cloudinaryData: {
          merge(existing, incoming) {
            // Equivalent to what happens if there is no custom merge function.
            return incoming;
          },
        },
      },
    },
    PostImage: {
      fields: {
        cloudinaryData: {
          merge(existing, incoming) {
            // Equivalent to what happens if there is no custom merge function.
            return incoming;
          },
        },
      },
    },
    UserProfile: {
      fields: {
        followers: {
          merge(existing, incoming) {
            // Equivalent to what happens if there is no custom merge function.
            return incoming;
          },
        },
      },
    },
  },
});

const httpLink = createHttpLink({
  uri: GRAPHQL_ENDPOINT,
});

const authMiddleware = new ApolloLink(async (operation, forward) => {
  // add the authorization to the headers
  const token = await AsyncStorage.getItem('@trupaid_token');
  operation.setContext(({headers = {}}) => ({
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Cookie': 'x-session-token=readAuthorization',
    },
  }));

  return forward(operation);
});

const apolloClient = new ApolloClient({
  uri: GRAPHQL_ENDPOINT,
  cache,
  credentials: 'include',
  defaultOptions: {watchQuery: {fetchPolicy: 'cache-and-network'}},
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Cookie': 'x-session-token=readAuthorization',
  },
  link: concat(authMiddleware, httpLink),
});

export default apolloClient;
