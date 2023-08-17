import React, {Component, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity, Text, Image,
} from 'react-native';
import {CommonStyle} from '../../styles';
import {Theme} from '../../styles/theme';
import {PADDING_HOR} from '../../styles/constant';
import TimeAgo from '@andordavoti/react-native-timeago';
import {numberWithCommas} from '../../styles/global';
import {useSelector} from 'react-redux';
import moment from 'moment';

const MyReceiptCard = (props) => {
  const item = props?.item;
  const myProfile = props?.myProfile;
  const [initStart, setInitStart] = useState(false);
  // const isPost = item?.visibility === 'public' || item?.shareTransaction === 2;
  const isPost = item?.newestPost?.id || item?.shareTransaction === 2;
  const secure_url = item?.newestPost?.image?.cloudinaryData?.secure_url;
  const user_info = useSelector(state => state?.auth?.user_info);
  const [myUserId, setMyUserId] = useState(user_info?.session?.identity?.id);

  useEffect(() => {

    if (item?.timestamp) {
      setTimeout(() => {
        setInitStart(true);
      }, 100);
    } else {
      setInitStart(false);
    }

  }, [item?.timestamp]);

  const onPressItem = () => {
    if (isPost) {
      props?.onPressItem(item);
    }
  };

  const onPressBuyingClub = () => {
    const postId = item?.newestPost?.id;
    if (myUserId === item?.user?.id) {
      return;
    }

    if (postId) {
      props?.onPressBuyingClub(postId);
    }
  };

  const onPressCancel = () => {
    props?.onPressCancel(item);
  };

  const CardInfoLayout = () => {
    return (
      <View style={[CommonStyle.row_bw, {paddingTop: 16}]}>
        {item?.newestPost?.id ?
          <View style={[CommonStyle.row, {flex: 1}]}>
            <TouchableOpacity style={[styles.cardWrapper, {backgroundColor: Theme.greyShopCart}]}
                              activeOpacity={myUserId === item?.user?.id ? 1 : 0.5}
                              onPress={() => onPressBuyingClub()}
            >
              <Image source={Theme.icon_cart_yellow} style={styles.card}/>
            </TouchableOpacity>
            <View style={{paddingLeft: 8}}>
              <Text style={CommonStyle.text12_inter_r}>
                {numberWithCommas(item?.newestPost?.pendingDemand)}
              </Text>
            </View>
          </View>
          : <View style={[CommonStyle.row, {flex: 1}]}>
            <View style={[styles.cardWrapper, {backgroundColor: Theme.greyShopCart}]}>
              <Image source={Theme.icon_cart_yellow} style={styles.card}/>
            </View>
            <View style={{paddingLeft: 8}}>
              <Text style={CommonStyle.text12_inter_r}>
                {numberWithCommas(0)}
              </Text>
            </View>
          </View>
        }

        {item?.newestPost?.id ?
          <View style={[CommonStyle.row, {flex: 1}]}>
            <View style={[styles.cardWrapper, {backgroundColor: Theme.greyShopCart}]}>
              <Image source={Theme.icon_card} style={styles.card}/>
            </View>
            <View style={{paddingLeft: 8}}>
              <Text style={CommonStyle.text12_inter_r}>
                {numberWithCommas(item?.newestPost?.influencedPurchases)}
              </Text>
            </View>
          </View>
          :
          <View style={[CommonStyle.row, {flex: 1}]}>
            <View style={[styles.cardWrapper, {backgroundColor: Theme.greyShopCart}]}>
              <Image source={Theme.icon_card} style={styles.card}/>
            </View>
            <View style={{paddingLeft: 8}}>
              <Text style={CommonStyle.text12_inter_r}>
                {numberWithCommas(0)}
              </Text>
            </View>
          </View>
        }

        {item?.newestPost?.id ?
          <View style={[CommonStyle.row, {flex: 1}]}>
            {item?.newestPost?.description ?
              <View style={CommonStyle.row}>
                <View style={[styles.cardWrapper, {backgroundColor: Theme.greyShopCart, marginRight: 8}]}>
                  <Image source={Theme.icon_message} style={styles.card}/>
                </View>

                <View>
                  {secure_url ?
                    <View style={[styles.cardWrapper, {width: 20, height: 20}]}>
                      <Image
                        source={secure_url ? {uri: secure_url} : Theme.card_frame1}
                        style={{width: 20, height: 20, resizeMode: 'cover'}}/>
                    </View>
                    : null
                  }
                </View>
              </View>
              : <View>
                {secure_url ?
                  <View style={[styles.cardWrapper, {backgroundColor: Theme.greyShopCart}]}>
                    <Image
                      source={secure_url ? {uri: secure_url} : Theme.card_frame1}
                      style={{width: 34, height: 34, resizeMode: 'cover'}}/>
                  </View>
                  : null
                }
              </View>
            }
          </View>
          : <View style={[CommonStyle.row, {flex: 1}]}/>}

        {(Array.isArray(item?.brand?.deals) && item?.brand?.deals?.length > 0 && item?.brand?.deals[0]?.rewardValue > 0) ?
          <View style={[styles.discountWrapper, {width: 60}]}>
            <Image source={Theme.icon_cashback} style={styles.card}/>
            <View style={{paddingLeft: 0}}>
              <Text style={[CommonStyle.text12_inter_m, {color: '#F44336'}]}>
                {item?.brand?.deals[0]?.rewardType === 'PERCENT' ?
                  `${numberWithCommas(item?.brand?.deals[0]?.rewardValue)}%`
                  : `$${numberWithCommas(item?.brand?.deals[0]?.rewardValue)}`
                }
              </Text>
            </View>
          </View>
          : <View style={{width: 60}}/>
        }
      </View>
    );
  };

  const ShareButtonLayout = () => {
    return (
      <View style={[CommonStyle.row, CommonStyle.center, {paddingTop: 16}]}>
        <View style={[styles.shareButtonContainer]}>
          <Text style={[CommonStyle.text12_inter_r, {paddingRight: 10}]}>
            Swipe to share with followers
          </Text>
          <Image source={Theme.icon_finger} style={styles.imgFinger}/>
        </View>
      </View>
    );
  };

  const JustPostedLayout = () => {
    return (
      <View style={styles.postedContainer}>
        <View style={CommonStyle.row}>
          <Image source={Theme.icon_check_pink} style={styles.imgCheck}/>
          <Text style={[CommonStyle.text14_inter_r, {paddingLeft: 10, color: Theme.greyDark}]}>
            Transaction has been posted
          </Text>
        </View>

        {/*<View style={{position: 'absolute', top: 5, right: PADDING_HOR}}>*/}
        {/*  <TouchableOpacity style={{paddingVertical: 5, paddingLeft: 20}}>*/}
        {/*    <Text style={[CommonStyle.text14_inter_r, {paddingRight: 10}]}>*/}
        {/*      Ok*/}
        {/*    </Text>*/}
        {/*  </TouchableOpacity>*/}

        {/*</View>*/}

        <TouchableOpacity style={{paddingVertical: 5, paddingLeft: 20}}
                          onPress={onPressCancel}
        >
          <Text style={[CommonStyle.text14_inter_r, {paddingRight: 10}]}>
            Cancel
          </Text>
        </TouchableOpacity>

      </View>
    );
  };

  return (
    <View style={styles.container}>
      {item?.shareTransaction === 1 ? JustPostedLayout()
        :
        <TouchableOpacity style={[CommonStyle.row_bw, {}]} onPress={onPressItem} activeOpacity={isPost ? 0.7 : 1}>
          <View style={CommonStyle.row}>
            <View>
              <View style={styles.profileWrapper}>
                {item?.brand?.thumbnailUrl ?
                  <Image source={{uri: item?.brand?.thumbnailUrl}} style={styles.profile}/>
                  : null
                }
              </View>
              <View style={styles.shopCheck}>
                <Image source={Theme.icon_check_w} style={styles.iconCheck}/>
              </View>
            </View>

            <View style={{paddingLeft: 10}}>
              <Text style={CommonStyle.text12_inter_m}>
                {myProfile?.firstName} {myProfile?.lastName}
              </Text>
              {initStart ?
                <View style={{paddingTop: 5}}>
                  <TimeAgo dateTo={moment(item?.timestamp).toDate()} updateInterval={10000}
                           style={[CommonStyle.text11_inter_r, {color: Theme.grey}]}/>
                </View>
                : null
              }
            </View>
          </View>

          <View style={{marginTop: -20}}>
            <Text style={[CommonStyle.text12_inter_m, {color: Theme.grey}]}>
              {'Shopped at '}
              <Text style={CommonStyle.text12_inter_sb}>
                {item?.brand?.name}
              </Text>
            </Text>
          </View>
        </TouchableOpacity>
      }

      {/*{(item?.shareTransaction === 0 && item?.visibility === 'private') ? ShareButtonLayout() :*/}
      {!item?.newestPost?.id ? ShareButtonLayout() :
        isPost ? CardInfoLayout() : null
      }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Theme.white,
    borderBottomColor: 'rgba(196, 196, 196, 0.15)',
    borderBottomWidth: 1,
    paddingHorizontal: PADDING_HOR,
    paddingVertical: 16,
  },
  profileWrapper: {
    width: 45,
    height: 45,
    backgroundColor: Theme.white,
    borderRadius: 6,
    borderWidth: 0.7,
    // borderColor: 'rgba(196, 196, 196, 0.15)',
    borderColor: 'rgba(196, 196, 196, 0.4)',
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
  shareButtonContainer: {
    ...CommonStyle.row_bw,
    backgroundColor: 'rgba(122, 122, 122, 0.05)',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  imgFinger: {
    width: 16,
    height: 16,
    resizeMode: 'contain',
  },
  imgCheck: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  postedContainer: {
    height: 130,
    backgroundColor: '#F8F8F8',
    marginHorizontal: -PADDING_HOR,
    marginVertical: -16,
    ...CommonStyle.row_bw,
    paddingHorizontal: PADDING_HOR,
  },
});

export default MyReceiptCard;
