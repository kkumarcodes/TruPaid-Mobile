import React, { useEffect, useState } from 'react';
import { View, StyleSheet, StatusBar, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useDispatch } from 'react-redux';
import { Theme } from '../../../styles/theme';
import { PADDING_HOR, WINDOW_HEIGHT, WINDOW_WIDTH } from '../../../styles/constant';
import { CommonStyle } from '../../../styles';
import MainButton from '../../../components/main-button';
import { navigation } from '../../../routes/navigation';
import { KeyboardAvoidingView } from 'react-native';
import { Platform } from 'react-native';
import { validateEmail, validatePassword } from '../../../styles/global';
import { setApiLoading } from '../../../redux/actions/config';
import ApiFlowKit from '../../../utils/ApiFlowKit';
import ApiAuthKit from '../../../utils/ApiAuthKit';
import Toast from 'react-native-toast-message';
import { setGraphqlToken } from '../../../utils/ApiGraphqlKit';
import { loadHome, updateUserInfo } from '../../../redux/actions/auth';
import InputCardBox from '../../../components/input-card-box';
import InputTextCard from '../../../components/input-text-card';
import { setApiTruPaidToken } from '../../../utils/ApiTruPaidKit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import analytics from '@react-native-firebase/analytics';

const LoginScreen = (props) => {
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isValid, setValid] = useState(false);
  const [isPassword, setIsPassword] = useState(true);
  const [icEye, setIcEye] = useState(Theme.icon_eye_on);

  useEffect(() => {
    console.log('==login screen')
  }, []);

  useEffect(() => {
    setValid(
      validateEmail(email) &&
      password?.trim()?.length > 1,
      // validatePassword(password)
    );
  }, [email, password]);

  const changePwdType = (text) => {
    if (!isPassword) {
      setIcEye(Theme.icon_eye_on);
    } else {
      setIcEye(Theme.icon_eye_off);
    }
    setIsPassword(!isPassword);
  };

  const onPressNext = () => {

    dispatch(setApiLoading(true));
    // get initial data for registration
    getFlowIdForLogin().then(async res => {
      const actionId = res?.data?.id;
      if (actionId) {
        requestLogin(actionId);
      } else {
        console.log('trupaid login 2 error:', res);
        Toast.show({
          type: 'toast_custom_type',
          text1: '',
          text2: 'Network error!',
          visibilityTime: 3000,
        });
        dispatch(setApiLoading(false));
      }
    }).catch(error => {
      console.log('trupaid login 2 error:', error);
      dispatch(setApiLoading(false));
    });
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

  const requestLogin = (actionId) => {
    const body = {
      'csrf_token': '',
      'method': 'password',
      'password': password,
      'password_identifier': email,
    };

    dispatch(setApiLoading(true));
    const params = 'login?flow=' + actionId;
    ApiAuthKit.post(params, body).then(async res => {
      dispatch(setApiLoading(false));

      console.log('trupaid login success: session token: ', res?.data?.session_token);

      await setGraphqlToken(res?.data?.session_token);
      await setApiTruPaidToken(res?.data?.session_token);
      await AsyncStorage.setItem('@trupaid_email', email);
      await AsyncStorage.setItem('@trupaid_password', password);
      dispatch(updateUserInfo(res?.data));

      // await analytics().logEvent('login', {
      //   id: res?.data?.session?.identity?.id,
      // });

      navigation.navigate('SelectTopics');

    }).catch(error => {
      console.log('trupaid login 3 error:', error?.response?.data);
      const errors = error?.response?.data?.errors;
      if (Array.isArray(errors) && errors?.length > 0) {
        Toast.show({
          type: 'toast_custom_type',
          text1: '',
          text2: errors[0]?.message,
          visibilityTime: 3000,
        });
      }
      dispatch(setApiLoading(false));
    });
  };

  const HeaderLayout = () => {
    return (
      <View style={styles.headerContainer}>
        <Text style={styles.textTruPaid}>
          TRUPAID
        </Text>
      </View>
    );
  };

  const InputLayout = () => {
    return (
      <View style={{ flex: 1 }}>
        <Text style={[CommonStyle.text24_inter_m, { textAlign: 'center' }]}>
          Sign in
        </Text>
        <View style={{ marginTop: WINDOW_HEIGHT * 0.07 }}>
          <InputCardBox
            header={'Email'}
            placeholder={'Your email'}
            keyboardType={'email-address'}
            autoCapitalize={'none'}
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
        </View>

        <View style={{ marginTop: 16 }}>
          <InputTextCard
            header={'Password'}
            placeholder={'Your password'}
            value={password}
            onChangeText={(text) => setPassword(text)}
            secureTextEntry={isPassword}
            rightIcon={icEye}
            onPressRight={changePwdType}
          />
        </View>

        <View style={{ alignSelf: 'flex-start' }}>
          <TouchableOpacity
            onPress={() => navigation.navigate('ResetPassword')}
          >
            <Text style={[CommonStyle.text14_inter_r, {
              paddingHorizontal: 3,
              paddingVertical: 10,
              marginTop: 12,
            }]}>
              Forgot password?
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const SignUpButton = () => {
    return (
      <View style={[CommonStyle.row, { paddingTop: 5, alignSelf: 'center' }]}>
        <Text style={[CommonStyle.text14_inter_r, { paddingLeft: 3 }]}>
          New to TruPaid?
        </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('SignUp')}
        >
          <Text style={[CommonStyle.text14_inter_sb, {
            color: Theme.primary,
            paddingHorizontal: 3,
            paddingVertical: 10,
          }]}>
            Sign Up
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden={false} translucent={true} backgroundColor={'transparent'} />

      <View style={{ height: WINDOW_HEIGHT * 0.05, minHeight: 15, backgroundColor: Theme.white }} />

      {HeaderLayout()}

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          bounces={'alwaysBounce'}
        >

          <View style={styles.body}>

            {InputLayout()}

            <View style={{ height: 20 }} />

          </View>

        </ScrollView>
      </KeyboardAvoidingView>

      <View style={styles.btnContainer}>
        <MainButton
          onPress={onPressNext}
          title={'Sign in'}
          isValid={isValid}
        />

        {SignUpButton()}

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.white,
  },
  headerContainer: {
    marginTop: WINDOW_HEIGHT * 0.07,
    paddingHorizontal: PADDING_HOR,
    alignItems: 'center',
  },
  body: {
    flex: 1,
    paddingTop: WINDOW_HEIGHT * 0.15,
    paddingHorizontal: PADDING_HOR,
  },
  btnContainer: {
    width: WINDOW_WIDTH,
    paddingHorizontal: PADDING_HOR,
    marginBottom: 30,
    paddingTop: 10,
    alignSelf: 'center',
    justifyContent: 'flex-end',
    backgroundColor: Theme.white,
  },
  textTruPaid: {
    fontSize: 18,
    fontFamily: 'TestPitchSans-Bold',
    color: '#222222',
    lineHeight: 21,
  },
});

export default LoginScreen;
