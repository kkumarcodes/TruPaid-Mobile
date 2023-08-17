import React, {useEffect, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {View, StyleSheet, StatusBar, Text, TouchableOpacity, Image, ScrollView} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {Theme} from '../../../styles/theme';
import {CommonStyle} from '../../../styles';
import {navigation} from '../../../routes/navigation';
import TimeAgo from '@andordavoti/react-native-timeago';
import {PADDING_HOR, WINDOW_WIDTH} from '../../../styles/constant';
import {numberWithCommas} from '../../../styles/global';
import BasicNavHeader from '../../../components/basic-nav-header';
import {GET_POST_QUERY, INFLUENCED_BY_QUERY} from '../../../utils/Query';
import {setApiLoading} from '../../../redux/actions/config';
import {useMutation, useQuery} from '@apollo/client';
import Toast from 'react-native-toast-message';
import moment from 'moment';

const PostDetailScreen = (props) => {
    const dispatch = useDispatch();
    const user_info = useSelector(state => state?.auth?.user_info);
    const [myUserId, setMyUserId] = useState(user_info?.session?.identity?.id);
    const [postId, setPostId] = useState(props?.route?.params.postId);
    const [fromOtherUser, setFromOtherUser] = useState(props?.route?.params.fromOtherUser);
    const [postDetailInfo, setPostDetailInfo] = useState(null);
    const [joinBuyingClub, setJoinBuyingClub] = useState(false);
    const [profileImage, setPostUserProfileImage] = useState('');

    const {data: postData, loading, error} = useQuery(GET_POST_QUERY, {
      variables: {'id': postId},
    });

    const [buyingClub, {data: data1, loading: loading1, error: error1}] = useMutation(INFLUENCED_BY_QUERY, {
      variables: {
        'postId': postId,
      },
    });

    // by joining 'Buying Club'
    useEffect(() => {
      if (joinBuyingClub) {
        dispatch(setApiLoading(true));
        buyingClub()
          .then(res => {
            dispatch(setApiLoading(false));
            const pendingDemand = res?.data?.influencedBy?.post?.pendingDemand;
            updatePostDetailInfo(res?.data?.influencedBy?.post);
          })
          .catch(e => {
            dispatch(setApiLoading(false));
            const msg = e.toString();
            console.log(msg);
            if (msg.includes('Error:')) {
              Toast.show({
                type: 'toast_custom_type',
                text1: '',
                text2: e.toString(),
                visibilityTime: 3000,
              });
            }
          });
      }
    }, [joinBuyingClub]);

    useEffect(() => {
      setPostUserProfileImage(postData?.post?.user.profile?.image?.cloudinaryData?.secure_url);
      setPostDetailInfo(postData?.post);
    }, [postData]);

    useEffect(() => {
      dispatch(setApiLoading(loading));
    }, [loading]);

    const updatePostDetailInfo = (selPost) => {
      let newPostDetail = {
        ...postDetailInfo,
        pendingDemand: selPost?.pendingDemand,
      };
      setPostDetailInfo(newPostDetail);
    };

    const onPressLeft = () => {
      navigation.goBack();
    };

    const onPressRight = () => {

    };

    const onPressProfile = () => {
      if (myUserId === postDetailInfo?.user?.id) {
        navigation.navigate('Profile');
      } else {
        navigation.navigate('UserProfile', {item: postDetailInfo});
      }
    };

    const onPressBuyingClub = () => {

      if (myUserId === postDetailInfo?.user?.id) {
        return;
      }

      setJoinBuyingClub(true);
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
              {profileImage ?
                <Image source={{uri: profileImage}}
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

          <View style={[CommonStyle.row_bw, {paddingVertical: PADDING_HOR}]}>
            <View style={[CommonStyle.row, {flex: 1}]}>
              <View style={styles.shopLogoWrapper}>
                {postDetailInfo?.receipt?.brand?.thumbnailUrl ?
                  <Image source={{uri: postDetailInfo?.receipt?.brand?.thumbnailUrl}}
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
                <TouchableOpacity style={[styles.cardWrapper, {backgroundColor: Theme.greyShopCart}]}
                                  activeOpacity={myUserId === postDetailInfo?.user?.id ? 1 : 0.5}
                                  onPress={() => onPressBuyingClub()}
                >
                  <Image source={Theme.icon_cart_yellow} style={styles.card}/>
                </TouchableOpacity>
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
          <TouchableOpacity style={CommonStyle.row} onPress={onPressProfile}>
            <View style={styles.profileWrapper}>
              {profileImage ?
                <Image source={{uri: profileImage}}
                       style={styles.profile}/>
                : null
              }
            </View>
            <View style={{paddingLeft: 10}}>
              <Text style={CommonStyle.text12_inter_m}>
                {postDetailInfo?.user?.firstName} {postDetailInfo?.user?.lastName}
              </Text>
              <View style={{paddingTop: 5}}>
                <TimeAgo dateTo={moment(postDetailInfo?.createdAt).toDate()} updateInterval={10000}
                         style={[CommonStyle.text10_inter_r, {color: Theme.grey}]}/>
              </View>
            </View>
          </TouchableOpacity>

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

        <ScrollView style={{flex: 1}} bounces={false}>
          {TransactionPhotoLayout()}
          {ShopCartLayout()}
          {MyCommentLayout()}
          <View style={{height: 30}}/>
          {/*<OtherComments item={postDetailInfo}/>*/}
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
    height: 0.5,
    backgroundColor: 'rgba(196, 196, 196, 0.48)',
  },
});

export default PostDetailScreen;
