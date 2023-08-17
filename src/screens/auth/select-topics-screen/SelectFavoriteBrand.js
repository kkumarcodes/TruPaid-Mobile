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
  FOLLOW_BRANDS_QUERY,
  GET_BRANDS_TO_FOLLOW,
} from '../../../utils/Query';
import {setApiLoading} from '../../../redux/actions/config';

const SelectFavoriteBrandScreen = (props) => {
    const dispatch = useDispatch();
    const [brandFollowData, setBrandFollowData] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [limit, setLimit] = useState(10);
    const [nextCursor, setNextCursor] = useState('');
    const [isNoData, setIsNoData] = useState(false);
    const [initData, setInitData] = useState(false);
    const [apiLoading, setLoading] = useState(false);
    const [brandIds, setFollowBrandIds] = useState(null);

    const {data: brandsData, loading, error, fetchMore} = useQuery(GET_BRANDS_TO_FOLLOW, {
      variables: {
        'pageSize': limit,
        'next': nextCursor,
      },
    });

    const [followBrands, {data: data1, loading: loading1, error: error1}] = useMutation(FOLLOW_BRANDS_QUERY, {
      variables: {
        'brandIds': brandIds,
      },
    });

    useEffect(() => {
      setTimeout(() => {
        onRefresh();
      }, 100);
    }, []);

    // when entering to this screen first
    useEffect(() => {
      const brandList = brandsData?.brandsToFollow?.nodes ? brandsData?.brandsToFollow?.nodes : [];
      if (brandList?.length > 0 && !initData) {
        let newBrandList = [];
        Array.isArray(brandList) && brandList.map((item, key) => {
          newBrandList.push({
            id: item?.id,
            src: item?.thumbnailUrl,
            title: item?.name,
            checked: false,
          });
        });

        setBrandFollowData(newBrandList);
        setNextCursor(brandsData?.brandsToFollow?.cursor);
        setIsNoData(brandList?.length < limit);
        setInitData(true);
      }
    }, [brandsData]);

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
        const brandList = res?.data?.brandsToFollow?.nodes ? res?.data?.brandsToFollow?.nodes : [];
        let newBrandList = [];
        Array.isArray(brandList) && brandList.map((item, key) => {
          newBrandList.push({
            id: item?.id,
            src: item?.thumbnailUrl,
            title: item?.name,
            checked: false,
          });
        });

        setBrandFollowData([...brandFollowData, ...newBrandList]);
        setNextCursor(res?.data?.brandsToFollow?.cursor);
        setIsNoData(brandList?.length < limit);
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
        const brandList = res?.data?.brandsToFollow?.nodes ? res?.data?.brandsToFollow?.nodes : [];
        setLoading(false);
        setInitData(true);

        if (brandList?.length > 0) {
          let newBrandList = [];
          Array.isArray(brandList) && brandList.map((item, key) => {
            newBrandList.push({
              id: item?.id,
              src: item?.thumbnailUrl,
              title: item?.name,
              checked: false,
            });
          });

          setBrandFollowData(newBrandList);
          setNextCursor(res?.data?.brandsToFollow?.cursor);
          setIsNoData(brandList?.length < limit);
        } else {
          setBrandFollowData([]);
        }
      }).catch(error => {
        setLoading(false);
        console.log('brands to follow error: ', error);
      });
    };

    const onEndReached = () => {

    };

    // Following brands
    useEffect(() => {
      if (Array.isArray(brandIds)) {
        dispatch(setApiLoading(true));
        followBrands()
          .then(res => {
            dispatch(setApiLoading(false));
            navigation.navigate('LinkBankFirst');
          })
          .catch(e => {
            dispatch(setApiLoading(false));
            console.log(e);
          });
      }
    }, [brandIds]);

    const onPressLeft = () => {
      navigation.goBack();
    };

    const onPressNext = () => {
      followingBrands();
    };

    const followingBrands = () => {
      let brandIds = [];
      brandFollowData.map((item, index) => {
        if (item.checked) {
          brandIds.push(item?.id);
        }
      });
      setFollowBrandIds(brandIds);
    };

    const onPressItem = (selItem, index) => {
      let newProducts = [];
      if (index === 'brands') {
        brandFollowData.map(item => {
          if (item?.id === selItem?.id) {
            newProducts.push({
              ...item,
              checked: !selItem?.checked,
            });
          } else {
            newProducts.push(item);
          }
        });
        setBrandFollowData(newProducts);
      }
    };

    const HeaderLayout = () => {
      let title = 'Select your favorite\nbrands';
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
            data={brandFollowData}
            onPressItem={onPressItem}
            type={'brands'}
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

export default SelectFavoriteBrandScreen;
