import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Image, StatusBar, Text, ScrollView, TouchableOpacity} from 'react-native';
import {useDispatch} from 'react-redux';
import {Theme} from '../../../styles/theme';
import {PADDING_HOR, WINDOW_HEIGHT, WINDOW_WIDTH} from '../../../styles/constant';
import {CommonStyle} from '../../../styles';
import InputBox from '../../../components/input-box';
import MainButton from '../../../components/main-button';
import {navigation} from '../../../routes/navigation';
import {KeyboardAvoidingView} from 'react-native';
import {Platform} from 'react-native';
import {validateEmail, validatePassword} from '../../../styles/global';
import Toast from 'react-native-toast-message';
import ApiAuthKit from '../../../utils/ApiAuthKit';
import ApiFlowKit from '../../../utils/ApiFlowKit';
import {setApiLoading} from '../../../redux/actions/config';
import ApiGraphqlKit, {setGraphqlToken} from '../../../utils/ApiGraphqlKit';
import InputCardBox from '../../../components/input-card-box';
import InputTextCard from '../../../components/input-text-card';
import {setApiTruPaidToken} from '../../../utils/ApiTruPaidKit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {updateUserInfo} from '../../../redux/actions/auth';
import analytics from '@react-native-firebase/analytics';

const SignUpScreen = (props) => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [fname, setFirstName] = useState('');
  const [lname, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [isValid, setValid] = useState(false);
  const [isPassword, setIsPassword] = useState(true);
  const [icEye, setIcEye] = useState(Theme.icon_eye_on);

  useEffect(() => {

    setValid(
      validateEmail(email) &&
      fname?.trim()?.length > 1 &&
      lname?.trim()?.length > 1 &&
      password?.trim()?.length > 1,
      // validatePassword(password)
    );
  }, [email, fname, lname, password]);

  const changePwdType = (text) => {
    if (!isPassword) {
      setIcEye(Theme.icon_eye_on);
    } else {
      setIcEye(Theme.icon_eye_off);
    }
    setIsPassword(!isPassword);
  };

  const onPressNext = () => {

    let errors = [];
    if (password.length < 12) {
      errors.push('Password must be at least 12 characters');
    }
    if (!validatePassword(password)) {
      errors.push('Password should contain at least one digit and special character');
    }
    if (errors.length > 0) {
      Toast.show({
        type: 'toast_custom_type',
        text1: '',
        // text2: errors.join("\n"),
        text2: errors[0],
        visibilityTime: 3000,
      });
      return false;
    }

    dispatch(setApiLoading(true));
    // get initial data for registration
    getFlowIdForRegistration().then(async res => {
      const actionId = res?.data?.id;
      if (actionId) {
        requestRegistration(actionId);
      } else {
        console.log('trupaid registration error:', res);
        dispatch(setApiLoading(false));
      }
    }).catch(error => {
      console.log('trupaid registration error:', error);
      dispatch(setApiLoading(false));
    });
  };

  const getFlowIdForRegistration = async () => {

    return new Promise(async (resolve) => {
      ApiFlowKit.get('/registration/api').then(res => {
        resolve(res);
      }).catch(error => {
        console.log('trupaid registration error:', error);
        resolve(null);
      });
    });
  };

  const requestRegistration = (actionId) => {
    const body = {
      'csrf_token': '',
      'method': 'password',
      'password': password,
      'traits': {
        'email': email,
        'name': {
          'first': fname,
          'last': lname,
        },
      },
    };

    dispatch(setApiLoading(true));
    const params = 'registration?flow=' + actionId;
    ApiAuthKit.post(params, body).then(async res => {
      dispatch(setApiLoading(false));

      Toast.show({
        type: 'toast_custom_type',
        text1: '',
        text2: 'Your request is registered successfully',
        visibilityTime: 3000,
      });

      await setGraphqlToken(res?.data?.session_token);
      await setApiTruPaidToken(res?.data?.session_token);
      console.log('trupaid registration success: session token: ', res?.data?.session_token);
      await AsyncStorage.setItem('@trupaid_email', email);
      await AsyncStorage.setItem('@trupaid_password', password);
      dispatch(updateUserInfo(res?.data));

      // await analytics().logEvent('sign_up', {
      //   id: res?.data?.session?.identity?.id,
      // });

      navigation.navigate('SelectTopics');

    }).catch(error => {
      console.log('trupaid registration error:', error?.response?.data);
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

  const onPressLeft = () => {
    navigation.goBack();
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
      <View style={{flex: 1}}>
        <Text style={[CommonStyle.text24_inter_m, {textAlign: 'center'}]}>
          Welcome to TruPaid
        </Text>
        <View style={{marginTop: WINDOW_HEIGHT * 0.07}}>
          <InputCardBox
            header={'Email'}
            placeholder={'Your email'}
            keyboardType={'email-address'}
            autoCapitalize={'none'}
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
        </View>

        <View style={{marginTop: 16}}>
          <InputCardBox
            header={'First name'}
            placeholder={'Your first name'}
            value={fname}
            onChangeText={(text) => setFirstName(text)}
          />
        </View>

        <View style={{marginTop: 16}}>
          <InputCardBox
            header={'Last name'}
            placeholder={'Your last name'}
            value={lname}
            onChangeText={(text) => setLastName(text)}
          />
        </View>

        <View style={{marginTop: 16}}>
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
      </View>
    );
  };

  const SignInButton = () => {
    return (
      <View style={[CommonStyle.row, {paddingTop: 5, alignSelf: 'center'}]}>
        <Text style={[CommonStyle.text14_inter_r, {paddingLeft: 3}]}>
          Already have an account?
        </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={[CommonStyle.text14_inter_sb, {
            color: Theme.primary,
            paddingHorizontal: 3,
            paddingVertical: 10,
          }]}>
            Sign In
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden={false} translucent={true} backgroundColor={'transparent'}/>

      <View style={{height: WINDOW_HEIGHT * 0.05, minHeight: 15, backgroundColor: Theme.white}}/>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{flex: 1}}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          bounces={'alwaysBounce'}
        >

          {HeaderLayout()}

          <View style={styles.body}>
            {InputLayout()}

            <View style={{height: 20}}/>

          </View>

        </ScrollView>
      </KeyboardAvoidingView>

      <View style={styles.btnContainer}>
        <MainButton
          onPress={onPressNext}
          title={'Register'}
          isValid={isValid}
        />

        {SignInButton()}

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
    paddingTop: WINDOW_HEIGHT * 0.1,
    paddingHorizontal: PADDING_HOR,
  },
  btnContainer: {
    width: WINDOW_WIDTH,
    paddingHorizontal: PADDING_HOR,
    paddingBottom: 30,
    paddingTop: 10,
    alignSelf: 'center',
    justifyContent: 'flex-end',
    backgroundColor: Theme.white,
  },
  btnWrapper: {
    padding: 10,
    margin: -10,
  },
  topContainer: {
    height: 80,
    justifyContent: 'flex-end',
    paddingBottom: 12,
    paddingHorizontal: PADDING_HOR,
    backgroundColor: Theme.background,
  },
  textTruPaid: {
    fontSize: 18,
    fontFamily: 'TestPitchSans-Bold',
    color: '#222222',
    lineHeight: 21,
  },
});

export default SignUpScreen;
