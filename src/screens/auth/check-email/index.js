import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Image, StatusBar, Text, TouchableOpacity} from 'react-native';
import {useDispatch} from 'react-redux';
import {Theme} from '../../../styles/theme';
import {CommonStyle} from '../../../styles';
import {navigation} from '../../../routes/navigation';
import {validateEmail} from '../../../styles/global';

const CheckEmailScreen = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [isValid, setValid] = useState(false);

  useEffect(() => {
    setValid(validateEmail(email));
  }, [email]);

  const onPressNext = () => {
    navigation.navigate('CreateNewPassword');
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden={false} translucent={true} backgroundColor={'transparent'}/>

      <View style={styles.body}>
        <Image source={Theme.inbox} style={styles.inbox}/>

        <Text style={[CommonStyle.text27_inter_m, {color: Theme.black, paddingTop: 18}]}>
          Check your mail
        </Text>

        <Text style={[CommonStyle.text14_inter_r, {color: Theme.greyDarkMedium, paddingTop: 11}]}>
          We've sent a reset link to your email
        </Text>

        <TouchableOpacity style={{marginTop: 52}}
                          onPress={onPressNext}
        >
          <Text style={styles.textNewPassword}>
            Set a new password
          </Text>
        </TouchableOpacity>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  inbox: {
    width: 42,
    height: 42,
    resizeMode: 'contain',
  },
  textNewPassword: {
    ...CommonStyle.text14_inter_m,
    color: Theme.primary,
    paddingVertical: 10,
    textDecorationLine: 'underline',
  },
});

export default CheckEmailScreen;
