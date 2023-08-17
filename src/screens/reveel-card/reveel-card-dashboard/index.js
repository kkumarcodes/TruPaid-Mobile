import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {Theme} from '../../../styles/theme';
import {PADDING_HOR, WINDOW_WIDTH} from '../../../styles/constant';
import LinearGradient from 'react-native-linear-gradient';
import {CommonStyle} from '../../../styles';
import MainButton from '../../../components/main-button';
import {IS_IPHONE_X} from '../../../styles/global';
import {navigation} from '../../../routes/navigation';

const CARD_NUMBER = [
  1672,
  2812,
  1656,
  1928,
];
const ReveelCardDashboardScreen = () => {

  const onPressAddFunds = () => {
    navigation.navigate('ReveelCardManagement');
  };

  const CardNumber = () => {
    return (
      <View style={[CommonStyle.row_bw, {paddingRight: 10}]}>
        {CARD_NUMBER.map((number, key) => {
          return (
            <Text key={key} style={{fontFamily: 'Oxanium-Medium', fontSize: 23, color: Theme.black, letterSpacing: 3}}>
              {number}
            </Text>
          );
        })
        }
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden={false} translucent={true} backgroundColor={'transparent'}/>

      <View style={{flex: 1}}>

        <LinearGradient
          start={{x: 0, y: 0}} end={{x: 1, y: 0}}
          colors={['#EFE8F2', '#F7ECEB']}
          style={styles.linearContainer}
        >
          <View style={styles.titleContainer}>
            <Text style={[CommonStyle.text27_inter_b, {color: Theme.black, paddingVertical: 10, letterSpacing: -0.3}]}>
              {'Reveel card'}
            </Text>
          </View>
        </LinearGradient>

        <ScrollView style={styles.body}
                    showsVerticalScrollIndicator={false}
        >
          <View style={[styles.cardWrapper, {marginVertical: 20, paddingHorizontal: PADDING_HOR}]}>
            <LinearGradient
              start={{x: 0, y: 1}} end={{x: 1.0, y: 1.0}}
              locations={[0, 1]}
              colors={['#FFF', '#FFF']}
              style={styles.cardReveel}
            >
              <View style={styles.cardInner}>
                <View style={[CommonStyle.row_bw]}>
                  <View>
                    <Image source={Theme.icon_card_r} style={styles.cardR}/>
                  </View>
                  <TouchableOpacity
                    style={styles.settingWrapper}
                    onPress={() => navigation.navigate('ReveelCardManagement')}
                  >
                    <Image source={Theme.icon_setting} style={styles.iconSetting}/>
                  </TouchableOpacity>
                </View>

                <View>
                  {CardNumber()}
                </View>

                <View style={CommonStyle.row_bw}>
                  <View>
                    <Text style={[CommonStyle.text12_inter_r, {letterSpacing: 0.5}]}>
                      SERENA WILLIAMS
                    </Text>
                  </View>

                  <View>
                    <Image source={Theme.card_trademark} style={styles.tradeMark}/>
                  </View>

                </View>
              </View>
            </LinearGradient>
          </View>

          <View style={[CommonStyle.row_bw, {paddingHorizontal: PADDING_HOR}]}>
            <View style={[styles.balanceCard]}>
              <Text style={[CommonStyle.text12_inter_r, {color: Theme.grey}]}>
                Cash back balance
              </Text>
              <View style={[CommonStyle.row_bw, {paddingTop: 5}]}>
                <Text style={styles.textBalance}>
                  $ 12,960
                </Text>
                <Image source={Theme.icon_dealfeed_dis} style={styles.iconUnit}/>
              </View>
            </View>

            <View style={{width: 16}}/>

            <View style={[styles.balanceCard]}>
              <Text style={[CommonStyle.text12_inter_r, {color: Theme.grey}]}>
                Funded balance
              </Text>
              <View style={[CommonStyle.row_bw, {paddingTop: 5}]}>
                <Text style={styles.textBalance}>
                  $ 12,960
                </Text>

                <Text style={[CommonStyle.text14_inter_r, {color: '#1FBC8D'}]}>
                  $$$
                </Text>
              </View>
            </View>
          </View>

          <View style={{marginTop: 20, paddingHorizontal: PADDING_HOR}}>
            <View style={[CommonStyle.row_bw]}>
              <Text style={[CommonStyle.text14_inter_sb]}>
                Partners
              </Text>
              <TouchableOpacity>
                <Text style={[CommonStyle.text14_inter_r]}>
                  Show all
                </Text>
              </TouchableOpacity>
            </View>
            <View style={[styles.subwayCard, {marginTop: 10}]}>
              <TouchableOpacity activeOpacity={0.73}>
                <Image source={Theme.subway} style={styles.imgSubway}/>
              </TouchableOpacity>
            </View>
            <View>
              <Image source={Theme.trupaid_card_subway_bar} style={styles.subwayBar}/>
            </View>
          </View>

          <View style={{height: 30}}/>
        </ScrollView>

        <View style={styles.footer}>
          <View style={styles.btnContainer}>
            <MainButton
              onPress={onPressAddFunds}
              title={'Add funds to Reveel Card'}
              isValid={true}
            />
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
    marginTop: -100,
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
    width: 34,
    height: 21,
    resizeMode: 'contain',
  },
  btnContainer: {
    width: WINDOW_WIDTH,
    paddingHorizontal: PADDING_HOR,
    alignSelf: 'center',
  },
  linearContainer: {
    width: WINDOW_WIDTH,
    height: 200,
    borderBottomRightRadius: 22,
    borderBottomLeftRadius: 22,
    paddingHorizontal: PADDING_HOR,
  },
  titleContainer: {
    marginTop: 50,
  },
  footer: {
    alignItems: 'center',
    marginBottom: IS_IPHONE_X ? 100 : 80,
  },
  balanceCard: {
    flex: 1,
    height: 84,
    borderRadius: 6,
    backgroundColor: Theme.white,
    paddingLeft: 20,
    paddingRight: 10,
    justifyContent: 'center',
  },
  iconUnit: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
    tintColor: Theme.primary,
  },
  textBalance: {
    fontFamily: 'Rubik-Regular',
    fontSize: 20,
  },
  subwayCard: {
    height: 97,
    borderRadius: 6,
    backgroundColor: Theme.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imgSubway: {
    width: 106,
    height: 54,
    resizeMode: 'contain',
  },
  subwayBar: {
    width: WINDOW_WIDTH - PADDING_HOR * 2 - 20,
    height: (WINDOW_WIDTH - PADDING_HOR * 2 - 20) * 0.080168,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
});

export default ReveelCardDashboardScreen;
