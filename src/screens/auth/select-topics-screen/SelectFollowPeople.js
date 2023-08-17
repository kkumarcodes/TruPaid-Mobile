import React, {useEffect, useState} from 'react';
import {View, StyleSheet, StatusBar, Text} from 'react-native';
import {useDispatch} from 'react-redux';
import {Theme} from '../../../styles/theme';
import {PADDING_HOR, WINDOW_HEIGHT, WINDOW_WIDTH} from '../../../styles/constant';
import {CommonStyle} from '../../../styles';
import TopNavHeader from '../../../components/top-nav-header';
import {navigation} from '../../../routes/navigation';
import MainButton from '../../../components/main-button';
import OnboardCardList from './OnboardCardList';
import {useMutation, useQuery} from '@apollo/client';
import {
  FOLLOWER_USERS_QUERY,
  GET_PEOPLE_TO_FOLLOW,
} from '../../../utils/Query';
import {setApiLoading} from '../../../redux/actions/config';

const SelectFollowPeopleScreen = (props) => {
    const dispatch = useDispatch();
    const [peopleFollowData, setPeopleFollowData] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [limit, setLimit] = useState(10);
    const [nextCursor, setNextCursor] = useState('');
    const [isNoData, setIsNoData] = useState(false);
    const [initData, setInitData] = useState(false);
    const [apiLoading, setLoading] = useState(false);
    const [userIds, setFollowUserIds] = useState(null);

    const {data: peopleData, loading, error, fetchMore} = useQuery(GET_PEOPLE_TO_FOLLOW, {
      variables: {
        'pageSize': limit,
        'next': nextCursor,
      },
    });

    const [followUsers, {data: data1, loading: loading1, error: error1}] = useMutation(FOLLOWER_USERS_QUERY, {
      variables: {
        'userIds': userIds,
      },
    });

    useEffect(() => {
      setTimeout(() => {
        onRefresh();
      }, 100);
    }, []);

    // when entering to this screen first
    useEffect(() => {
      const peopleList = peopleData?.peopleToFollow?.nodes ? peopleData?.peopleToFollow?.nodes : [];
      if (peopleList?.length > 0 && !initData) {
        let newPeopleList = [];
        Array.isArray(peopleList) && peopleList.map((item, key) => {
          newPeopleList.push({
            id: item?.id,
            src: item?.profile?.image?.cloudinaryData?.secure_url,
            title: item?.firstName + ' ' + item?.lastName,
            checked: false,
          });
        });

        setPeopleFollowData(newPeopleList);
        setNextCursor(peopleData?.peopleToFollow?.cursor);
        setIsNoData(peopleList?.length < limit);
        setInitData(true);
      }
    }, [peopleData]);

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
        const peopleList = res?.data?.peopleToFollow?.nodes ? res?.data?.peopleToFollow?.nodes : [];
        let newPeopleList = [];
        Array.isArray(peopleList) && peopleList.map((item, key) => {
          newPeopleList.push({
            id: item?.id,
            src: item?.profile?.image?.cloudinaryData?.secure_url,
            title: item?.firstName + ' ' + item?.lastName,
            checked: false,
          });
        });

        setPeopleFollowData([...peopleFollowData, ...newPeopleList]);
        setNextCursor(res?.data?.peopleToFollow?.cursor);
        setIsNoData(peopleList?.length < limit);
        setLoading(false);

      }).catch(error => {
        setLoading(false);
        console.log('people to follow error: ', error);
      });
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
        const peopleList = res?.data?.peopleToFollow?.nodes ? res?.data?.peopleToFollow?.nodes : [];
        setLoading(false);
        setInitData(true);

        if (peopleList?.length > 0) {
          let newPeopleList = [];
          Array.isArray(peopleList) && peopleList.map((item, key) => {
            newPeopleList.push({
              id: item?.id,
              src: item?.profile?.image?.cloudinaryData?.secure_url,
              title: item?.firstName + ' ' + item?.lastName,
              checked: false,
            });
          });

          setPeopleFollowData(newPeopleList);
          setNextCursor(res?.data?.peopleToFollow?.cursor);
          setIsNoData(peopleList?.length < limit);
        } else {
          setPeopleFollowData([]);
        }
      }).catch(error => {
        setLoading(false);
        console.log('people to follow error: ', error);
      });
    };

    const onEndReached = () => {

    };

    // Following user
    useEffect(() => {
      if (Array.isArray(userIds)) {
        dispatch(setApiLoading(true));
        followUsers()
          .then(res => {
            dispatch(setApiLoading(false));
            navigation.navigate('SelectFavoriteBrand');
          })
          .catch(e => {
            dispatch(setApiLoading(false));
            console.log(e);
          });
      }
    }, [userIds]);

    const onPressLeft = () => {
      navigation.goBack();
    };

    const onPressNext = () => {
      addFollowingPeople();
    };

    const addFollowingPeople = () => {
      let userIds = [];
      peopleFollowData.map((item, index) => {
        if (item.checked) {
          userIds.push(item?.id);
        }
      });
      setFollowUserIds(userIds);
    };

    const onPressItem = (selItem, index) => {
      let newProducts = [];
      if (index === 'like_people') {
        peopleFollowData.map(item => {
          if (item?.id === selItem?.id) {
            newProducts.push({
              ...item,
              checked: !selItem?.checked,
            });
          } else {
            newProducts.push(item);
          }
        });
        setPeopleFollowData(newProducts);
      }
    };

    const HeaderLayout = () => {
      let title = 'Who\'d you like to\nfollow';
      return (
        <View style={styles.headerContainer}>
          <Text style={[CommonStyle.text26_inter_m, {textAlign: 'center', lineHeight: 26}]}>
            {title}
          </Text>
        </View>
      );
    };

    const TopicsLayout = () => {
      return (
        <View style={{
          flex: 1,
          width: WINDOW_WIDTH,
          paddingHorizontal: PADDING_HOR,
          marginTop: 30,
          backgroundColor: Theme.white,
        }}>
          <OnboardCardList
            data={peopleFollowData}
            onPressItem={onPressItem}
            type={'like_people'}
            onEndReached={onEndReached}
            isCloseToBottom={isCloseToBottom}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        </View>
      );
    };

    return (
      <View style={styles.container}>
        <StatusBar hidden={false} translucent={true} backgroundColor={'transparent'}/>

        <TopNavHeader onPressLeft={onPressLeft} leftIcon={Theme.arrow_left} title={'Customize feed theme'}/>

        {HeaderLayout()}

        <View style={{flex: 1}}>
          {TopicsLayout()}

          <View style={styles.btnContainer}>
            <MainButton
              title={'Next'}
              isValid={true}
              onPress={onPressNext}
            />
          </View>
        </View>

      </View>
    );
  }
;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.white,
  },
  headerContainer: {
    paddingTop: WINDOW_HEIGHT * 0.02,
    paddingHorizontal: PADDING_HOR,
    justifyContent: 'center',
    alignItems: 'center',
  },
  body: {
    backgroundColor: Theme.white,
    marginTop: 50,
  },
  btnContainer: {
    width: WINDOW_WIDTH,
    paddingHorizontal: PADDING_HOR,
    alignSelf: 'center',
    marginTop: 13,
    marginBottom: 30,
  },
});

export default SelectFollowPeopleScreen;
