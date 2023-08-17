import React, {useEffect, useCallback, useState} from 'react';
import {View, StyleSheet, Image, StatusBar, Text, TouchableOpacity} from 'react-native';
import {useDispatch} from 'react-redux';
import {Theme} from '../../../styles/theme';
import {PADDING_HOR, WINDOW_HEIGHT, WINDOW_WIDTH} from '../../../styles/constant';
import {CommonStyle} from '../../../styles';
import Cardscan from 'react-native-cardscan';
import TopNavHeader from '../../../components/top-nav-header';
import {navigation} from '../../../routes/navigation';
import { Platform } from 'react-native';

const StyledText = ({color, bold, ...otherProps}) => (
  <Text
    {...otherProps}
    style={{
      fontSize: 18,
      margin: 10,
      textAlign: 'center',
      color: color || '#263547',
      fontWeight: bold ? '700' : '500',
    }}
  />
);

const ScanCardScreen = () => {
  const dispatch = useDispatch();
  const [compatible, setCompatible] = useState(null);
  const [card, setCard] = useState(null);
  const [recentAction, setRecentAction] = useState('none');

  useEffect(() => {
    if (compatible) {
      setTimeout(() => {
        scanCard();
      }, 500)
    }
    else {
    }
  }, [compatible]);

  const scanCard = useCallback(async () => {
    const {action, scanId, payload, canceledReason} = await Cardscan.scan();
    setRecentAction(action);
    if (action === 'scanned') {
      var issuer = payload.issuer || '??';
      // if (issuer === 'MasterCard') {
      //   issuer = 'master-card';
      // } else if (issuer === 'American Express') {
      //   issuer = 'american-express';
      // } else {
      //   issuer = issuer.toLowerCase();
      // }

      setCard({
        number: payload.number,
        expiryDay: payload.expiryDay || '',
        expiryMonth: payload.expiryMonth || '??',
        expiryYear: payload.expiryYear || '??',
        issuer: issuer,
        cvc: payload.cvc || '??',
        cardholderName: payload.cardholderName || '',
        error: payload.error || '',
      });

      let cardInfo = {
        number: payload.number,
        expiryDay: payload.expiryDay || '',
        expiryMonth: payload.expiryMonth || '??',
        expiryYear: payload.expiryYear || '??',
        issuer: issuer,
        cvc: payload.cvc || '??',
        cardholderName: payload.cardholderName || '',
        error: payload.error || '',
      }

      console.log(cardInfo)

      navigation.goBack();
      navigation.navigate('AddPayment', {cardInfo});
    }

    console.log(action)

    if (action === 'canceled') {
        if(Platform.OS === 'ios') {
          let cardInfo = {
            number: '',
            expiryDay: '',
            expiryMonth: '??',
            expiryYear: '??',
            issuer: '',
            cvc: '??',
            cardholderName: '??',
            error: '',
          }

          navigation.goBack();
          navigation.navigate('AddPayment', {cardInfo});
      }
      else {
        if (canceledReason === 'enter_card_manually') {

          let cardInfo = {
            number: '',
            expiryDay: '',
            expiryMonth: '??',
            expiryYear: '??',
            issuer: '',
            cvc: '??',
            cardholderName: '??',
            error: '',
          }

          navigation.goBack();
          navigation.navigate('AddPayment', {cardInfo});
        }

        if (canceledReason === 'user_canceled') {
          navigation.goBack();
        }

        if (canceledReason === 'camera_error') {
          alert('Camera error during scan');
          navigation.goBack();
        }

        if (canceledReason === 'fatal_error') {
          alert('Processing error during scan');
          navigation.goBack();
        }

        if (canceledReason === 'unknown') {
          console.log('Unknown reason for scan cancellation');
          navigation.goBack();
        }
      }

    }
  }, [setCard, setRecentAction]);

  const checkCompatible = useCallback(async () => {
    const isCompatible = await Cardscan.isSupportedAsync();
    setCompatible(isCompatible);
  }, [setCompatible]);

  useEffect(() => {
    checkCompatible();
  }, []);


  const onPressLeft = () => {
    navigation.goBack();
  };

  const onPressCapture = () => {
    navigation.navigate('AddPayment');
  };

  const HeaderLayout = () => {
    return (
      <View style={styles.headerContainer}>
        <Text style={[CommonStyle.text24_inter_m, {color: Theme.white, letterSpacing: -0.17}]}>
          1/2
        </Text>
        <Text style={[CommonStyle.text16_inter_m, {
          color: Theme.white,
          textAlign: 'center',
          lineHeight: 24,
          letterSpacing: 0.17,
          paddingTop: 15,
        }]}>
          {'Place and photograph the face\nof your card'}
        </Text>
      </View>
    );
  };

  const CaptureButton = () => {
    return (
      <TouchableOpacity style={styles.btnContainer}
                        onPress={onPressCapture}
      >
        <View style={styles.btnCircle}/>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden={false} translucent={true} backgroundColor={'transparent'}/>

      {/*<TopNavHeader onPressLeft={onPressLeft} leftIcon={Theme.arrow_left} title={'Scan card'}/>*/}

      {/*{HeaderLayout()}*/}

      {/*<View style={[CommonStyle.center, {flex: 1}]}>*/}
      {/*  <Image source={Theme.card_frame} style={styles.card}/>*/}
      {/*</View>*/}

      {/*{CaptureButton()}*/}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(180,180,180)',
  },
  headerContainer: {
    marginTop: 47,
    alignItems: 'center',
  },
  btnContainer: {
    marginBottom: 45,
    borderRadius: 78 / 2,
    width: 78,
    height: 78,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.33)',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  btnCircle: {
    borderRadius: 64 / 2,
    width: 64,
    height: 64,
    backgroundColor: '#ffffff',
  },
  card: {
    width: WINDOW_WIDTH * 0.7,
    height: (WINDOW_WIDTH * 0.7) * 0.6527,
    resizeMode: 'contain',
  },
});

export default ScanCardScreen;
