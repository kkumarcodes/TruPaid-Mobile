import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Image, StatusBar, Text} from 'react-native';
import {Theme} from '../../../styles/theme';
import {PADDING_HOR, WINDOW_WIDTH} from '../../../styles/constant';
import {CommonStyle} from '../../../styles';
import TopNavHeader from '../../../components/top-nav-header';
import {navigation} from '../../../routes/navigation';
import {useDispatch, useSelector} from 'react-redux';
import Toast from 'react-native-toast-message';
import {updateBankAccount} from '../../../redux/actions/plaid';
import CustomSwitch from '../../../components/custom-switch';

const CardSelectionScreen = (props) => {
  const dispatch = useDispatch();
  const bank_accounts = useSelector(state => state?.plaid?.bank_accounts);
  const [account, setAccount] = useState(props?.route?.params?.account);
  const [bankAccount, setBankAccount] = useState(props?.route?.params?.bankAccount);

  useEffect(() => {

  }, []);

  const onPressLeft = () => {
    navigation.goBack();
  };

  const onPressNext = () => {
    Toast.show({
      type: 'toast_custom_type',
      text1: '',
      text2: 'something error to get link token',
      visibilityTime: 3000,
    });
  };

  const onPressSwitch = () => {
    let findIndex = bankAccount?.accounts.findIndex(item => item.accountId === account.accountId);

    if (findIndex > -1) {
      const stored_card = {
        ...bankAccount?.accounts[findIndex]?.stored_card,
        default_method: !bankAccount?.accounts[findIndex]?.stored_card?.default_method,
      };

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
        setBankAccount(newBankAccount);
        setAccount(newAccount);
        dispatch(updateBankAccount(newBankAccounts));
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

      <TopNavHeader
        title={'Card Selection'}
        leftIcon={Theme.arrow_left}
        onPressLeft={onPressLeft}
      />

      <View style={styles.body}>

        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View style={[styles.cardWrapper, {borderWidth: bankAccount?.institution?.logo ? 0 : 0}]}>
            <Image source={account?.stored_card?.card_type === 'visa' ? Theme.visacard : Theme.mastercard}
                   style={styles.card_active}/>
          </View>

          <View style={{flex: 1, paddingLeft: 10}}>
            <Text style={[CommonStyle.text14_inter_m]}>
              {account?.stored_card?.card_type === 'visa' ? 'Visa' : 'Mastercard'} ****{account?.stored_card?.cardNumber.slice(15, 19)}
            </Text>
          </View>
        </View>

        <Text style={[CommonStyle.text14_inter_m, {color: '#7E7E7E', paddingTop: 20}]}>
          Cashless payment from your bank card account
        </Text>

        <CustomSwitch
          title={'Default payment method'}
          locked={account.stored_card.default_method}
          type={1}
          onPressItem={onPressSwitch}>
        </CustomSwitch>
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
    paddingTop: 20,
    backgroundColor: Theme.white,
    paddingHorizontal: PADDING_HOR,
  },
  card_active: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
  },
  cardWrapper: {
    width: 38,
    height: 38,
    borderRadius: 55,
    borderColor: '#F3F3F3',
    backgroundColor: '#F3F3F3',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default CardSelectionScreen;
