import React, {useEffect, useState} from 'react';
import {ActivityIndicator, FlatList, RefreshControl, StyleSheet, View} from 'react-native';
import FeedCardWrapper from './FeedCardWrapper';
import {useMutation, useQuery} from '@apollo/client';
import {GET_TRENDING_FEED_QUERY, INFLUENCED_BY_QUERY} from '../../../utils/Query';
import {navigation} from '../../../routes/navigation';
import {useDispatch} from 'react-redux';
import {setApiLoading} from '../../../redux/actions/config';
import Toast from 'react-native-toast-message';

const TrendingFeed = (props) => {
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);
  const [limit, setLimit] = useState(10);
  const [nextCursor, setNextCursor] = useState('');
  const [postList, setPostList] = useState([]);
  const [isNoData, setIsNoData] = useState(false);
  const [initData, setInitData] = useState(false);
  const [apiLoading, setLoading] = useState(false);
  const [postId, setPostId] = useState('');

  const {data: postData, loading, error, fetchMore} = useQuery(GET_TRENDING_FEED_QUERY, {
    variables: {
      'pageSize': limit,
      'next': nextCursor,
    },
  });

  const [buyingClub, {data: data1, loading: loading1, error: error1}] = useMutation(INFLUENCED_BY_QUERY, {
    variables: {
      'postId': postId,
    },
  });

  // by joining 'Buying Club'
  useEffect(() => {
    if (postId) {
      dispatch(setApiLoading(true));
      buyingClub()
        .then(res => {
          dispatch(setApiLoading(false));
          const pendingDemand = res?.data?.influencedBy?.post?.pendingDemand;
          console.log(pendingDemand);
          updatePostList(res?.data?.influencedBy?.post);
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
  }, [postId]);

  // when entering to this screen first
  useEffect(() => {
    const posts = postData?.trendingFeed?.nodes ? postData?.trendingFeed?.nodes : [];
    if (posts?.length > 0 && !initData) {
      setPostList(posts);
      setNextCursor(postData?.trendingFeed?.cursor);
      setIsNoData(posts?.length < limit);

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
        'next': nextCursor,
      },
    }).then(res => {
      const posts = res?.data?.trendingFeed?.nodes ? res?.data?.trendingFeed?.nodes : [];
      setPostList([...postList, ...posts]);
      setNextCursor(res?.data?.trendingFeed?.cursor);
      setIsNoData(posts?.length < limit);

      setLoading(false);

    }).catch(error => {
      setLoading(false);
      console.log('get posts error: ', error);
    });
  };

  const updatePostList = (selPost) => {
    let newPostList = [...postList];
    const findIndex = postList.findIndex(post => post?.id === selPost?.id);
    console.log(findIndex);
    if (findIndex > -1) {
      newPostList[findIndex] = {
        ...newPostList[findIndex],
        pendingDemand: selPost?.pendingDemand,
      };
    }
    setPostList(newPostList);
  };

  const onPressBuyingClub = (postId) => {
    setPostId(postId);
  };

  const onPressItem = (item) => {
    navigation?.navigate('PostDetail', {postId: item?.id, fromOtherUser: true});
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
        'next': '',
      },
    }).then(res => {
      const posts = res?.data?.trendingFeed?.nodes ? res?.data?.trendingFeed?.nodes : [];
      setLoading(false);

      setInitData(true);

      if (posts?.length > 0) {
        setPostList(posts);
        setNextCursor(res?.data?.trendingFeed?.cursor);
        setIsNoData(posts?.length < limit);
      } else {
        setPostList([]);
      }
    }).catch(error => {
      setLoading(false);
      console.log('get posts error: ', error);
    });
  };

  const onEndReached = () => {

  };

  return (
    <View style={styles.container}>
      <FlatList
        data={postList}
        renderItem={({item, index}) =>
          <FeedCardWrapper
            item={item}
            onPressItem={onPressItem}
            onPressBuyingClub={onPressBuyingClub}
          />
        }
        keyExtractor={(item, index) => item?.id?.toString()}
        ListFooterComponent={() => <View style={{height: 10}}/>}
        ListHeaderComponent={() => <View style={{height: 10}}/>}
        onEndReachedThreshold={0}
        onEndReached={onEndReached}
        onScroll={({nativeEvent}) => isCloseToBottom(nativeEvent)}

        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      >
      </FlatList>

      {/*<View style={{flex: 1}}>*/}
      {/*  {apiLoading ?*/}
      {/*    <View style={{*/}
      {/*      zIndex: 1,*/}
      {/*      position: 'absolute',*/}
      {/*      bottom: 10,*/}
      {/*      alignItems: 'center',*/}
      {/*      justifyContent: 'center',*/}
      {/*      alignSelf: 'center',*/}
      {/*    }}>*/}
      {/*      <ActivityIndicator size="small" animating={true} color={Theme.greyIcon}/>*/}
      {/*    </View>*/}
      {/*    : null*/}
      {/*  }*/}
      {/*</View>*/}

    </View>
  );
};

export default TrendingFeed;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10 + 10,
  },
});
