import React, { useEffect } from 'react';
import { View, StyleSheet, StatusBar, Text, BackHandler } from 'react-native';
import { useDispatch } from 'react-redux';
import { loadHome, loadSignUp, updateUserInfo } from '../../redux/actions/auth';
import { Theme } from '../../styles/theme';
import { setApiLoading } from '../../redux/actions/config';
import ApiFlowKit from '../../utils/ApiFlowKit';
import ApiAuthKit from '../../utils/ApiAuthKit';
import { setGraphqlToken } from '../../utils/ApiGraphqlKit';
import { setApiTruPaidToken } from '../../utils/ApiTruPaidKit';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SplashScreen = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    console.log('splash screen')
    signIn();
  }, []);

  const signIn = async () => {
    try {
      const email = await AsyncStorage.getItem('@trupaid_email');
      const password = await AsyncStorage.getItem('@trupaid_password');

      if (!email || !password) {
        gotoLogin();
      } else {
        // dispatch(setApiLoading(true));
        getFlowIdForLogin().then(async res => {
          const actionId = res?.data?.id;
          if (actionId) {
            requestLogin(actionId, email, password);
          } else {
            dispatch(setApiLoading(false));
            console.log('trupaid login 2 error:', res);
            Toast.show({
              type: 'toast_custom_type',
              text1: '',
              text2: 'Network error!',
              visibilityTime: 3000,
            });
            setTimeout(() => {
              BackHandler.exitApp();
            }, 4000);
          }
        }).catch(error => {
          console.log('trupaid login 2 error:', error);
          dispatch(setApiLoading(false));
          gotoLogin();
        });
      }
    } catch (e) {
      console.log(e);
      dispatch(setApiLoading(false));
      gotoLogin();
    }
  };

  const getFlowIdForLogin = async () => {

    return new Promise(async (resolve) => {
      ApiFlowKit.get('/login/api').then(res => {
        resolve(res);
      }).catch(error => {
        console.log('trupaid login 1 error:', error);
        resolve(null);
      });
    });
  };

  const requestLogin = (actionId, email, password) => {
    const body = {
      'csrf_token': '',
      'method': 'password',
      'password': password,
      'password_identifier': email,
    };

    // dispatch(setApiLoading(true));
    const params = 'login?flow=' + actionId;
    ApiAuthKit.post(params, body).then(async res => {
      dispatch(setApiLoading(false));

      console.log('trupaid login success: session token: ', res?.data?.session_token);

      await setGraphqlToken(res?.data?.session_token);
      await setApiTruPaidToken(res?.data?.session_token);
      dispatch(updateUserInfo(res?.data));
      gotoHome();

    }).catch(error => {
      dispatch(setApiLoading(false));
      console.log('trupaid login 3 error:', error?.response?.data);
      const errors = error?.response?.data?.errors;
      if (Array.isArray(errors) && errors?.length > 0) {
        gotoLogin();
      }
    });
  };

  const gotoLogin = () => {
    setTimeout(() => {
      dispatch(loadSignUp());
    }, 3000);
  };

  const gotoHome = () => {
    setTimeout(() => {
      dispatch(loadHome());
    }, 100);
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden={true} translucent={true} backgroundColor={'transparent'} />

      <View style={styles.body}>
        <Text style={styles.textLogo}>
          TruPaid
        </Text>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Theme.white,
  },
  textLogo: {
    fontSize: 38,
    fontFamily: 'TestPitchSans-Bold',
    lineHeight: 47,
    color: Theme.black,
  },
});

export default SplashScreen;
