import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {View, StyleSheet, StatusBar, Text, Image} from 'react-native';
import {Theme} from '../../../styles/theme';
import {
  PADDING_HOR,
  WINDOW_HEIGHT,
  WINDOW_WIDTH,
} from '../../../styles/constant';
import {navigation} from '../../../routes/navigation';
import LinearGradient from 'react-native-linear-gradient';
import {CommonStyle} from '../../../styles';
import MainButton from '../../../components/main-button';

const CARD_NUMBER = ['XXXX', 'XXXX', 'XXXX'];
const AptoSuccessScreen = () => {
  const issueCard = useSelector(state => state?.apto?.issueCard);

  const onPressOk = () => {
    navigation.navigate('ReveelCardManagement');
  };

  const CardNumber = lastNumber => {
    return (
      <View style={[CommonStyle.row_bw, {paddingRight: 10}]}>
        {CARD_NUMBER.map((number, key) => {
          return (
            <Text
              key={key}
              style={{
                fontFamily: 'Oxanium-Medium',
                fontSize: 23,
                color: Theme.black,
                letterSpacing: 3,
              }}>
              {number}
            </Text>
          );
        })}
        <Text
          style={{
            fontFamily: 'Oxanium-Medium',
            fontSize: 23,
            color: Theme.black,
            letterSpacing: 3,
          }}>
          {lastNumber}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar
        hidden={true}
        translucent={true}
        backgroundColor={'transparent'}
      />

      <View style={styles.body}>
        <View
          style={[
            styles.cardWrapper,
            {marginTop: 100, paddingHorizontal: PADDING_HOR},
          ]}>
          <LinearGradient
            start={{x: 0, y: 1}}
            end={{x: 1.0, y: 1.0}}
            locations={[0, 1]}
            colors={['#f6e6e4', '#e6d4d3']}
            style={styles.cardReveel}>
            <View style={styles.cardInner}>
              <View style={[CommonStyle.row_bw]}>
                <View>
                  <Image source={Theme.icon_card_r} style={styles.cardR} />
                </View>
                <View style={styles.settingWrapper}>
                  <Image
                    source={Theme.icon_setting}
                    style={styles.iconSetting}
                  />
                </View>
              </View>

              <View>{CardNumber(issueCard?.last_four)}</View>

              <View style={CommonStyle.row_bw}>
                <View>
                  <Text style={CommonStyle.text16_inter_m}>
                    {`${issueCard?.cardholder_first_name} ${issueCard?.cardholder_last_name}`}
                  </Text>
                  <View style={CommonStyle.row}>
                    <Text
                      style={[CommonStyle.text12_inter_m, {letterSpacing: 1}]}>
                      EXP {issueCard?.expiration || ''}
                    </Text>
                    <Text
                      style={[
                        CommonStyle.text12_inter_m,
                        {paddingLeft: 20, paddingTop: 5, letterSpacing: 1},
                      ]}>
                      CVV {issueCard?.cvv || ''}
                    </Text>
                  </View>
                </View>

                <View>
                  <Image
                    source={Theme.card_trademark}
                    style={styles.tradeMark}
                  />
                </View>
              </View>
            </View>
          </LinearGradient>
        </View>

        <View
          style={{
            flex: 1,
            marginTop: WINDOW_HEIGHT * 0.05,
            backgroundColor: Theme.white,
          }}>
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Image
              source={Theme.icon_check_green}
              style={{
                marginTop: -30,
                width: 28,
                height: 28,
                resizeMode: 'contain',
              }}
            />

            <Text style={[CommonStyle.text22_inter_sb, {paddingTop: 15}]}>
              Congratulation!
            </Text>

            <Text
              style={[
                CommonStyle.text15_inter_r,
                {color: Theme.greyDark, paddingTop: 8},
              ]}>
              Your Reveel Card has been issued!
            </Text>
          </View>

          <View style={styles.btnContainer}>
            <MainButton onPress={onPressOk} title={'OK'} isValid={true} />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.greyShopCart,
  },
  body: {
    flex: 1,
  },
  cardWrapper: {
    width: WINDOW_WIDTH - PADDING_HOR * 2,
    height: (WINDOW_WIDTH - PADDING_HOR * 2) * 0.519,
  },
  cardReveel: {
    width: WINDOW_WIDTH - PADDING_HOR * 2,
    height: (WINDOW_WIDTH - PADDING_HOR * 2) * 0.519,
    borderRadius: 12,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    elevation: 8,
    shadowOpacity: 0.2,
    shadowRadius: 12,
    marginBottom: 5,
  },
  cardInner: {
    flex: 1,
    margin: 20,
    justifyContent: 'space-between',
  },
  cardR: {
    width: 22,
    height: 28,
    resizeMode: 'contain',
  },
  settingWrapper: {
    width: 40,
    height: 40,
    borderRadius: 40,
    backgroundColor: Theme.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconSetting: {
    width: 19,
    height: 19,
    resizeMode: 'contain',
  },
  tradeMark: {
    width: 54,
    height: 34,
    resizeMode: 'contain',
  },
  btnContainer: {
    width: WINDOW_WIDTH,
    paddingHorizontal: PADDING_HOR,
    marginBottom: 30,
    paddingTop: 10,
    alignSelf: 'center',
  },
});

export default AptoSuccessScreen;
