/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {
  Image,
  Text,
  View,
} from 'react-native';

import Route from './src/routes';
import { Provider } from 'react-redux';
import Toast from 'react-native-toast-message';
import { store } from './src/redux/store';
import { Theme } from './src/styles/theme';
import { CommonStyle } from './src/styles';
import { ApolloProvider } from '@apollo/client';
import apolloClient from './src/utils/apolloClient';

const toastConfig = {
  toast_custom_type: ({ text1, text2, props, ...rest }) => (
    <View style={{
      flex: 1,
      flexDirection: 'row',
      width: '80%',
      height: 48,
      backgroundColor: Theme.primary,
      paddingHorizontal: 10,
      borderTopLeftRadius: 16,
      borderBottomRightRadius: 16,
      alignItems: 'center',
      borderColor: Theme.white,
      borderWidth: 0.9,
    }}>
      <View style={[CommonStyle.row_bw, { alignSelf: 'flex-start' }]}>
        <View style={{
          marginTop: 8,
          width: 26,
          height: 26,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <Image source={Theme.logo} style={{ width: 26, height: 26, resizeMode: 'cover' }} />
        </View>
      </View>

      <View style={{ flex: 1 }}>
        <Text style={[CommonStyle.text12_inter_m, { color: Theme.white, textAlign: 'center' }]}
          numberOfLines={2}>{text2}</Text>
      </View>
    </View>
  ),
};

function App(): JSX.Element {
  return (
    <Provider store={store}>
      <ApolloProvider client={apolloClient}>
        <Route />
      </ApolloProvider>
      <Toast config={toastConfig} />
    </Provider>
  );
}

export default App;
