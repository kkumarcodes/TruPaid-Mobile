import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Image, StatusBar, Text} from 'react-native';
import {useDispatch} from 'react-redux';
import {Theme} from '../../../styles/theme';
import {PADDING_HOR, WINDOW_HEIGHT, WINDOW_WIDTH} from '../../../styles/constant';
import {CommonStyle} from '../../../styles';
import MainButton from '../../../components/main-button';
import TopNavHeader from '../../../components/top-nav-header';
import {navigation} from '../../../routes/navigation';

const RegisterCardScreen = () => {
  const dispatch = useDispatch();

  const onPressLeft = () => {
    navigation.goBack();
  };

  const onPressNext = () => {
    navigation.navigate('ChooseAccount');
  };

  const HeaderLayout = () => {
    return (
      <View style={styles.headerContainer}>
        <Text style={[CommonStyle.text15_inter_r, {color: Theme.grey, lineHeight: 33, letterSpacing: -0.3}]}>
          Introducing your new Reveel card
        </Text>
        <Text style={[CommonStyle.text27_inter_b, {lineHeight: 33, letterSpacing: -0.3}]}>
          Welcome to the club!
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden={false} translucent={true} backgroundColor={'transparent'}/>

      <TopNavHeader onPressLeft={onPressLeft} leftIcon={Theme.arrow_left}/>

      {HeaderLayout()}

      <View style={styles.body}>

        <View style={{flex: 0.45}}/>

        <Image source={Theme.card_sample} style={styles.card}/>

        <View style={styles.btnContainer}>
          <MainButton
            onPress={onPressNext}
            title={'Link to account'}
            isValid={true}
          />
        </View>

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
    paddingTop: WINDOW_HEIGHT * 0.02,
    paddingHorizontal: PADDING_HOR,
    justifyContent: 'center',
    alignItems: 'center',
  },
  body: {
    flex: 1,
    backgroundColor: Theme.white,
    paddingHorizontal: PADDING_HOR,
  },
  card: {
    width: WINDOW_WIDTH - PADDING_HOR * 2,
    height: (WINDOW_WIDTH - PADDING_HOR * 2) * 0.9078,
    resizeMode: 'contain',
  },
  btnContainer: {
    flex: 1,
    width: WINDOW_WIDTH,
    paddingHorizontal: PADDING_HOR,
    marginBottom: 30,
    alignSelf: 'center',
    justifyContent: 'flex-end',
  },
});

export default RegisterCardScreen;
