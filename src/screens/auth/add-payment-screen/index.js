import React, {useEffect, useState} from 'react';
import {Image, KeyboardAvoidingView, ScrollView, StatusBar, StyleSheet, Text, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {Theme} from '../../../styles/theme';
import {PADDING_HOR, WINDOW_HEIGHT, WINDOW_WIDTH} from '../../../styles/constant';
import {CommonStyle} from '../../../styles';
import MainButton from '../../../components/main-button';
import TopNavHeader from '../../../components/top-nav-header';
import {navigation} from '../../../routes/navigation';
import {creditText, validDateText} from '../../../styles/global';
import InputCardBox from '../../../components/input-card-box';
import {updateBankAccount} from '../../../redux/actions/plaid';
import Toast from 'react-native-toast-message';

var valid = require('card-validator');

const AddPaymentScreen = (props) => {
  const dispatch = useDispatch();
  const bank_accounts = useSelector(state => state?.plaid?.bank_accounts);
  const [account, setAccount] = useState(props?.route?.params?.account);
  const [cardNumber, setCardNumber] = useState('');
  const [card_type, setCardType] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv2, setCVV2] = useState('');
  const [cardIcon, setCardIcon] = useState(Theme.emptycard);
  const [cvvIcon, setCvvIcon] = useState(Theme.icon_question);
  const [bankAccount, setBankAccount] = useState(props?.route?.params?.bankAccount);
  const [cvvValid, setCvvValid] = useState(false);
  const [expiryValid, setExpiryValid] = useState(false);
  const [cardNumberValid, setCardNumberValid] = useState(false);
  const [isValid, setValid] = useState(false);

  useEffect(() => {
    setValid(cvvValid && expiryValid && cardNumberValid);
  }, [cvvValid, expiryValid, cardNumberValid]);

  const onPressLeft = () => {
    navigation.goBack();
  };

  const onChangeCardNumber = (text) => {

    const res = valid.number(text);
    setCardNumberValid(res?.isValid);
    setCardType(res?.card?.type);

    if (res?.card?.type === 'visa') {
      setCardIcon(Theme.visacard);
    } else if (res?.card?.type === 'mastercard') {
      setCardIcon(Theme.mastercard);
    } else {
      setCardIcon(Theme.emptycard);
    }

    setCardNumber(creditText(text));
  };

  const onChangeExpiry = (text) => {
    const res = valid.expirationDate(text);
    setExpiryValid(res?.isValid);
    setExpiryDate(validDateText(text));
  };

  const onChangeCvv = (text) => {
    const res = valid.cvv(text);
    setCvvValid(res?.isValid);

    if (!res?.isValid) {
      setCvvIcon(Theme.icon_question);
    } else {
      setCvvIcon('');
    }

    setCVV2(text);
  };

  // store to redux
  const onPressNext = () => {
    let findIndex = bankAccount?.accounts.findIndex(item => item.accountId === account.accountId);
    const stored_card = {
      cardNumber,
      expiryDate,
      cvv2,
      card_type,
      default_method: false,
    };

    if (findIndex > -1) {
      const newAccount = {
        ...bankAccount?.accounts[findIndex],
        stored_card,
      };
      let accounts = [...bankAccount?.accounts];
      accounts[findIndex] = newAccount;
      const newBankAccount = {
        institution: bankAccount?.institution,
        accounts: accounts,
      };

      findIndex = bank_accounts?.findIndex(item => item.institution?.institutionId === bankAccount?.institution?.institutionId);
      if (findIndex > -1) {
        let newBankAccounts = [...bank_accounts];
        newBankAccounts[findIndex] = newBankAccount;
        dispatch(updateBankAccount(newBankAccounts));
        navigation.goBack();
      } else {
        Toast.show({
          type: 'toast_custom_type',
          text1: '',
          text2: 'Something went wrong',
          visibilityTime: 3000,
        });
        navigation.goBack();
      }
    } else {
      Toast.show({
        type: 'toast_custom_type',
        text1: '',
        text2: 'Something went wrong',
        visibilityTime: 3000,
      });
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden={false} translucent={true} backgroundColor={'transparent'}/>

      <TopNavHeader onPressLeft={onPressLeft} leftIcon={Theme.arrow_left} title={'Add new card'}/>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{flex: 1}}>

        <ScrollView style={styles.body}
                    showsVerticalScrollIndicator={false}
        >
          <View style={styles.cardDescWrapper}>
            <Image source={Theme.icon_refund} style={{width: 21, height: 21, resizeMode: 'contain'}}/>
            <Text style={[CommonStyle.text12_inter_r, {paddingLeft: 11}]}>
              Use cards in stores and get cash back!
            </Text>
          </View>

          <View style={[CommonStyle.row, {marginTop: 20}]}>

            <View style={[styles.imgWrapper, {borderWidth: bankAccount?.institution?.logoUri ? 0.5 : 0.5}]}>
              {bankAccount?.institution?.logoUri &&
              <Image source={{uri: bankAccount?.institution?.logoUri}}
                     style={{width: 36, height: 36}}/>}
            </View>

            <Text style={[CommonStyle.text14_inter_m, {paddingLeft: 11}]}>
              Add {bankAccount?.institution?.name ? bankAccount?.institution?.name : ''} Card ending in
              ****{account?.mask}
            </Text>
          </View>

          <View style={{marginTop: 20}}>
            <InputCardBox
              title={'Card number'}
              rightIcon={cardIcon}
              value={cardNumber}
              placeholder={'0000 0000 0000 0000'}
              onChangeText={(text) => onChangeCardNumber(text)}
              keyboardType={'numeric'}
              returnKeyType={'done'}
              maxLength={19}
              warning={cardNumber?.length !== 19 ? 'Enter a 16-digit card number' : ''}
            />
          </View>

          <View style={{flexDirection: 'row', marginTop: 10}}>
            <View style={{flex: 1, marginRight: 9}}>
              <InputCardBox
                title={'Expiry date'}
                placeholder={'MM/DD'}
                value={expiryDate}
                onChangeText={(text) => onChangeExpiry(text)}
                maxLength={5}
                keyboardType={'numeric'}
                returnKeyType={'done'}
              />
            </View>

            <View style={{flex: 1}}>
              <InputCardBox
                title={'CVV'}
                placeholder={'CVV'}
                value={cvv2}
                onChangeText={(text) => onChangeCvv(text)}
                keyboardType={'numeric'}
                maxLength={3}
                // rightIcon={cvvIcon}
                rightIconWidth={18}
                rightIconHeight={18}
                returnKeyType={'done'}
              />

              <Text style={[CommonStyle.text12_inter_r, {color: '#929292', paddingTop: 3}]}>
                The last 3 digits on the back of the card
              </Text>
            </View>

          </View>

          <View style={{height: 40}}/>

        </ScrollView>

      </KeyboardAvoidingView>
      <View style={styles.btnContainer}
      >
        <MainButton
          title={'Add card'}
          isValid={isValid}
          onPress={onPressNext}
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
  btnContainer: {
    width: WINDOW_WIDTH,
    paddingHorizontal: PADDING_HOR,
    marginBottom: 30,
    paddingTop: 10,
    alignSelf: 'center',
  },
  cardDescWrapper: {
    height: 58,
    borderRadius: 8,
    backgroundColor: '#E0F9E8',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  imgWrapper: {
    width: 36,
    height: 36,
    borderRadius: 55,
    borderColor: '#FFC3BD',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
});

export default AddPaymentScreen;
