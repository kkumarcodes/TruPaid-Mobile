/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import type { PropsWithChildren } from 'react';
import {
  SafeAreaView,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import Route from './src/routes';
import { Provider } from 'react-redux';
import Toast from 'react-native-toast-message';
import { store } from './src/redux';
import { Theme } from './src/styles/theme';
import { CommonStyle } from './src/styles';
import { ApolloProvider } from '@apollo/client';
import apolloClient from './src/utils/apolloClient';


type SectionProps = PropsWithChildren<{
  title: string;
}>;

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
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <Provider store={store}>
        <ApolloProvider client={apolloClient}>
          <Route />
        </ApolloProvider>
        <Toast config={toastConfig} ref={(ref) => Toast.setRef(ref)} />
      </Provider>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
