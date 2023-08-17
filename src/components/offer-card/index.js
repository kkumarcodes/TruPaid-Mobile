import React, {Component, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import {Theme} from '../../styles/theme';
import {CommonStyle} from '../../styles';
import FastImage from 'react-native-fast-image';
import {numberWithCommas} from '../../styles/global';

const OfferCard = (props) => {

  const [item, setItem] = useState(props?.item);

  const onPressItem = (item) => {
    // navigation.navigate('ProductDetail', {item})
    // props?.onPressItem(item, props?.products);
  };

  return (
    <View style={[styles.container, {width: props?.width, height: props?.width * 0.95}]}>
      <TouchableOpacity onPress={() => onPressItem(item)}
                        activeOpacity={0.8}
                        style={styles.cardContainer}
      >
        {item?.rewardValue > 0 ?
          <View style={[styles.discountWrapper]}>
            <Image source={Theme.icon_cashback} style={styles.card}/>
            <View style={{paddingLeft: 0}}>
              <Text style={[CommonStyle.text12_inter_m, {color: '#F44336'}]}>
                {item?.rewardType === 'PERCENT' ?
                  `${numberWithCommas(item?.rewardValue)}%`
                  : `$${numberWithCommas(item?.rewardValue)}`
                }
              </Text>
            </View>
          </View>
          : null}

        <View style={[CommonStyle.center, {height: props?.width * 0.95 - 40}]}>
          {item?.brand?.thumbnailUrl ?
            <FastImage
              // source={{uri: props?.item?.src ? props?.item?.src + '' : 'http'}}
              source={{uri: item?.brand?.thumbnailUrl}}
              style={{width: props?.width * 0.5, aspectRatio: 2.04, resizeMode: 'contain'}}
            />
            : null
          }
        </View>

        <View style={styles.bottomCardWrapper}>

          <View style={[CommonStyle.row_bw]}>
            <View style={[CommonStyle.row, {flex: 1, paddingLeft: 13}]}>
              <View style={[styles.cardWrapper, {backgroundColor: Theme.greyShopCart}]}>
                <Image source={Theme.icon_cart_yellow} style={styles.card}/>
              </View>
              <View style={{paddingLeft: 5}}>
                <Text style={CommonStyle.text11_inter_r}>
                  {numberWithCommas(item?.activations)}
                </Text>
              </View>
            </View>

            <View style={[CommonStyle.row, {flex: 1, paddingLeft: 10}]}>
              <View style={[styles.cardWrapper, {backgroundColor: Theme.greyShopCart}]}>
                <Image source={Theme.icon_card} style={styles.card}/>
              </View>
              <View style={{paddingLeft: 5}}>
                <Text style={CommonStyle.text11_inter_r}>
                  {numberWithCommas(item?.redemptions)}
                </Text>
              </View>
            </View>
          </View>
        </View>

      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 10,
    overflow: 'hidden',
  },
  cardContainer: {
    flex: 1,
    backgroundColor: Theme.white,
    borderRadius: 10,

    shadowColor: '#777',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    marginHorizontal: 1,
    marginTop: 1,
    marginBottom: 2,
  },
  discountWrapper: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
    zIndex: 10,
    backgroundColor: 'rgba(255, 150, 140, 0.06)',
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  card: {
    width: 12,
    height: 12,
    resizeMode: 'contain',
  },
  bottomCardWrapper: {
    height: 40,
    borderTopWidth: 1,
    borderTopColor: 'rgba(196, 196, 196, 0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardWrapper: {
    width: 22,
    height: 22,
    backgroundColor: '#FCF9F3',
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
});

export default OfferCard;
