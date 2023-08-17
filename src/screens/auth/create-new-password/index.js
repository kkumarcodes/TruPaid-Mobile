import React, {useEffect, useState} from 'react';
import {View, StyleSheet, StatusBar, Text, Image, KeyboardAvoidingView, Platform, ScrollView} from 'react-native';
import {Theme} from '../../../styles/theme';
import {PADDING_HOR, WINDOW_WIDTH} from '../../../styles/constant';
import {CommonStyle} from '../../../styles';
import MainButton from '../../../components/main-button';
import TopNavHeader from '../../../components/top-nav-header';
import {navigation} from '../../../routes/navigation';
import InputTextCard from '../../../components/input-text-card';

const CreateNewPasswordScreen = () => {
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [isValid, setValid] = useState(false);
  const [isPassword, setIsPassword] = useState(true);
  const [icEye, setIcEye] = useState(Theme.icon_eye_on);

  useEffect(() => {

    setValid(
      password?.trim()?.length > 7 &&
      password2?.trim()?.length > 7 &&
      password === password2,
    );
  }, [password, password2]);

  const changePwdType = (text) => {
    if (!isPassword) {
      setIcEye(Theme.icon_eye_on);
    } else {
      setIcEye(Theme.icon_eye_off);
    }
    setIsPassword(!isPassword);
  };

  const onPressLeft = () => {
    navigation.goBack();
  };

  const onPressNext = () => {
    navigation.navigate('Login');
  };

  const HeaderLayout = () => {
    return (
      <View style={styles.headerContainer}>
        <Text style={[CommonStyle.text14_inter_r, {color: Theme.black, lineHeight: 19.95, letterSpacing: -0.3}]}>
          Your new password must be different from previously used passwords.
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden={false} translucent={true} backgroundColor={'transparent'}/>

      <TopNavHeader
        onPressLeft={onPressLeft}
        leftIcon={Theme.arrow_left}
        title={'Create new password'}
      />

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{flex: 1}}>
        <ScrollView style={styles.body}>
          {HeaderLayout()}

          <View style={{marginTop: 18}}>
            <InputTextCard
              placeholder={'Your password'}
              value={password}
              onChangeText={(text) => setPassword(text)}
              secureTextEntry={isPassword}
              rightIcon={icEye}
              onPressRight={changePwdType}
            />
            {password?.length < 8 &&
            <View style={styles.passwordInfo}>
              <Image source={Theme.icon_info} style={styles.iconInfo}/>
              <Text style={[CommonStyle.text12_inter_r, {color: Theme.grey, paddingLeft: 8, marginTop: -2}]}>
                Password must be at least 8 characters long and include uppercase letters, numbers and symbols
              </Text>
            </View>
            }
          </View>

          <View style={{marginTop: 24}}>
            <InputTextCard
              placeholder={'Confirm password'}
              value={password2}
              onChangeText={(text) => setPassword2(text)}
              secureTextEntry={false}
            />
            {!isValid &&
            <View style={styles.passwordInfo}>
              <Text style={[CommonStyle.text12_inter_r, {color: Theme.grey}]}>
                Both passwords must match
              </Text>
            </View>
            }
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={styles.btnContainer}>
        <MainButton
          onPress={onPressNext}
          title={'Change password'}
          isValid={isValid}
        />
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
    justifyContent: 'center',
  },
  body: {
    flex: 1,
    marginTop: 28,
    backgroundColor: Theme.white,
    paddingHorizontal: PADDING_HOR,
  },
  passwordInfo: {
    marginTop: 10,
    flexDirection: 'row',
  },
  iconInfo: {
    width: 14,
    height: 14,
    resizeMode: 'contain',
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
});

export default CreateNewPasswordScreen;
