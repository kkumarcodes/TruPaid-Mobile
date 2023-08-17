import React, {useEffect, useState} from 'react';
import {Image, Platform, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Theme} from '../../../styles/theme';
import {PADDING_HOR, WINDOW_WIDTH} from '../../../styles/constant';
import {CommonStyle} from '../../../styles';
import MainButton from '../../../components/main-button';
import TopNavHeader from '../../../components/top-nav-header';
import {navigation} from '../../../routes/navigation';
import MainOutlineButton from '../../../components/main-outline-button';
import {setApiLoading} from '../../../redux/actions/config';
import {useDispatch, useSelector} from 'react-redux';
import {updateBankAccount} from '../../../redux/actions/plaid';
import {loadHome} from '../../../redux/actions/auth';
import {useMutation} from '@apollo/client';
import {CREATE_PLAID_ITEMS} from '../../../utils/Query';

const AddPaymentMethodScreen = (props) => {
  const dispatch = useDispatch();
  const bank_accounts = useSelector(state => state?.plaid?.bank_accounts);
  const [items, setItems] = useState(props?.route?.params?.items);
  const [createPlaidItems, {data, loading, error}] = useMutation(CREATE_PLAID_ITEMS, {
    variables: {
      'items': items,
    },
  });

  useEffect(() => {
    if (items?.length > 0) {
      dispatch(setApiLoading(true));
      createPlaidItems()
        .then(res => {
          dispatch(setApiLoading(false));

          const plaidItems = res?.data?.createPlaidItems;

          if (Array.isArray(plaidItems) && plaidItems?.length > 0) {
            const bankAccount = {
              institution: plaidItems[0]?.institution,
              accounts: plaidItems[0]?.accounts,
            };
            let newBankAccounts = [...bank_accounts];

            const findIndex = checkInstitution(plaidItems[0]?.institution?.institutionId);

            if (findIndex > -1) { // You have already linked to the back
              newBankAccounts[findIndex] = bankAccount;
              dispatch(updateBankAccount(newBankAccounts));
            } else {
              newBankAccounts.push(bankAccount);
              dispatch(updateBankAccount(newBankAccounts));
            }
          }
        })
        .catch(e => {
          dispatch(setApiLoading(false));
        });
    }
  }, [items]);

  const checkInstitution = (institutionId) => {
    return bank_accounts.findIndex(item => item.institution.institutionId === institutionId);
  };

  const onPressLeft = () => {
    navigation.goBack();
  };

  const onPressNext = () => {
    dispatch(loadHome());
  };

  const onPressLater = () => {
    dispatch(loadHome());
  };

  const DebitCardLayout = (item, index, bankAccount, prevItem) => {
    return (
      <View style={{marginLeft: 3, marginTop: 30, paddingRight: 10}}>
        {index === 0 ?
          <View
            style={{
              position: 'absolute',
              zIndex: 1,
              left: 38 / 2,
              width: 0.5,
              top: -31,
              height: 31,
              backgroundColor: '#C4C4C4',
            }}/>
          :
          <View
            style={{
              position: 'absolute',
              left: 38 / 2,
              width: 0.5,
              backgroundColor: '#C4C4C4',
              zIndex: 1,
              ...Platform.select({
                ios: {
                  top: prevItem?.stored_card?.cardNumber ? -31 : -70,
                  height: prevItem?.stored_card?.cardNumber ? 31 : 70,
                },
                android: {
                  top: prevItem?.stored_card?.cardNumber ? -31 : -74,
                  height: prevItem?.stored_card?.cardNumber ? 31 : 74,
                },
              }),
            }}/>
        }

        {item?.stored_card?.cardNumber ?
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={[styles.cardWrapper]}>
              <Image source={item?.stored_card?.card_type === 'visa' ? Theme.visacard : Theme.mastercard}
                     style={styles.card_active}/>
            </View>

            <TouchableOpacity style={{
              flex: 1,
              paddingLeft: 10,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
                              onPress={() => navigation.navigate('CardSelection', {account: item, bankAccount})}
            >
              <Text style={[CommonStyle.text14_inter_m]}>
                {item?.stored_card?.card_type === 'visa' ? 'Visa' : 'Mastercard'} ****{item?.stored_card?.cardNumber.slice(15, 19)}
              </Text>

              {item?.stored_card?.default_method &&
              <View style={{paddingHorizontal: 10, paddingVertical: 3, borderRadius: 100, backgroundColor: '#E4FBEB'}}>
                <Text style={[CommonStyle.text14_inter_r, {color: '#57AF70'}]}>
                  CURRENT CARD
                </Text>
              </View>
              }
            </TouchableOpacity>
          </View>
          :
          <View style={{flexDirection: 'row'}}>
            <View style={[styles.cardWrapper, {borderWidth: bankAccount?.institution?.logoUri ? 0.5 : 0.5}]}>
              <Image source={Theme.icon_card} style={styles.card}/>
            </View>
            <View style={{flex: 1, paddingLeft: 10}}>
              <Text style={[CommonStyle.text14_inter_m]}>
                Please enter {bankAccount?.institution?.name ? bankAccount?.institution?.name : ''} {item?.name} Card for
                account ending in -{item.mask}
              </Text>
              <TouchableOpacity style={styles.btnWrapper}
                                onPress={() => {
                                  navigation.navigate('AddPayment', {account: item, bankAccount});
                                }}
              >
                <Text style={[CommonStyle.text12_inter_r]}>
                  {/*Enter {bankAccount?.institution?.name ? bankAccount?.institution?.name : ''} Debit Card*/}
                  Enter {item?.name} Card
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        }

      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden={false} translucent={true} backgroundColor={'transparent'}/>

      <TopNavHeader
        title={'Add payment methods'}
        leftIcon={Theme.arrow_left}
        onPressLeft={onPressLeft}
      />

      <View style={styles.body}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={[CommonStyle.text12_inter_m, {color: '#9E9E9E'}]}>
            LINKED BANK ACCOUNTS
          </Text>

          {Array.isArray(bank_accounts) && bank_accounts.map((bankAccount, key) => {
            return (
              <View key={key}>
                {key > 0 && <View style={styles.line}/>}
                <View style={[CommonStyle.row, {marginTop: 30}]}>
                  <View style={[styles.imgWrapper, {borderWidth: bankAccount?.institution?.logoUri ? 0.5 : 0.5}]}>
                    {bankAccount?.institution?.logoUri &&
                    <Image source={{uri: bankAccount?.institution?.logoUri}}
                           style={{width: 44, height: 44}}/>}
                  </View>

                  <Text style={[CommonStyle.text14_inter_m, {paddingLeft: 9}]}>
                    {bankAccount?.institution?.name ? bankAccount?.institution?.name : ''}
                  </Text>
                </View>

                {Array.isArray(bankAccount?.accounts) && bankAccount?.accounts.map((item, index) => {
                  return (
                    <View key={index}>
                      {DebitCardLayout(item, index, bankAccount, index > 0 && bankAccount?.accounts[index - 1])}
                    </View>
                  );
                })}
              </View>
            );
          })}

          <View style={{height: 30}}/>
        </ScrollView>


        <View style={styles.btnContainer}>
          <MainButton
            onPress={onPressNext}
            title={'Add bank account'}
            isValid={true}
          />
          <MainOutlineButton
            onPress={onPressLater}
            title={'About bank account later'}
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
  body: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: Theme.white,
    paddingHorizontal: PADDING_HOR,
  },
  btnContainer: {
    width: WINDOW_WIDTH,
    paddingHorizontal: PADDING_HOR,
    marginBottom: 25,
    alignSelf: 'center',
    justifyContent: 'flex-end',
  },
  imgWrapper: {
    width: 44,
    height: 44,
    borderRadius: 55,
    borderColor: '#FFC3BD',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  card: {
    width: 18,
    height: 15,
    resizeMode: 'contain',
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
    zIndex: 100,
  },
  btnWrapper: {
    marginTop: 10,
    alignSelf: 'flex-start',
    height: 34,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: Theme.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  line: {
    marginTop: 30,
    height: 1,
    width: '100%',
    backgroundColor: 'rgba(196, 196, 196, 0.4)',
  },
});

export default AddPaymentMethodScreen;
