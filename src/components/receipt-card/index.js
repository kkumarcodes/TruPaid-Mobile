import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity, Text, Image,
} from 'react-native';
import { CommonStyle } from '../../styles';
import { Theme } from '../../styles/theme';
import { PADDING_HOR } from '../../styles/constant';
import TimeAgo from '@andordavoti/react-native-timeago';
import { numberWithCommas } from '../../styles/global';
import moment from 'moment';

const ReceiptCard = (props) => {
  const item = props?.item;
  const [initStart, setInitStart] = useState(false);

  useEffect(() => {

    if (item?.updatedAt) {
      setTimeout(() => {
        setInitStart(true);
      }, 100);
    } else {
      setInitStart(false);
    }

  }, [item?.updatedAt]);

  const onPressItem = () => {
    return;
    props?.onPressItem(item);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={CommonStyle.row_bw} onPress={onPressItem} activeOpacity={1}>
        <View style={CommonStyle.row}>
          <View>
            <View style={styles.profileWrapper}>
              <Image source={{ uri: item?.shop_logo ? item?.shop_logo : 'http' }} style={styles.profile} />

            </View>
            <View style={styles.shopCheck}>
              <Image source={Theme.icon_check_w} style={styles.iconCheck} />
            </View>
          </View>

          <View style={{ paddingLeft: 10 }}>
            <Text style={CommonStyle.text12_inter_m}>
              {item?.shop_name}
            </Text>
            {initStart ?
              <View style={{ paddingTop: 5 }}>
                <TimeAgo dateTo={moment(item?.updatedAt).toDate()} updateInterval={10000}
                  style={[CommonStyle.text11_inter_r, { color: Theme.grey }]} />
              </View>
              : null
            }
          </View>
        </View>

        <View style={{ marginTop: -20 }}>
          <Text style={[CommonStyle.text12_inter_m, { color: Theme.grey }]}>
            {'Shopped at '}
            <Text style={CommonStyle.text12_inter_sb}>
              {item?.shop_name}
            </Text>
          </Text>
        </View>
      </TouchableOpacity>

      <View style={[CommonStyle.row_bw, { paddingTop: 16 }]}>
        <View style={[CommonStyle.row, { flex: 1 }]}>
          <View style={[styles.cardWrapper, { backgroundColor: Theme.greyShopCart }]}>
            <Image source={Theme.icon_cart_yellow} style={styles.card} />
          </View>
          <View style={{ paddingLeft: 8 }}>
            <Text style={CommonStyle.text12_inter_r}>
              {numberWithCommas(item?.cart_point)}
            </Text>
          </View>
        </View>

        <View style={[CommonStyle.row, { flex: 1 }]}>
          <View style={[styles.cardWrapper, { backgroundColor: Theme.greyShopCart }]}>
            <Image source={Theme.icon_card} style={styles.card} />
          </View>
          <View style={{ paddingLeft: 8 }}>
            <Text style={CommonStyle.text12_inter_r}>
              {numberWithCommas(item?.card_point)}
            </Text>
          </View>
        </View>

        <View style={[CommonStyle.row, { flex: 1 }]}>
          {item?.comments ?
            <View style={CommonStyle.row}>
              <View style={[styles.cardWrapper, { backgroundColor: Theme.greyShopCart, marginRight: 8 }]}>
                <Image source={Theme.icon_message} style={styles.card} />
              </View>

              <View>
                {item?.transaction_photo ?
                  <View style={[styles.cardWrapper, { width: 20, height: 20 }]}>
                    <Image source={{ uri: item?.transaction_photo ? item?.transaction_photo : 'http' }}
                      style={{ width: 20, height: 20, resizeMode: 'cover' }} />
                  </View>
                  : null
                }
              </View>
            </View>
            : <View>
              {item?.transaction_photo ?
                <View style={[styles.cardWrapper, { backgroundColor: Theme.greyShopCart }]}>
                  <Image source={{ uri: item?.transaction_photo ? item?.transaction_photo : 'http' }}
                    style={{ width: 34, height: 34, resizeMode: 'cover' }} />
                </View>
                : null
              }
            </View>
          }
        </View>

        {(!item?.discount || item?.discount < 1) ?
          <View style={{ width: 60 }} />
          :
          <View style={[styles.discountWrapper, { width: 60 }]}>
            <Image source={Theme.icon_cashback} style={styles.card} />
            <View style={{ paddingLeft: 0 }}>
              <Text style={[CommonStyle.text12_inter_m, { color: '#F44336' }]}>
                {numberWithCommas(item?.discount)}%
              </Text>
            </View>
          </View>
        }
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Theme.white,
    paddingHorizontal: PADDING_HOR,
    paddingVertical: 16,
    borderBottomColor: 'rgba(196, 196, 196, 0.15)',
    borderBottomWidth: 1,
  },
  profileWrapper: {
    width: 45,
    height: 45,
    backgroundColor: Theme.white,
    borderRadius: 6,
    borderWidth: 0.5,
    borderColor: 'rgba(196, 196, 196, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  profile: {
    width: 45,
    height: 45,
    resizeMode: 'contain',
  },
  cardWrapper: {
    width: 34,
    height: 34,
    backgroundColor: '#FCF9F3',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  card: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
  },
  discountWrapper: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 150, 140, 0.06)',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  shopCheck: {
    position: 'absolute',
    bottom: -3,
    right: -5,
    width: 14,
    height: 14,
    borderRadius: 14,
    borderColor: Theme.white,
    borderWidth: 2,
    backgroundColor: '#63AC9F',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCheck: {
    width: 7,
    height: 5,
    resizeMode: 'contain',
  },
});

export default ReceiptCard;
