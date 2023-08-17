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
import {Theme} from '../../../styles/theme';
import {PADDING_HOR} from '../../../styles/constant';
import {navigation} from '../../../routes/navigation';
import AptoNavHeader from '../../../components/apto-nav-header';
import {validateEmail} from '../../../styles/global';
import AptoInputBox from '../../../components/apto-input-box';
import {setNameAndEmail} from '../../../redux/actions/apto';

const AptoEnterNameScreen = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState(useSelector(state => state?.apto?.email));
  const [fname, setFirstName] = useState(
    useSelector(state => state?.apto?.first_name),
  );
  const [lname, setLastName] = useState(
    useSelector(state => state?.apto?.last_name),
  );
  const [isValid, setValid] = useState(false);

  useEffect(() => {
    if (email && fname && lname) {
      setValid(
        validateEmail(email) &&
          fname?.trim()?.length > 1 &&
          lname?.trim()?.length > 1,
      );
    } else {
      setValid(false);
    }
  }, [email, fname, lname]);

  const onPressLeft = () => {
    navigation.goBack();
  };

  const onPressRight = () => {
    dispatch(
      setNameAndEmail({first_name: fname, last_name: lname, email: email}),
    );
    navigation.navigate('AptoHomeAddress');
  };

  const InputLayout = () => {
    return (
      <View style={{flex: 1}}>
        <View style={{marginTop: 20}}>
          <AptoInputBox
            title={'First name'}
            header={''}
            placeholder={'First name'}
            value={fname}
            onChangeText={text => setFirstName(text)}
          />
        </View>

        <View style={{marginTop: 20}}>
          <AptoInputBox
            title={'Last name'}
            header={''}
            placeholder={'Last name'}
            value={lname}
            onChangeText={text => setLastName(text)}
          />
        </View>

        <View style={{marginTop: 20}}>
          <AptoInputBox
            title={'Email'}
            header={''}
            placeholder={'Your email'}
            keyboardType={'email-address'}
            autoCapitalize={'none'}
            value={email}
            onChangeText={text => setEmail(text)}
          />
        </View>
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
        title={'Enter your name'}
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

export default AptoEnterNameScreen;
