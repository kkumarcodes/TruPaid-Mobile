import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  View,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import Toast from 'react-native-toast-message';
import {useMutation} from '@apollo/client';
import {Theme} from '../../../styles/theme';
import {PADDING_HOR} from '../../../styles/constant';
import {navigation} from '../../../routes/navigation';
import AptoNavHeader from '../../../components/apto-nav-header';
import AptoInputBox from '../../../components/apto-input-box';
import {setAptoSSN, setVerificationId} from '../../../redux/actions/apto';
import {setApiAptoToken, userLogin, verificationStart, createUser} from '../../../utils/ApiAptoKit';
import {setApiLoading} from '../../../redux/actions/config';
import {POST_APTO_USER} from '../../../utils/Query';

const AptoPersonalNumberScreen = () => {
  const dispatch = useDispatch();
  const [isValid, setValid] = useState(false);
  const [documentNumber, setNumber] = useState('');
  const verification_id = useSelector(state => state?.apto?.verification_id);
  const secondary_verification_id = useSelector(
    state => state?.apto?.secondary_verification_id,
  );
  const phone_number = useSelector(state => state?.apto?.phone_number);
  const country_code = useSelector(state => state?.apto?.country_code);
  const first_name = useSelector(state => state?.apto?.first_name);
  const last_name = useSelector(state => state?.apto?.last_name);
  const email = useSelector(state => state?.apto?.email);
  const street_one = useSelector(state => state?.apto?.street_one);
  const street_two = useSelector(state => state?.apto?.street_two);
  const locality = useSelector(state => state?.apto?.locality);
  const region = useSelector(state => state?.apto?.region);
  const postal_code = useSelector(state => state?.apto?.postal_code);
  const country = useSelector(state => state?.apto?.country);
  const birthdate = useSelector(state => state?.apto?.birthdate);

  const [postAptoUser, {data, loading, error}] = useMutation(POST_APTO_USER);

  useEffect(() => {
    setValid(documentNumber.length > 5);
  }, [documentNumber]);

  const onPressLeft = () => {
    navigation.goBack();
  };

  const onPressRight = async () => {
    dispatch(setAptoSSN(documentNumber));

    try {
      const result = await AptoProcess();
      dispatch(setApiLoading(false));
      if (result) {
        navigation.navigate('AptoLegalAgreement');
      }
    } catch (error) {
      let message = '';
      if (error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error.message) {
        message = error.message;
      } else {
        message = 'error';
      }
      Toast.show({
        type: 'toast_custom_type',
        text1: '',
        text2: message,
        visibilityTime: 3000,
      });
      dispatch(setApiLoading(false));
    }
  };

  const AptoProcess = async () => {
    let params = '';
    let body = {};

    if (verification_id && secondary_verification_id) {
      // already existing user
      
      try {
        let res = await userLogin(verification_id, secondary_verification_id);
        const data = res.data;
        await setApiAptoToken(data.user_token);
        return true;
      } catch (error) {
        await createUserHandler();
        await verifyPhonenumber();
        navigation.navigate('AptoVerifyCode');
        return false;
      }
    } else {
      await createUserHandler();
      await verifyPhonenumber();
      navigation.navigate('AptoVerifyCode');
      return false;
    }
  };

  const verifyPhonenumber = () => {
    verificationStart(country_code, phone_number)
      .then(async res => {
        dispatch(setApiLoading(false));
        if (res?.data?.verification_id) {
          dispatch(setVerificationId(res?.data?.verification_id));
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
  const createUserHandler = async () => {
    let res = await createUser({
      verification_id,
      country_code,
      phone_number,
      email,
      birthdate,
      first_name,
      last_name,
      street_one,
      street_two,
      locality,
      region,
      postal_code,
      country,
    });

    const data = res.data;

    await setApiAptoToken(data.user_token);

    const _data = {
      variables: {
        payload: {
          userToken: data.user_token,
          aptoId: data.user_id,
          firstName: data.user_data.data.filter(el => el.type === 'name')[0]
            .first_name,
          lastName: data.user_data.data.filter(el => el.type === 'name')[0]
            .last_name,
          email: data.user_data.data.filter(el => el.type === 'email')[0].email,
          birthday: data.user_data.data.filter(el => el.type === 'birthdate')[0]
            .date,
          addresses: {
            streetOne: data.user_data.data.filter(
              el => el.type === 'address',
            )[0].street_one,
            streetTwo: data.user_data.data.filter(
              el => el.type === 'address',
            )[0].street_two,
            locality: data.user_data.data.filter(el => el.type === 'address')[0]
              .locality,
            region: data.user_data.data.filter(el => el.type === 'address')[0]
              .region,
            postalCode: data.user_data.data.filter(
              el => el.type === 'address',
            )[0].postal_code,
            country: data.user_data.data.filter(el => el.type === 'address')[0]
              .country,
          },
          phones: {
            countryCode: data.user_data.data.filter(
              el => el.type === 'phone',
            )[0].country_code,
            phoneNumber: data.user_data.data.filter(
              el => el.type === 'phone',
            )[0].phone_number,
            verified: data.user_data.data.filter(el => el.type === 'phone')[0]
              .verified,
            notSpecified: data.user_data.data.filter(
              el => el.type === 'phone',
            )[0].not_specified,
            primaryVerification: {
              type: 'verification',
              status: 'passed',
              verificationId: verification_id,
              verificationType: 'phone',
              mechanism: 'phone',
            },
          },
        },
      },
    };
    console.log(_data, 'apto user')
    await postAptoUser(_data);
  };

  const InputLayout = () => {
    return (
      <View style={{flex: 1, marginTop: 20}}>
        <AptoInputBox
          title={'Document number (SSN)'}
          header={''}
          placeholder={'Document number'}
          value={documentNumber}
          onChangeText={text => setNumber(text)}
          keyboardType={'number-pad'}
          maxLength={12}
        />
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

      <AptoNavHeader
        onPressLeft={onPressLeft}
        leftIcon={Theme.arrow_left}
        title={'Personal information'}
        rightText={'Next'}
        onPressRight={onPressRight}
        isValid={isValid}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flex: 1}}>
        <ScrollView
          style={styles.body}
          showsVerticalScrollIndicator={false}
          bounces={'alwaysBounce'}>
          {InputLayout()}
        </ScrollView>
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
});

export default AptoPersonalNumberScreen;
