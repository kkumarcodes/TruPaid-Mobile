import React, {useEffect, useState} from 'react';
import {View, StyleSheet, StatusBar, Text, TouchableOpacity, Image, ScrollView} from 'react-native';
import {useDispatch} from 'react-redux';
import {Theme} from '../../../styles/theme';
import {CommonStyle} from '../../../styles';
import {navigation} from '../../../routes/navigation';
import TimeAgo from '@andordavoti/react-native-timeago';
import {PADDING_HOR, WINDOW_WIDTH} from '../../../styles/constant';
import {numberWithCommas} from '../../../styles/global';
import OtherComments from '../../../components/other-comment';
import BasicNavHeader from '../../../components/basic-nav-header';
import {GET_POST_QUERY} from '../../../utils/Query';
import {setApiLoading} from '../../../redux/actions/config';
import ApiGraphqlKit from '../../../utils/ApiGraphqlKit';
import moment from 'moment';

const MyPostDetailScreen = (props) => {
    const dispatch = useDispatch();
    const [postId, setReceiptInfo] = useState(props?.route?.params.postId);
    const [fromOtherUser, setFromOtherUser] = useState(props?.route?.params.fromOtherUser);
    const [postDetailInfo, setPostDetailInfo] = useState(null);

    useEffect(() => {
      getPostDetail(postId);
    }, []);

    const getPostDetail = (postId) => {
      const variables = {
        'id': postId,
      };

      let body = {
        'operationName': null,
        'variables': variables,
        'query': GET_POST_QUERY,
      };

      dispatch(setApiLoading(true));
      ApiGraphqlKit.post('', body).then(res => {
        dispatch(setApiLoading(false));
        console.log('post detail success: ', res?.data?.data);
        setPostDetailInfo(res?.data?.data?.post);
      }).catch(err => {
        console.log('post detail error: ', err?.response?.data);
        dispatch(setApiLoading(false));
      });
    };

    const onPressLeft = () => {
      navigation.goBack();
    };

    const onPressRight = () => {

    };

    const onPressProfile = () => {
      if (fromOtherUser) {
        navigation.navigate('UserProfile', {item: postDetailInfo});
      }
    };

    const MyCommentLayout = () => {
      if (!postDetailInfo?.description) {
        return null;
      }

      return (
        <View style={{paddingHorizontal: PADDING_HOR}}>
          <View style={styles.line}/>
          <View style={{flexDirection: 'row', paddingVertical: PADDING_HOR}}>
            <View style={[styles.profileWrapper, {borderRadius: 38}]}>
              {postDetailInfo?.profile ?
                <Image source={postDetailInfo?.profile ? postDetailInfo?.profile : {uri: 'http'}}
                       style={styles.profile}/>
                : null
              }
            </View>

            <View style={{flex: 1, paddingLeft: 10}}>
              <Text style={[CommonStyle.text12_inter_sb, {lineHeight: 18}]}>
                {postDetailInfo?.user.firstName} {postDetailInfo?.user.lastName}
              </Text>
              <Text style={[CommonStyle.text12_inter_r, {lineHeight: 18, paddingTop: 5}]}>
                {postDetailInfo?.description}
              </Text>
              <View style={{paddingTop: 6}}>
                <TimeAgo dateTo={moment(postDetailInfo?.createdAt).toDate()} updateInterval={10000}
                         style={[CommonStyle.text10_inter_r, {color: Theme.grey, lineHeight: 18}]}/>
              </View>
            </View>
          </View>

        </View>
      );
    };

    const ShopCartLayout = () => {
      return (
        <View style={{paddingHorizontal: PADDING_HOR}}>
          <View style={styles.line}/>

          <View style={[CommonStyle.row_bw, {paddingVertical: PADDING_HOR}]}>
            <View style={[CommonStyle.row, {flex: 1}]}>
              <View style={styles.shopLogoWrapper}>
                {postDetailInfo?.receipt?.brand?.uri ?
                  <Image source={{uri: postDetailInfo?.receipt?.brand?.uri}}
                         style={styles.logo}/>
                  : null}
              </View>
              <View style={{paddingLeft: 8}}>
                <Text style={CommonStyle.text12_inter_m}>
                  {postDetailInfo?.receipt?.brand?.name}
                </Text>
              </View>
            </View>
            <View style={[CommonStyle.row, {flex: 1}]}>
              <View style={[CommonStyle.row, {flex: 1, justifyContent: 'flex-end'}]}>
                <View style={[styles.cardWrapper, {backgroundColor: Theme.greyShopCart}]}>
                  <Image source={Theme.icon_cart_yellow} style={styles.card}/>
                </View>
                <View style={{paddingLeft: 8}}>
                  <Text style={[CommonStyle.text12_inter_r, {color: '#2B2B2B'}]}>
                    {numberWithCommas(postDetailInfo?.pendingDemand)}
                  </Text>
                </View>
              </View>

              <View style={[CommonStyle.row, {flex: 1, justifyContent: 'flex-end'}]}>
                <View style={[styles.cardWrapper, {backgroundColor: Theme.greyShopCart}]}>
                  <Image source={Theme.icon_card} style={styles.card}/>
                </View>
                <View style={{paddingLeft: 8}}>
                  <Text style={[CommonStyle.text12_inter_r, {color: '#2B2B2B'}]}>
                    {numberWithCommas(postDetailInfo?.influencedPurchases)}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      );
    };

    const TransactionPhotoLayout = () => {
      if (!postDetailInfo?.image?.cloudinaryData?.secure_url) {
        return null;
      }

      return (
        <View>
          <Image source={{uri: postDetailInfo?.image?.cloudinaryData?.secure_url}}
                 style={{width: WINDOW_WIDTH, height: WINDOW_WIDTH, resizeMode: 'cover'}}
          />
        </View>
      );
    };

    const ProfileCardLayout = () => {
      return (
        <View style={[CommonStyle.row_bw, {paddingHorizontal: PADDING_HOR, paddingVertical: 12}]}>
          <View style={CommonStyle.row}>
            <TouchableOpacity style={styles.profileWrapper} onPress={onPressProfile}>
              {postDetailInfo?.profile ?
                <Image source={postDetailInfo?.profile ? postDetailInfo?.profile : {uri: 'http'}}
                       style={styles.profile}/>
                : null
              }
            </TouchableOpacity>
            <View style={{paddingLeft: 10}}>
              <Text style={CommonStyle.text12_inter_m}>
                {postDetailInfo?.user?.firstName} {postDetailInfo?.user?.lastName}
              </Text>
              <View style={{paddingTop: 5}}>
                <TimeAgo dateTo={moment(postDetailInfo?.createdAt).toDate()} updateInterval={10000}
                         style={[CommonStyle.text10_inter_r, {color: Theme.grey}]}/>
              </View>
            </View>
          </View>

          <View style={{marginTop: -20}}>
            <Text style={[CommonStyle.text12_inter_r, {color: Theme.greyDark}]}>
              {'Shopped at '}
              <Text style={CommonStyle.text12_inter_m}>
                {postDetailInfo?.receipt?.brand?.name}
              </Text>
            </Text>
          </View>
        </View>
      );
    };

    return (
      <View style={styles.container}>
        <StatusBar hidden={false} translucent={true} backgroundColor={'transparent'}/>

        <BasicNavHeader
          leftIcon={Theme.arrow_left}
          title={postDetailInfo?.user?.firstName + ' ' + postDetailInfo?.user?.lastName}
          rightIcon={Theme.icon_3dots}
          onPressLeft={onPressLeft}
          onPressRight={onPressRight}
        />

        {ProfileCardLayout()}

        <ScrollView style={{flex: 1}}>
          {TransactionPhotoLayout()}
          {ShopCartLayout()}
          {MyCommentLayout()}
          <OtherComments item={postDetailInfo}/>
        </ScrollView>
      </View>
    );
  }
;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.white,
  },
  profileWrapper: {
    width: 38,
    height: 38,
    backgroundColor: Theme.white,
    borderRadius: 6,
    borderWidth: 0.5,
    // borderColor: 'rgba(196, 196, 196, 0.15)',
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
  shopLogoWrapper: {
    width: 34,
    height: 34,
    borderRadius: 6,
    borderColor: Theme.lightGrey,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  logo: {
    width: 34,
    height: 34,
    resizeMode: 'cover',
  },
  myCommentWrapper: {
    padding: PADDING_HOR,
  },
  line: {
    height: 1,
    backgroundColor: 'rgba(196, 196, 196, 0.4)',
  },
});

export default MyPostDetailScreen;
