import React from 'react';
import {View, StyleSheet, StatusBar, Image, Text} from 'react-native';
import {Theme} from '../../../styles/theme';
import {PADDING_HOR, WINDOW_WIDTH} from '../../../styles/constant';
import {navigation} from '../../../routes/navigation';
import LinearGradient from 'react-native-linear-gradient';
import {CommonStyle} from '../../../styles';
import MainButton from '../../../components/main-button';
import {IS_IPHONE_X} from '../../../styles/global';

const AptoSplashScreen = () => {
  
  const onPressLaunch = () => {
    navigation.navigate('AptoInputPhone');
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden={true} translucent={true} backgroundColor={'transparent'}/>

      <LinearGradient
        start={{x: 0, y: 0}} end={{x: 1, y: 0}}
        colors={['#EFE8F2', '#F7ECEB']}
        style={styles.linearContainer}
      >
        <View style={styles.titleContainer}>
          <Text style={[CommonStyle.text27_inter_b, {color: Theme.black, paddingVertical: 10, letterSpacing: -0.3}]}>
            {'Welcome\nTruPaid card'}
          </Text>

          <Text style={[CommonStyle.text18_inter_r, {color: Theme.greyDark, lineHeight: 22, letterSpacing: -0.3}]}>
            Receive maximum cashback on your purchases before sharing and earning when others follow your lead
          </Text>
        </View>

        <View style={styles.body}>
          <View style={styles.logoContainer}>
            <Image source={Theme.trupaid_card_logo} style={styles.logo}/>
          </View>

          <View style={styles.footer}>
            <View style={styles.btnContainer}>
              <MainButton
                onPress={onPressLaunch}
                title={'I want a TruPaid card'}
                isValid={true}
              />
            </View>
          </View>
        </View>

      </LinearGradient>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.white,
  },
  linearContainer: {
    flex: 1,
    paddingHorizontal: PADDING_HOR,
  },
  titleContainer: {
    marginTop: 50,
  },
  logo: {
    maxWidth: WINDOW_WIDTH - PADDING_HOR * 2,
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  btnContainer: {
    width: WINDOW_WIDTH,
    paddingHorizontal: PADDING_HOR,
  },
  footer: {
    alignItems: 'center',
    marginBottom: IS_IPHONE_X ? 100 : 80,
    marginTop: IS_IPHONE_X ? 70 : 40,
  },
  logoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: IS_IPHONE_X ? 70 : 40,
  },
  body: {
    flex: 1,
  },
});

export default AptoSplashScreen;
