import React, {useEffect, useState} from 'react';
import {View, StyleSheet, StatusBar, Text} from 'react-native';
import {Theme} from '../../../styles/theme';
import {PADDING_HOR} from '../../../styles/constant';
import {CommonStyle} from '../../../styles';
import MainButton from '../../../components/main-button';
import TopNavHeader from '../../../components/top-nav-header';
import {navigation} from '../../../routes/navigation';
import InputTextCard from '../../../components/input-text-card';
import {validateEmail} from '../../../styles/global';
import InputCardBox from '../../../components/input-card-box';
import AptoInputBox from '../../../components/apto-input-box';

const ResetPasswordScreen = () => {
  const [email, setEmail] = useState('');
  const [isValid, setValid] = useState(false);

  useEffect(() => {
    setValid(validateEmail(email));
  }, [email]);

  const onPressLeft = () => {
    navigation.goBack();
  };

  const onPressNext = () => {
    navigation.navigate('CheckEmail');
  };

  const HeaderLayout = () => {
    return (
      <View style={styles.headerContainer}>
        <Text style={[CommonStyle.text14_inter_r, {color: Theme.black, lineHeight: 19.95, letterSpacing: -0.3}]}>
          {'Enter the email associated with your account and we’ll send an email with instruction to reset your password'}
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
        title={'Reset password'}
      />

      <View style={styles.body}>
        {HeaderLayout()}

        <View style={{marginTop: 18}}>
          <InputTextCard
            header={'Email'}
            placeholder={'Your email'}
            keyboardType={'email-address'}
            autoCapitalize={'none'}
            value={email}
            onChangeText={(text) => setEmail(text)}
            rightIcon={isValid ? Theme.icon_check_fill : null}
            onPressRight={() => {
            }}
          />
        </View>

        <View style={{marginTop: 30}}/>
        <MainButton
          onPress={onPressNext}
          title={'Send'}
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
});

export default ResetPasswordScreen;
