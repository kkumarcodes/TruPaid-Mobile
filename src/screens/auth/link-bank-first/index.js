import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Image, StatusBar, Text} from 'react-native';
import {Theme} from '../../../styles/theme';
import {PADDING_HOR, WINDOW_WIDTH} from '../../../styles/constant';
import {CommonStyle} from '../../../styles';
import MainButton from '../../../components/main-button';
import TopNavHeader from '../../../components/top-nav-header';
import {navigation} from '../../../routes/navigation';
import MainOutlineButton from '../../../components/main-outline-button';
import {loadHome} from '../../../redux/actions/auth';
import {useDispatch} from 'react-redux';

const LinkBankFirstScreen = () => {
  const dispatch = useDispatch()

  const onPressLeft = () => {
    navigation.goBack();
  };

  const onPressNext = () => {
    navigation.navigate('LinkBankSecond');
  };

  const onPressLater = () => {
    dispatch(loadHome());
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden={false} translucent={true} backgroundColor={'transparent'}/>

      <TopNavHeader
        title={'Linking your bank'}
        leftIcon={Theme.arrow_left}
        onPressLeft={onPressLeft}
      />

      <View style={styles.body}>
        <View style={styles.imgWrapper}>
          <Image source={Theme.icon_home} style={styles.imgHome}/>
        </View>

        <Text style={[CommonStyle.text20_inter_m, {color: Theme.black, paddingTop: 26}]}>
          Link your existing cards
        </Text>

        <Text style={styles.desc}>
          {'To save, share and earn through\nReveel, first link any debit and credit\ncards you use'}
        </Text>

      </View>

      <View style={styles.btnContainer}>
        <MainButton
          onPress={onPressNext}
          title={'Continue'}
          isValid={true}
        />
        <MainOutlineButton
          onPress={onPressLater}
          title={'Link cards later'}
          isValid={true}
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
  body: {
    flex: 1,
    backgroundColor: Theme.white,
    paddingHorizontal: PADDING_HOR,
    ...CommonStyle.center,
  },
  btnContainer: {
    width: WINDOW_WIDTH,
    paddingHorizontal: PADDING_HOR,
    marginBottom: 30,
    alignSelf: 'center',
    justifyContent: 'flex-end',
  },
  imgWrapper: {
    width: 55,
    height: 55,
    borderRadius: 55,
    backgroundColor: '#65ba87',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imgHome: {
    width: 23,
    height: 23,
    resizeMode: 'contain',
  },
  desc: {
    ...CommonStyle.text14_inter_r,
    color: Theme.greyDarkMedium,
    lineHeight: 20,
    paddingTop: 14,
    textAlign: 'center',
  },
});

export default LinkBankFirstScreen;
