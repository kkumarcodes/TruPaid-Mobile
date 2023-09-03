import React, {useEffect, useState} from 'react';
import {View, StyleSheet, StatusBar} from 'react-native';
import {Theme} from '../../styles/theme';
import AptoSplashScreen from '../apto/apto-splash';
import TruPaidCardDashboardScreen from './trupaid-card-dashboard';
import {useSelector} from 'react-redux';

const TruPaidCardScreen = () => {
  const issueCard = useSelector(state => state?.apto?.issueCard);
  if (issueCard) {
    console.log(JSON.stringify(issueCard))
  }
  return (
    <View style={styles.container}>
      <StatusBar hidden={true} translucent={true} backgroundColor={'transparent'}/>

      <AptoSplashScreen/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.greyShopCart,
  },
});

export default TruPaidCardScreen;
