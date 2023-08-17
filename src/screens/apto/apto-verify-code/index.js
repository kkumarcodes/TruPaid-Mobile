import React, { createRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  View,
  StyleSheet,
  StatusBar,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { Theme } from '../../../styles/theme';
import { PADDING_HOR, WINDOW_WIDTH } from '../../../styles/constant';
import { CommonStyle } from '../../../styles';
import TopNavHeader from '../../../components/top-nav-header';
import { navigation } from '../../../routes/navigation';
import MainButton from '../../../components/main-button';
import OtpTextInput from '../../../components/otp-input';
import {
  completeVerification,
  userLogin,
  setApiAptoToken,
} from '../../../utils/ApiAptoKit';
import { setApiLoading } from '../../../redux/actions/config';
import { setSecondaryVerificationId } from '../../../redux/actions/apto';

const AptoVerifyCodeScreen = () => {
  const dispatch = useDispatch();
  const verification_id = useSelector(state => state?.apto?.verification_id);
  const [isValidOTP, setVaildOTP] = useState(false);
  const [otpArray, setOTPArray] = useState(['', '', '', '', '', '']);
  const [otpCode, setOTPCode] = useState('');
  const birthdate = useSelector(state => state?.apto?.birthdate);

  // TextInput refs to focus programmatically while entering OTP
  let firstTextInputRef = createRef();
  let secondTextInputRef = createRef();
  let thirdTextInputRef = createRef();
  let fourthTextInputRef = createRef();
  let fiveTextInputRef = createRef();
  let sixTextInputRef = createRef();

  const onPressNext = () => {
    dispatch(setApiLoading(true));
    completeVerification(verification_id, otpCode)
      .then(async res => {
        dispatch(setApiLoading(false));
        console.log(res, 'res')
        if (res.data.status === 'passed') {
          // The verification succeeded. If it belongs to an existing user, it will contain a non null `secondaryCredential`.
          if (
            res.data.secondary_credential &&
            res.data.secondary_credential.status === 'pending'
          ) {
            // this is existing user
            const secondary_verification_id =
              res.data.secondary_credential.verification_id;
            dispatch(setSecondaryVerificationId(secondary_verification_id));
            completeVerification(secondary_verification_id, birthdate)
              .then(async res => {
                dispatch(setApiLoading(false));
                if (res.data.status === 'passed') {
                  try {
                    const loginResponse = await userLogin(
                      verification_id,
                      secondary_verification_id,
                    );
                    const data = loginResponse.data;
                    console.log(data.user_token, '==data.user_token==')
                    await setApiAptoToken(data.user_token);
                    navigation.navigate('AptoLegalAgreement');
                  } catch (error) {
                    let message = '';
                    if (error.response?.data?.message) {
                      message = error.response.data.message;
                    } else if (error.message) {
                      message = error.message;
                    } else {
                      message = 'login user failed';
                    }

                    Toast.show({
                      type: 'toast_custom_type',
                      text1: '',
                      text2: message,
                      visibilityTime: 3000,
                    });
                  }
                } else {
                  Toast.show({
                    type: 'toast_custom_type',
                    text1: '',
                    text2: 'Incorrect Phone number',
                    visibilityTime: 3000,
                  });
                }
              })
              .catch(error => {
                dispatch(setApiLoading(false));
              });
          } else {
            navigation.navigate('AptoEnterName');
          }
        } else {
          Toast.show({
            type: 'toast_custom_type',
            text1: '',
            text2: 'code does not match',
            visibilityTime: 3000,
          });
        }
      })
      .catch(error => {
        dispatch(setApiLoading(false));
      });
  };

  const onPressLeft = () => {
    navigation.goBack();
  };

  const setOTP = value => {
    setOTPArray(value);

    // check if otp array fill
    let strOtp = '';
    value.map(val => {
      strOtp = strOtp + val;
    });
    strOtp = strOtp.trim();
    setVaildOTP(strOtp.length === 6);
    setOTPCode(strOtp);
  };

  const onOtpChange = index => {
    return value => {
      const otpArrayCopy = otpArray.concat();
      otpArrayCopy[index] = value;

      setOTP(otpArrayCopy);

      if (value !== '') {
        if (index === 0) {
          secondTextInputRef.current.focus();
        } else if (index === 1) {
          thirdTextInputRef.current.focus();
        } else if (index === 2) {
          fourthTextInputRef.current.focus();
        } else if (index === 3) {
          fiveTextInputRef.current.focus();
        } else if (index === 4) {
          sixTextInputRef.current.focus();
        }
      }
    };
  };

  const onOtpKeyPress = index => {
    return ({ nativeEvent: { key: value } }) => {
      if (value === 'Backspace' && otpArray[index] === '') {
        if (index === 1) {
          firstTextInputRef.current.focus();
        } else if (index === 2) {
          secondTextInputRef.current.focus();
        } else if (index === 3) {
          thirdTextInputRef.current.focus();
        } else if (index === 4) {
          fourthTextInputRef.current.focus();
        } else if (index === 5) {
          fiveTextInputRef.current.focus();
        }

        if (Platform.OS === 'android' && index > 0) {
          const otpArrayCopy = otpArray.concat();
          otpArrayCopy[index - 1] = '';
          setOTP(otpArrayCopy);
        }
      }
    };
  };

  const refCallback = textInputRef => node => {
    textInputRef.current = node;
  };

  const OTPLayout = () => {
    return (
      <View style={[CommonStyle.row_bw]}>
        {[
          firstTextInputRef,
          secondTextInputRef,
          thirdTextInputRef,
          fourthTextInputRef,
          fiveTextInputRef,
          sixTextInputRef,
        ].map((textInputRef, index) => (
          <OtpTextInput
            containerStyle={[styles.fill]}
            value={otpArray[index]}
            onKeyPress={onOtpKeyPress(index)}
            onChangeText={onOtpChange(index)}
            maxLength={1}
            autoFocus={index === 0 ? undefined : undefined}
            refCallback={refCallback(textInputRef)}
            key={index}
            keyboardType={'phone-pad'}
          />
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar
        hidden={true}
        translucent={true}
        backgroundColor={'transparent'}
      />

      <TopNavHeader onPressLeft={onPressLeft} leftIcon={Theme.arrow_left} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}>
        <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
          <Text
            style={[
              CommonStyle.text27_inter_m,
              { color: Theme.black, paddingVertical: 10 },
            ]}>
            Verify your account
          </Text>

          <Text
            style={[
              CommonStyle.text15_inter_r,
              { color: Theme.grey, lineHeight: 22 },
            ]}>
            Enter the six-digit verification code below. It may take up to a few
            minutes.
          </Text>

          <View style={{ flex: 1, marginTop: 70, marginHorizontal: 10 }}>
            {OTPLayout()}
          </View>

          <View style={{ marginTop: 30 }}>
            <Text style={[CommonStyle.text12_inter_r, { color: Theme.grey }]}>
              Didn't receive a code?
            </Text>

            <Text
              style={[
                CommonStyle.text12_inter_r,
                { color: Theme.grey, marginTop: 0 },
              ]}>
              <TouchableOpacity>
                <Text
                  style={[
                    CommonStyle.text12_inter_sb,
                    {
                      color: Theme.primary,
                      textDecorationLine: 'underline',
                      top: 4,
                    },
                  ]}>
                  Resend your code
                </Text>
              </TouchableOpacity>
              {'  '}if doesn't arrive in 00:44
            </Text>
          </View>

          <View style={{ height: 30 }} />
        </ScrollView>

        <View style={styles.btnContainer}>
          <MainButton
            onPress={onPressNext}
            title={'Next'}
            isValid={isValidOTP}
          />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.white,
  },
  body: {
    flex: 1,
    paddingHorizontal: PADDING_HOR,
  },
  btnContainer: {
    width: WINDOW_WIDTH,
    paddingHorizontal: PADDING_HOR,
    marginBottom: 30,
    paddingTop: 10,
    alignSelf: 'center',
  },
  phoneContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '99%',
    height: 50,
  },
  fill: {
    width: (WINDOW_WIDTH - 80) / 6,
    height: (WINDOW_WIDTH - 80) / 4.8,
    borderWidth: 1,
    borderColor: Theme.greyDark,
    borderRadius: 8,
  },
});

export default AptoVerifyCodeScreen;
