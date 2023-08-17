import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import Toast from 'react-native-toast-message';
import {Theme} from '../../../styles/theme';
import {PADDING_HOR, WINDOW_WIDTH} from '../../../styles/constant';
import {navigation} from '../../../routes/navigation';
import TopNavHeader from '../../../components/top-nav-header';
import MainButton from '../../../components/main-button';
import {creditText, validDateText} from '../../../styles/global';
import InputReveelCard from '../../../components/input-trupaid-card';
import {useDispatch, useSelector} from 'react-redux';
import {setPaymentSource} from '../../../redux/actions/apto';
import {
  addPaymentSources,
} from '../../../utils/ApiAptoKit';

var valid = require('card-validator');

const ReveelCardAddNewScreen = () => {
  const dispatch = useDispatch();
  const [cardNumber, setCardNumber] = useState('5200828282828210');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv2, setCVV2] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [cvvIcon, setCvvIcon] = useState(Theme.icon_question_fill);
  const [cvvValid, setCvvValid] = useState(false);
  const [expiryValid, setExpiryValid] = useState(false);
  const [cardNumberValid, setCardNumberValid] = useState(false);
  const [zipCodeValid, setZipCodeValid] = useState(false);
  const [isValid, setValid] = useState(false);

  useEffect(() => {
    setValid(cvvValid && expiryValid && cardNumberValid && zipCodeValid);
  }, [cvvValid, expiryValid, cardNumberValid, zipCodeValid]);

  const onPressLeft = () => {
    navigation.goBack();
  };

  const onChangeCardNumber = (text) => {
    const res = valid.number(text);
    setCardNumberValid(res?.isValid);
    setCardNumber(creditText(text));
  };

  const onChangeZipCode = (text) => {
    setZipCode(text);
    const res = valid.postalCode(text);
    setZipCodeValid(res?.isValid);
  };

  const onChangeExpiry = (text) => {
    const res = valid.expirationDate(text);
    setExpiryValid(res?.isValid);
    setExpiryDate(validDateText(text));
  };

  const onChangeCvv = (text) => {
    const res = valid.cvv(text);
    setCvvValid(res?.isValid);
    setCVV2(text);
  };

  const onPressAddCard = async () => {
    const cardInfo = {
      pan: cardNumber,
      exp_date: `20${expiryDate.split('/')[1]}-${expiryDate.split('/')[0]}`,
      cvv: cvv2,
      postal_code: zipCode,
      last_four: cardNumber.substring(cardNumber.length - 4),
    };

    console.log(cardInfo)
    try {
      const res = await addPaymentSources(cardInfo)
      console.log(JSON.stringify(res.data, 'paymentsource'))
      
      if (resBalance.data.payment_source?.id) {
        dispatch(setPaymentSource(res.data.payment_source));
        navigation.navigate('ReveelCardAddMoney');
      } else {
        Toast.show({
          type: 'toast_custom_type',
          text1: '',
          text2: 'Unable to create payment source',
          visibilityTime: 3000,
        });
      }
      
    } catch (error) {
      let message = '';
      if (error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error.message) {
        message = error.message;
      } else {
        message = 'add new card failed';
      }

      Toast.show({
        type: 'toast_custom_type',
        text1: '',
        text2: message,
        visibilityTime: 3000,
      });
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden={false} translucent={true} backgroundColor={'transparent'}/>

      <TopNavHeader
        leftIcon={Theme.arrow_left}
        title={'Add new card'}
        onPressLeft={onPressLeft}
      />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{flex: 1}}>
        <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>

          <View style={{marginTop: 20}}>
            <InputReveelCard
              header={'Card number'}
              leftIcon={Theme.icon_trupaid_card2}
              rightIcon={Theme.card_trademark}
              value={cardNumber}
              placeholder={'0000 0000 0000 0000'}
              onChangeText={(text) => onChangeCardNumber(text)}
              keyboardType={'numeric'}
              returnKeyType={'done'}
              maxLength={19}
            />
          </View>

          <View style={{flexDirection: 'row', marginTop: 10}}>
            <View style={{flex: 1, marginRight: 9}}>
              <InputReveelCard
                header={'Expiry/validity date'}
                placeholder={'MM/DD'}
                value={expiryDate}
                onChangeText={(text) => onChangeExpiry(text)}
                maxLength={5}
                keyboardType={'numeric'}
                returnKeyType={'done'}
              />
            </View>

            <View style={{flex: 1}}>
              <InputReveelCard
                header={'CVV'}
                placeholder={'000'}
                value={cvv2}
                onChangeText={(text) => onChangeCvv(text)}
                keyboardType={'numeric'}
                maxLength={3}
                rightIcon={cvvIcon}
                rightIconWidth={20}
                rightIconHeight={20}
                returnKeyType={'done'}
              />
            </View>

          </View>

          <View style={{marginTop: 10}}>
            <InputReveelCard
              header={'Zip code'}
              value={zipCode}
              placeholder={'Code here'}
              onChangeText={(text) => onChangeZipCode(text)}
              keyboardType={'numeric'}
              returnKeyType={'done'}
              maxLength={6}
            />
          </View>

        </ScrollView>

        <View style={[styles.btnContainer]}>
          <MainButton
            title={'Add card'}
            isValid={isValid}
            onPress={onPressAddCard}
          />
        </View>
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
  btnContainer: {
    width: WINDOW_WIDTH,
    paddingHorizontal: PADDING_HOR,
    marginBottom: 30,
    paddingTop: 10,
    alignSelf: 'center',
  },
});

export default ReveelCardAddNewScreen;
