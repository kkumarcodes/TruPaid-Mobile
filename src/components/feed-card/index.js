import React, { Component, useEffect, useState } from 'react';
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
import { navigation } from '../../routes/navigation';
import { useSelector } from 'react-redux';
import moment from 'moment';

const FeedCard = (props) => {
  const item = props?.item;
  const user_info = useSelector(state => state?.auth?.user_info);
  const [myUserId, setMyUserId] = useState(user_info?.session?.identity?.id);
  const borderRadius = props?.borderRadius;
  const secure_url = item?.image?.cloudinaryData?.secure_url;
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

  const onPressProfile = () => {
    if (myUserId === item?.user?.id) {
      navigation.navigate('Profile');
    } else {
      navigation.navigate('UserProfile', { item });
    }
  };

  const onPressItem = () => {
    props?.onPressItem(item);
  };

  const onPressBuyingClub = () => {
    const postId = item?.id;
    if (myUserId === item?.user?.id) {
      return;
    }

    if (postId) {
      props?.onPressBuyingClub(postId);
    }
  };

  return (
    <View style={[styles.container, { borderRadius: borderRadius ? borderRadius : 0 }]}>
      <TouchableOpacity style={CommonStyle.row_bw} onPress={onPressItem}>
        <TouchableOpacity onPress={onPressItem}>
          <View style={CommonStyle.row}>
            <View style={styles.profileWrapper}>
              {item?.user?.profile?.image?.cloudinaryData?.secure_url ?
                <Image source={{ uri: item?.user?.profile?.image?.cloudinaryData?.secure_url }} style={styles.profile} />
                : null
              }
            </View>
            <View style={{ paddingLeft: 10 }}>
              <Text style={[CommonStyle.text12_inter_m]}>
                {item?.user?.firstName} {item?.user?.lastName}
              </Text>
              {initStart ?
                <View style={{ paddingTop: 0 }}>
                  <TimeAgo dateTo={moment(item?.updatedAt).toDate()} updateInterval={10000}
                    style={[CommonStyle.text11_inter_r, { color: Theme.greyTimeAgo }]} />
                </View>
                : null
              }
            </View>
          </View>
        </TouchableOpacity>


        <View style={{ marginTop: -20, paddingLeft: 10, flex: 1, alignItems: 'flex-end' }}>
          <Text style={[CommonStyle.text12_inter_r, { color: Theme.greyDark }]} numberOfLines={1}>
            {'Shopped at '}
            <Text style={CommonStyle.text12_inter_sb}>
              {item?.receipt?.brand?.name}
            </Text>
          </Text>
        </View>
      </TouchableOpacity>

      <View style={[CommonStyle.row_bw, { paddingTop: 16 }]}>
        <View style={[CommonStyle.row, { flex: 1 }]}>
          <TouchableOpacity style={[styles.cardWrapper, { backgroundColor: Theme.greyShopCart }]}
            activeOpacity={myUserId === item?.user?.id ? 1 : 0.5}
            onPress={() => onPressBuyingClub()}
          >
            <Image source={Theme.icon_cart_yellow} style={styles.card} />
          </TouchableOpacity>
          <View style={{ paddingLeft: 8 }}>
            <Text style={CommonStyle.text12_inter_r}>
              {numberWithCommas(item?.pendingDemand)}
            </Text>
          </View>
        </View>

        <View style={[CommonStyle.row, { flex: 1 }]}>
          <View style={[styles.cardWrapper, { backgroundColor: Theme.greyShopCart }]}>
            <Image source={Theme.icon_card} style={styles.card} />
          </View>
          <View style={{ paddingLeft: 8 }}>
            <Text style={CommonStyle.text12_inter_r}>
              {numberWithCommas(item?.influencedPurchases)}
            </Text>
          </View>
        </View>

        {item?.id ?
          <View style={[CommonStyle.row, { flex: 1 }]}>
            {item?.description ?
              <View style={CommonStyle.row}>
                <View style={[styles.cardWrapper, { backgroundColor: Theme.greyShopCart, marginRight: 8 }]}>
                  <Image source={Theme.icon_message} style={styles.card} />
                </View>

                <View>
                  {secure_url ?
                    <View style={[styles.cardWrapper, { width: 20, height: 20 }]}>
                      <Image
                        source={secure_url ? { uri: secure_url } : Theme.card_frame1}
                        style={{ width: 20, height: 20, resizeMode: 'cover' }} />
                    </View>
                    : null
                  }
                </View>
              </View>
              : <View>
                {secure_url ?
                  <View style={[styles.cardWrapper, { backgroundColor: Theme.greyShopCart }]}>
                    <Image
                      source={secure_url ? { uri: secure_url } : Theme.card_frame1}
                      style={{ width: 34, height: 34, resizeMode: 'cover' }} />
                  </View>
                  : null
                }
              </View>
            }
          </View>
          : <View style={[CommonStyle.row, { flex: 1 }]} />}

        {(Array.isArray(item?.receipt?.brand?.deals) && item?.receipt?.brand?.deals?.length > 0 && item?.receipt?.brand?.deals[0]?.rewardValue > 0) ?
          <View style={[styles.discountWrapper, { width: 60 }]}>
            <Image source={Theme.icon_cashback} style={styles.card} />
            <View style={{ paddingLeft: 0 }}>
              <Text style={[CommonStyle.text12_inter_m, { color: '#F44336' }]}>
                {item?.receipt?.brand?.deals[0]?.rewardType === 'PERCENT' ?
                  `${numberWithCommas(item?.receipt?.brand?.deals[0]?.rewardValue)}%`
                  : `$${numberWithCommas(item?.receipt?.brand?.deals[0]?.rewardValue)}`
                }
              </Text>
            </View>
          </View>
          : <View style={{ width: 60 }} />
        }
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Theme.white,
    paddingVertical: 16,
    borderBottomColor: 'rgba(196, 196, 196, 0.25)',
    borderBottomWidth: 1,
    height: 121,
  },
  profileWrapper: {
    width: 38,
    height: 38,
    backgroundColor: Theme.white,
    borderRadius: 6,
    borderWidth: 0.7,
    borderColor: 'rgba(196, 196, 196, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  profile: {
    width: 38,
    height: 38,
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
});

export default FeedCard;
