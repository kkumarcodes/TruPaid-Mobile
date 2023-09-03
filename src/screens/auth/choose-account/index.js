import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Image, StatusBar, Text, TouchableOpacity} from 'react-native';
import {useDispatch} from 'react-redux';
import {Theme} from '../../../styles/theme';
import {PADDING_HOR, WINDOW_HEIGHT, WINDOW_WIDTH} from '../../../styles/constant';
import {CommonStyle} from '../../../styles';
import MainButton from '../../../components/main-button';
import TopNavHeader from '../../../components/top-nav-header';
import {navigation} from '../../../routes/navigation';
import ApiPlaidKit from '../../../utils/ApiPlaidKit';
import {FEED_DEALS} from '../../../utils/Query';
import {setApiLoading} from '../../../redux/actions/config';
import ApiGraphqlKit from '../../../utils/ApiGraphqlKit';
import PlaidLinkScreen from './PlaidLink';
import Toast from 'react-native-toast-message';

const cardArray = [
  {
    id: 1,
    type: 'plaid',
    title: 'Use Plaid',
    desc: 'Use Plaid to link bank account directly to TruPaid',
    image: Theme.icon_plaid,
  },
  {
    id: 1,
    type: 'credit',
    title: 'Credit/Debit',
    desc: 'Link directly using debit or credit card',
    image: Theme.icon_credit,
  },
];

const ChooseAccountScreen = () => {
  const dispatch = useDispatch();
  const [cardType, setCardType] = useState('plaid');
  const [linkToken, setLinkToken] = useState(null);

  useEffect(() => {
    generateToken();
  }, []);

  useEffect(() => {
    // if (linkToken) {
    //   navigation?.navigate('PlaidLink', {linkToken});
    // }
  }, [linkToken]);

  const onPressLeft = () => {
    navigation.goBack();
  };

  const generateToken = async () => {
    let body = {
      'client_user_id': 'custom_syed1',
      'android_package_name': 'com.trupaiddevapp',
    };

    dispatch(setApiLoading(true));
    ApiPlaidKit.post('/api/create_link_token', body).then(res => {
      dispatch(setApiLoading(false));
      console.log('----------- link token -----', res?.data);
      setLinkToken(res?.data?.link_token);
    }).catch(error => {
      dispatch(setApiLoading(false));
      console.log('plaid link token error: ', error);
    });

  };

  const onPressNext = () => {

    if (cardType === 'plaid') {
      Toast.show({
        type: 'toast_custom_type',
        text1: '',
        text2: 'something error to get link token',
        visibilityTime: 3000,
      });
      return;
    }

    // navigation.navigate('ScanCard');

    // return

    let cardInfo = {
      number: '',
      expiryDay: '',
      expiryMonth: '',
      expiryYear: '',
      issuer: '',
      cvc: '',
      cardholderName: '',
      error: '',
    };
    navigation.navigate('AddPayment', {cardInfo});
  };

  const onPressCardItem = (type) => {
    setCardType(type);
  };

  const HeaderLayout = () => {
    return (
      <View style={styles.headerContainer}>
        <Text style={[CommonStyle.text20_inter_m, {textAlign: 'center', lineHeight: 26}]}>
          {'Choose your link\naccount'}
        </Text>
      </View>
    );
  };

  const AccountCard = (item) => {
    return (
      <TouchableOpacity
        style={[styles.accountCardContainer,
          {
            borderColor: cardType === item?.type ? '#FF968C' : '#E8E8E8',
            borderWidth: cardType === item?.type ? 1 : 1,
          },
        ]}
        activeOpacity={0.73}
        onPress={() => onPressCardItem(item?.type)}
      >
        <Image source={item?.image} style={styles.icon}/>
        <View style={{flex: 1, paddingHorizontal: 20}}>
          <Text style={CommonStyle.text18_inter_m}>
            {item?.title}
          </Text>
          <View style={{height: 7}}/>
          <Text style={[CommonStyle.text12_inter_r, {color: Theme.grey, lineHeight: 16}]}>
            {item?.desc}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden={false} translucent={true} backgroundColor={'transparent'}/>

      <TopNavHeader
        title={'Choose your link account'}
        leftIcon={Theme.arrow_left}
        onPressLeft={onPressLeft}
      />

      {/*{HeaderLayout()}*/}

      <View style={styles.body}>

        <View style={{flex: 0.3}}/>

        <View>
          <Text style={[CommonStyle.text14_inter_l, {marginBottom: 14}]}>
            Automatically link your account
          </Text>

          {AccountCard(cardArray[0])}
        </View>

        <View style={styles.line}/>

        <View>
          <Text style={[CommonStyle.text14_inter_l, {marginBottom: 14}]}>
            Manually link your account
          </Text>

          {AccountCard(cardArray[1])}
        </View>

        <View style={styles.btnContainer}>
          {(!linkToken || cardType !== 'plaid') ?

            <MainButton
              onPress={onPressNext}
              title={'Link'}
              isValid={true}
            />
            :
            <PlaidLinkScreen linkToken={linkToken}/>
          }
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
    height: (WINDOW_WIDTH - PADDING_HOR * 2) * 0.58433,
    resizeMode: 'contain',
  },
  accountCardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 26,
    paddingVertical: 20,
    borderRadius: 6,
    // backgroundColor: '#F4F4F4',
    borderColor: '#FF968C',
    borderWidth: 2,
    height: 110,
  },
  icon: {
    width: 38,
    height: 38,
  },
  line: {
    // height: 1,
    // backgroundColor: '#F0F0F0',
    marginVertical: WINDOW_HEIGHT * 0.05,
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

export default ChooseAccountScreen;
