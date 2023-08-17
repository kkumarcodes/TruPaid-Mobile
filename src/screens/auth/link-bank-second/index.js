import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Image, StatusBar, Text, TouchableOpacity, Platform} from 'react-native';
import {Theme} from '../../../styles/theme';
import {PADDING_HOR, WINDOW_WIDTH} from '../../../styles/constant';
import {CommonStyle} from '../../../styles';
import MainButton from '../../../components/main-button';
import TopNavHeader from '../../../components/top-nav-header';
import {navigation} from '../../../routes/navigation';
import {setApiLoading} from '../../../redux/actions/config';
import ApiPlaidKit from '../../../utils/ApiPlaidKit';
import {useDispatch} from 'react-redux';
import PlaidLinkScreen from '../choose-account/PlaidLink';
import Toast from 'react-native-toast-message';
import {useLazyQuery, useQuery} from '@apollo/client';
import {GET_PLAID_LINK_TOKEN, MY_RECEIPTS_QUERY} from '../../../utils/Query';

const LinkBankSecondScreen = () => {
  const dispatch = useDispatch();
  const [linkToken, setLinkToken] = useState(null);
  const {data: plaidLinkTokenData, loading, error} = useQuery(GET_PLAID_LINK_TOKEN, {
      ...Platform.select({
        android: {
          variables: {
            'packageName': 'com.trupaiddevapp',
          },
        },
      }),
    },
  );

  useEffect(() => {
    setLinkToken(plaidLinkTokenData?.getPlaidLinkToken?.linkToken);
    console.log(plaidLinkTokenData?.getPlaidLinkToken?.linkToken);
  }, [plaidLinkTokenData]);

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

  const onPressLater = () => {

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
        <Text style={[CommonStyle.text20_inter_m, {color: Theme.black, paddingTop: 26}]}>
          Link your bank to Plaid
        </Text>

        <View style={[CommonStyle.row_bw]}>
          <View style={styles.imgWrapper}>
            <Image source={Theme.icon_card_ver} style={styles.imgHome}/>
          </View>

          <View style={[CommonStyle.row_bw]}>
            <Image source={Theme.dotline1} style={[styles.dotline, {marginLeft: 10}]}/>
            <View style={styles.plaidWrapper}>
              <Image source={Theme.plaid_mark} style={styles.plaidMark}/>
            </View>
            <Image source={Theme.dotline2} style={[styles.dotline, {marginRight: 10}]}/>
          </View>
          <View style={[styles.imgWrapper, {borderColor: '#A4D6B8'}]}>
            <Image source={Theme.icon_home} style={[styles.imgHome, {tintColor: 'rgba(101, 186, 135, 0.59)'}]}/>
          </View>
        </View>

        <Text style={styles.desc}>
          {'Reveel uses Plaid to link your bank\n account. By linking your bank, Plaid will\n have access to your login detail and data\n collected from your accounts and will share\n your data with Reveel app'}
        </Text>

      </View>

      {linkToken &&
      <View style={{flex: 0.1, flexDirection: 'column-reverse', paddingHorizontal: PADDING_HOR}}>
        <PlaidLinkScreen linkToken={linkToken}/>
      </View>
      }

      <View style={styles.btnContainer}>
        {!linkToken &&
        <MainButton
          onPress={onPressNext}
          title={'Add bank account'}
          isValid={true}
        />
        }

        <Text style={[CommonStyle.text12_inter_r, {color: Theme.greyDarkMedium, textAlign: 'center', marginTop: 10}]}>
          By selecting "continue" you agree to the {' '}
          {/*</Text>*/}
          {/*<Text style={[CommonStyle.text12_inter_r, {color: Theme.greyDarkMedium, textAlign: 'center'}]}>*/}
          <TouchableOpacity>
            <Text style={[CommonStyle.text12_inter_sb, {textDecorationLine: 'underline', textAlign: 'center', top: 4}]}>
              Plaid End User Privacy Policy
            </Text>
          </TouchableOpacity>
          {' '} and {' '}
          <TouchableOpacity>
            <Text style={[CommonStyle.text12_inter_sb, {textDecorationLine: 'underline', textAlign: 'center', top: 4}]}>
              SMS terms
            </Text>
          </TouchableOpacity>
        </Text>
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
    marginBottom: 25,
    alignSelf: 'center',
    justifyContent: 'flex-end',
  },
  imgWrapper: {
    width: 78,
    height: 78,
    borderRadius: 55,
    borderColor: '#FFC3BD',
    borderWidth: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 30,
  },
  imgHome: {
    width: 20,
    height: 25,
    resizeMode: 'contain',
  },
  plaidWrapper: {
    width: 74,
    height: 32,
    borderRadius: 32,
    borderWidth: 0.5,
    borderColor: '#9D9D9D',
    justifyContent: 'center',
    alignItems: 'center',
  },
  plaidMark: {
    width: 44,
    height: 17,
    resizeMode: 'contain',
  },
  dotline: {
    width: 20,
    height: 1,
  },
  desc: {
    ...CommonStyle.text14_inter_r,
    color: Theme.greyDarkMedium,
    lineHeight: 20,
    textAlign: 'center',
  },
});

export default LinkBankSecondScreen;
