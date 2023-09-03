import React, {useEffect, useRef, useState} from 'react';
import {useDispatch} from 'react-redux';
import {useLazyQuery} from '@apollo/client';
import {
  View,
  StyleSheet,
  StatusBar,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import Toast from 'react-native-toast-message';
import PhoneInput from 'react-native-phone-number-input';
import {Theme} from '../../../styles/theme';
import {PADDING_HOR, WINDOW_WIDTH} from '../../../styles/constant';
import {CommonStyle} from '../../../styles';
import TopNavHeader from '../../../components/top-nav-header';
import {navigation} from '../../../routes/navigation';
import MainButton from '../../../components/main-button';
import {isIOS} from '../../../styles/global';
import {verificationStart} from '../../../utils/ApiAptoKit';
import {setApiLoading} from '../../../redux/actions/config';
import {
  setVerificationId,
  setPhonenumber,
  setCountryCode,
  setBirthDate,
  setNameAndEmail,
  setTruPaidAptoId,
} from '../../../redux/actions/apto';
import {APTO_MOBILE_ACCESS} from '../../../utils/Query';
import {setApiAptoPublicKey} from '../../../utils/ApiAptoKit';

const AptoInputPhoneScreen = () => {
  const dispatch = useDispatch();
  const phoneInputRef = useRef(null);
  const [value, setValue] = useState('');
  const [formattedValue, setFormattedValue] = useState('');
  const [cca2, setCountry] = useState('US');
  const [countryCallingCode, setCountryCallingCode] = useState('1');
  const [isValidPhone, setValidPhone] = useState(false);

  const [
    aptoMobileAccess,
    {
      data: mobileAccessData,
      loading: mobileAccessLoading,
      error: mobileAccessError,
    },
  ] = useLazyQuery(APTO_MOBILE_ACCESS);

  useEffect(() => {
    aptoMobileAccess();
  }, []);

  useEffect(() => {
    if (mobileAccessData) {
      if (mobileAccessData.aptoMobileAccess.mobileAPIPublicKey) {
        setApiAptoPublicKey(
          mobileAccessData.aptoMobileAccess.mobileAPIPublicKey,
        );
        dispatch(
          setNameAndEmail({
            first_name: mobileAccessData.aptoMobileAccess.aptoUser?.firstName,
            last_name: mobileAccessData.aptoMobileAccess.aptoUser?.lastName,
            email: mobileAccessData.aptoMobileAccess.aptoUser?.email,
          }),
        );
        dispatch(
          setBirthDate(mobileAccessData.aptoMobileAccess.aptoUser?.birthday),
        );
        dispatch(
          setTruPaidAptoId(
            mobileAccessData.aptoMobileAccess.aptoUser?.trupaidAptoId,
          ),
        );
      }
    }
  }, [mobileAccessData]);

  const onPressNext = () => {
    dispatch(setApiLoading(true));
    verificationStart(countryCallingCode, value)
      .then(async res => {
        dispatch(setApiLoading(false));
        if (res?.data?.verification_id) {
          dispatch(setVerificationId(res?.data?.verification_id));
          dispatch(setPhonenumber(value));
          dispatch(setCountryCode(countryCallingCode));
          navigation.navigate('AptoVerifyCode');
        }
      })
      .catch(error => {
        dispatch(setApiLoading(false));
        Toast.show({
          type: 'toast_custom_type',
          text1: '',
          text2: error.message,
          visibilityTime: 3000,
        });
      });
  };

  const onPressLeft = () => {
    navigation.goBack();
  };

  const onChangePhone = text => {
    setValue(text);
    const checkValid = phoneInputRef.current?.isValidNumber(text);
    setValidPhone(checkValid ? checkValid : false);
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
        style={{flex: 1}}>
        <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
          <Text
            style={[
              CommonStyle.text27_inter_m,
              {color: Theme.black, paddingVertical: 10},
            ]}>
            Get started
          </Text>

          <Text
            style={[
              CommonStyle.text15_inter_r,
              {color: Theme.grey, lineHeight: 22},
            ]}>
            To ensure the security of your account, please enter your phone
            number below and we will send you a unique coe to authenticate you.
          </Text>

          <View style={{marginTop: 50}}>
            <Text style={CommonStyle.text14_inter_m}>Phone number</Text>
            <View style={{height: 10}} />
            <PhoneInput
              ref={phoneInputRef}
              defaultValue={value}
              defaultCode={cca2}
              layout="first"
              onChangeText={text => {
                onChangePhone(text);
              }}
              onChangeFormattedText={text => {
                setFormattedValue(text);
              }}
              onChangeCountry={text => {
                setCountry(text.cca2);
                setCountryCallingCode(text.callingCode[0]);
              }}
              containerStyle={styles.phoneContainer}
              countryPickerButtonStyle={{marginHorizontal: 0}}
              textContainerStyle={{
                backgroundColor: Theme.white,
                borderColor: '#E5E5E5',
                borderWidth: 0.5,
                borderRadius: 8,
                marginLeft: 10,
                marginRight: 0,
                paddingRight: 0,
                height: 50,
              }}
              flagButtonStyle={{
                backgroundColor: Theme.background,
                borderColor: '#E5E5E5',
                borderWidth: 0.5,
                borderRadius: 8,
              }}
              textInputStyle={[
                CommonStyle.text14_inter_r,
                {
                  paddingVertical: 0,
                  height: 30,
                  textAlignVertical: 'center',
                },
              ]}
              codeTextStyle={[
                CommonStyle.text14_inter_r,
                {
                  paddingVertical: isIOS ? 6 : 0,
                  height: 30,
                  textAlignVertical: 'center',
                },
              ]}
              textInputProps={{
                returnKeyType: 'done',
                maxLength: cca2 === 'US' ? 10 : 11,
              }}
              withDarkTheme
            />
          </View>
        </ScrollView>

        <View style={styles.btnContainer}>
          <MainButton
            onPress={onPressNext}
            title={'Next'}
            isValid={isValidPhone}
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
});

export default AptoInputPhoneScreen;
