import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  Text,
  TouchableOpacity,
  Image,
  RefreshControl,
  FlatList,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {Theme} from '../../../styles/theme';
import {CommonStyle} from '../../../styles';
import {PADDING_HOR, WINDOW_WIDTH} from '../../../styles/constant';
import {numberWithCommas} from '../../../styles/global';
import BasicNavHeader from '../../../components/basic-nav-header';
import {useLazyQuery, useMutation, useQuery} from '@apollo/client';
import {
  FOLLOWER_USERS_QUERY,
  GET_PERSON_QUERY,
  GET_POSTS_BY_USERID_QUERY,
  UNFOLLOWER_USERS_QUERY,
} from '../../../utils/Query';
import {setApiLoading} from '../../../redux/actions/config';
import FeedCardWrapper from '../feed-screen/FeedCardWrapper';

const UserProfileScreen = ({route, navigation}) => {
  const dispatch = useDispatch();
  const auth_info = useSelector(state => state?.auth?.user_info);
  const [postInfo, setPostInfo] = useState(route?.params.item);
  const [userInfo, setUserInfo] = useState(postInfo?.user);
  const [person, setPerson] = useState(null);
  const [userIds, setUserIds] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [startUnFollow, setStartUnFollow] = useState(false);
  const [numFollowers, setNumFollowers] = useState(0);
  const [numFollowing, setNumFollowing] = useState(0);

  const [initialize, setInit] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [limit, setLimit] = useState(10);
  const [prevCursor, setPrevCursor] = useState('');
  const [nextCursor, setNextCursor] = useState('');
  const [postList, setPostList] = useState([]);
  const [isNoData, setIsNoData] = useState(false);
  const [initData, setInitData] = useState(false);
  const [apiLoading, setLoading] = useState(false);

  const [getPerson, {data: personData, loading, error}] = useLazyQuery(GET_PERSON_QUERY, {
    variables: {'id': userInfo?.id},
  });

  const [followUsers, {data: data1, loading: loading1, error: error1}] = useMutation(FOLLOWER_USERS_QUERY, {
    variables: {
      'userIds': userIds,
    },
  });

  const [unFollowUsers, {data: data2, loading: loading2, error: error2}] = useMutation(UNFOLLOWER_USERS_QUERY, {
    variables: {
      'userId': userInfo?.id,
    },
  });

  // get posts by user id
  const {data: postData, loading: loading3, error: error3, fetchMore} = useQuery(GET_POSTS_BY_USERID_QUERY, {
    variables: {
      'pageSize': limit,
      'before': prevCursor,
      'after': '',
      'userId': userInfo?.id,
    },
  });

  // when entering to this screen first
  useEffect(() => {
    const posts = postData?.posts?.nodes ? postData?.posts?.nodes : [];
    if (posts?.length > 0 && !initData) {
      setPostList(posts);
      setNextCursor(postData?.posts?.nextCursor);
      setPrevCursor(postData?.posts?.prevCursor);
      setIsNoData(posts?.length < limit);

      setInit(true);
      setInitData(true);
    }
  }, [postData]);

  const loadMore = async () => {
    if (isNoData || loading || apiLoading) {
      return;
    }

    setLoading(true);
    fetchMore({
      variables: {
        'pageSize': limit,
        'before': prevCursor,
        'after': '',
        'userId': userInfo?.id
      },
    }).then(res => {
      const posts = res?.data?.posts?.nodes ? res?.data?.posts?.nodes : [];
      setPostList([...postList, ...posts]);
      setNextCursor(res?.data?.posts?.nextCursor);
      setPrevCursor(res?.data?.posts?.prevCursor);
      setIsNoData(posts?.length < limit);

      setLoading(false);

    }).catch(error => {
      setLoading(false);
      console.log('get posts error: ', error);
    });
  };

  // Following user
  useEffect(() => {
    if (userIds?.length > 0) {
      dispatch(setApiLoading(true));
      setUserIds([]);
      followUsers()
        .then(res => {
          console.log('follow users success: ', res?.data?.followUsers);
          if (Array.isArray(res?.data?.followUsers) && res?.data?.followUsers?.length > 0) {
            setNumFollowers(res?.data?.followUsers[0]?.followed?.liveFollowers);
            setIsFollowing(true);
          }
          dispatch(setApiLoading(false));
        })
        .catch(e => {
          dispatch(setApiLoading(false));
          console.log(e);
        });
    }
  }, [userIds]);

  // UnFollowing user
  useEffect(() => {
    if (startUnFollow) {
      dispatch(setApiLoading(true));
      setStartUnFollow(false);
      unFollowUsers()
        .then(res => {
          dispatch(setApiLoading(false));
          console.log('unfollow user success: ', res?.data?.unfollowUser);
          if (res?.data?.unfollowUser) {
            setNumFollowers(res?.data?.unfollowUser?.followed?.liveFollowers);
            setIsFollowing(false);
          }
        })
        .catch(e => {
          dispatch(setApiLoading(false));
          console.log(e);
        });
    }
  }, [startUnFollow]);

  useEffect(() => {
    getPerson();
  }, []);

  useEffect(() => {
    if (personData) {
      setPerson(personData?.person);
      setNumFollowers(personData?.person?.profile?.stats?.numFollowers);
      setNumFollowing(personData?.person?.profile?.stats?.numFollowing);
      checkFollowingStatus(personData?.person?.profile?.followers);
    }
  }, [personData]);

  const checkFollowingStatus = (followers) => {
    Array.isArray(followers) && followers?.map((item) => {
      if (item?.followerId === auth_info?.session?.identity?.id) {
        setIsFollowing(true);
      }
    });
  };

  const onPressLeft = () => {
    navigation.goBack();
  };

  const onPressRight = () => {

  };

  const onPressFollowing = () => {
    if (isFollowing) {
      setStartUnFollow(true);
    } else {
      let userIds = [];
      userIds.push(userInfo?.id);
      setUserIds(userIds);
    }
  };

  const onPressItem = (item) => {
    navigation?.push('PostDetail', {postId: item?.id, fromOtherUser: true});
  };

  const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    let paddingHeight = 2;
    let bFlag = (layoutMeasurement.height + contentOffset.y) >= (contentSize.height - paddingHeight);
    if (bFlag) {
      loadMore();
    }
  };

  const onRefresh = () => {
    setLoading(true);

    fetchMore({
      variables: {
        'pageSize': limit,
        'before': '',
        'after': '',
      },
    }).then(res => {
      const posts = res?.data?.posts?.nodes ? res?.data?.posts?.nodes : [];
      setLoading(false);

      if (posts?.length > 0) {
        setPostList(posts);
        setNextCursor(res?.data?.posts?.nextCursor);
        setPrevCursor(res?.data?.posts?.prevCursor);
        setIsNoData(posts?.length < limit);

        setInit(true);
        setInitData(true);
      }
    }).catch(error => {
      setLoading(false);
      console.log('get posts error: ', error);
    });
  };

  const CardLayout = () => {
    return (
      <View style={styles.cardWrapper}>
        <View style={[CommonStyle.row]}>
          <Image source={Theme.icon_receipt} style={styles.card}/>
          <View style={{paddingLeft: 8}}>
            <Text style={CommonStyle.text12_inter_r}>
              {numberWithCommas(person?.profile?.stats?.numReceipts)}
            </Text>
          </View>
        </View>

        <View style={[CommonStyle.row, {marginHorizontal: WINDOW_WIDTH * 0.1}]}>
          <Image source={Theme.icon_cart_yellow} style={styles.card}/>
          <View style={{paddingLeft: 8}}>
            <Text style={CommonStyle.text12_inter_r}>
              {numberWithCommas(person?.profile?.stats?.totalPendingDemand)}
            </Text>
          </View>
        </View>

        <View style={[CommonStyle.row]}>
          <Image source={Theme.icon_card} style={styles.card}/>
          <View style={{paddingLeft: 8}}>
            <Text style={CommonStyle.text12_inter_r}>
              {numberWithCommas(person?.profile?.stats?.totalInfluencedPurchases)}
            </Text>
          </View>
        </View>

      </View>
    );
  };

  const SocietyLayout = () => {
    return (
      <View style={[CommonStyle.row_bw, {paddingVertical: 20}]}>
        <View style={[CommonStyle.center, {flex: 1}]}>
          <Text style={CommonStyle.text16_inter_m}>
            {numberWithCommas(person?.profile?.stats?.numPosts)}
          </Text>
          <Text style={[CommonStyle.text11_inter_r, {paddingTop: 2}]}>
            Posts
          </Text>
        </View>

        <View style={[{flex: 1}]}>
          <View style={CommonStyle.row_bw}>
            <View style={styles.verticalLine}/>

            <View style={CommonStyle.center}>
              <Text style={CommonStyle.text16_inter_m}>
                {numberWithCommas(numFollowers)}
              </Text>
              <Text style={[CommonStyle.text11_inter_r, {paddingTop: 2}]}>
                Followers
              </Text>
            </View>

            <View style={styles.verticalLine}/>
          </View>
        </View>

        <View style={[CommonStyle.center, {flex: 1}]}>
          <Text style={CommonStyle.text16_inter_m}>
            {numberWithCommas(numFollowing)}
          </Text>
          <Text style={[CommonStyle.text11_inter_r, {paddingTop: 2}]}>
            Following
          </Text>
        </View>
      </View>
    );
  };

  const ProfileCardLayout = () => {
    return (
      <View style={{paddingHorizontal: PADDING_HOR, paddingVertical: 10}}>
        <View style={{flexDirection: 'row'}}>
          <View style={[CommonStyle.center, {flex: 1}]}>
            <View style={styles.profileWrapper}>
              {person?.profile.image?.cloudinaryData?.secure_url ?
                <Image source={{uri: person?.profile.image?.cloudinaryData?.secure_url}}
                       style={styles.profile}/>
                : null}
            </View>

            <Text style={[CommonStyle.text14_inter_r, {paddingTop: 10}]}>
              {userInfo?.firstName} {userInfo?.lastName}
            </Text>
          </View>

          <TouchableOpacity style={[styles.btnFollowingWrapper]}
                            onPress={onPressFollowing}
          >
            <Text style={[CommonStyle.text12_inter_r]}>
              {isFollowing ? 'Following' : 'Follow'}
            </Text>
          </TouchableOpacity>
        </View>

        {SocietyLayout()}

        {CardLayout()}

      </View>
    );
  };

  const ReceiptLayout = () => {
    return (
      <View style={styles.receiptWrapper}>
        <View style={styles.receiptHeader}>
          <Image source={Theme.icon_receipt} style={styles.receiptImage}/>
          <View style={{paddingLeft: 8}}>
            <Text style={CommonStyle.text12_inter_r}>
              Receipt
            </Text>
          </View>
        </View>

        <View style={{flex: 1, paddingHorizontal: PADDING_HOR}}>
          <FlatList
            data={postList}
            renderItem={({item, index}) =>
              <FeedCardWrapper
                item={item}
                onPressItem={onPressItem}
                onPressBuyingClub={() => console.log('pressed buying club')}
              />
            }
            keyExtractor={(item, index) => item?.id?.toString()}
            ListFooterComponent={() => <View style={{height: 10}}/>}
            ListHeaderComponent={() => <View style={{height: 10}}/>}
            onEndReachedThreshold={0}
            onEndReached={() => console.log('onEndReached')}
            onScroll={({nativeEvent}) => isCloseToBottom(nativeEvent)}

            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
              />
            }
          >
          </FlatList>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden={false} translucent={true} backgroundColor={'transparent'}/>

      <BasicNavHeader
        leftIcon={Theme.arrow_left}
        title={userInfo?.firstName + ' ' + userInfo?.lastName}
        rightIcon={Theme.icon_3dots}
        onPressLeft={onPressLeft}
        onPressRight={onPressRight}
      />

      {ProfileCardLayout()}

      {ReceiptLayout()}

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F6F6',
  },
  profileWrapper: {
    width: 88,
    height: 88,
    backgroundColor: Theme.white,
    borderRadius: 88,
    borderWidth: 0.5,
    borderColor: 'rgba(196, 196, 196, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  profile: {
    width: 88,
    height: 88,
    resizeMode: 'cover',
  },
  btnFollowingWrapper: {
    position: 'absolute',
    right: 0,
    paddingHorizontal: 10,
    paddingVertical: 7,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: Theme.grey,
    borderWidth: 0.5,
    borderRadius: 4,
  },
  verticalLine: {
    height: 20,
    width: 0.5,
    backgroundColor: '#B9B9B9',
  },
  cardWrapper: {
    flexDirection: 'row',
    backgroundColor: Theme.white,
    borderRadius: 4,
    paddingVertical: 15,
    justifyContent: 'center',
  },
  card: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
  },
  receiptWrapper: {
    flex: 1,
    backgroundColor: Theme.white,
    marginTop: 10,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },
  receiptHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(196, 196, 196, 0.28)',
  },
  receiptImage: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    tintColor: '#5A5A5A',
  },
});

export default UserProfileScreen;
