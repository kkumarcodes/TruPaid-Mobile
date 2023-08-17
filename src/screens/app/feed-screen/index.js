import React, {useEffect, useState} from 'react';
import {View, StyleSheet, StatusBar, TouchableOpacity, Animated, Alert, BackHandler} from 'react-native';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../../../styles/constant';
import {CommonStyle} from '../../../styles';
import {useDispatch, useSelector} from 'react-redux';
import {Theme} from '../../../styles/theme';
import FeedNavHeader from '../../../components/feed-nav-header';
import {navigation} from '../../../routes/navigation';
import {setReceipts} from '../../../redux/actions/app';
import {GlobalVariables} from '../../../utils/GlobalVariables';
import {loadLandingPage, updateProfile} from '../../../redux/actions/auth';
import TrendingFeed from './TrendingFeed';
import {useLazyQuery, useQuery} from '@apollo/client';
import {GET_PERSON_QUERY} from '../../../utils/Query';
import {IS_IPHONE_X} from '../../../styles/global';
import FollowingFeed from './FollowingFeed';

const tabList = {
  'Trending': Theme.icon_feed_dis,
  'People I Follow': Theme.icon_feed_dis,
};

const tabData = Object.keys(tabList).map((i) => ({
  key: i,
  title: i,
  image: tabList[i],
  ref: React.createRef(),
}));

const Tab = React.forwardRef(({item, onItemPress, selected, scrollX, index}, ref) => {
  const selColor = scrollX.interpolate({
    inputRange: [(index - 2) * WINDOW_WIDTH, (index - 1) * WINDOW_WIDTH, (index) * WINDOW_WIDTH, (index + 1) * WINDOW_WIDTH, (index + 2) * WINDOW_WIDTH],
    outputRange: ['#959595', '#959595', Theme.black, '#959595', '#959595'],
  });

  return (
    <TouchableOpacity onPress={onItemPress}>
      <View ref={ref}>
        <Animated.Text style={[selected ? CommonStyle.text14_inter_m : CommonStyle.text14_inter_r, {color: selColor}]}>
          {item.title}
        </Animated.Text>
      </View>
    </TouchableOpacity>
  );
});

const Indicator = ({measures, scrollX}) => {
  const inputRange = tabData.map((_, i) => i * WINDOW_WIDTH);
  const indicatorWidth = scrollX.interpolate({
    inputRange,
    outputRange: measures.map((measure) => WINDOW_WIDTH/2),
  });

  const translateX = scrollX.interpolate({
    inputRange: [0, WINDOW_WIDTH],
    outputRange: [0, WINDOW_WIDTH/2],
  });

  return (
    <Animated.View
      style={{
        zIndex: 1,
        position: 'absolute',
        height: 0,
        width: indicatorWidth,
        left: 0,
        backgroundColor: Theme.black,
        transform: [{
          translateX,
        }],
        bottom: -11,
        borderRadius: 17,
        borderColor: Theme.black,
        borderWidth: 1,
      }}
    />
  );
};

const Tabs = ({data, scrollX, onItemPress, pageNumber}) => {
  const [measures, setMeasures] = React.useState([]);
  const containerRef = React.useRef();

  React.useEffect(() => {
    const m = [];
    data.forEach(item => {
      item.ref.current.measureLayout(
        containerRef.current,
        (x, y, width, height) => {
          m.push({
            x,
            y,
            width,
            height,
          });
          if (m.length === data?.length) {
            setMeasures(m);
          }
        },
      );
    });
  }, []);

  return (
    <View style={styles.tabsContainer}>
      <View
        ref={containerRef}
        style={{flexDirection: 'row', alignItems: 'center'}}
      >
        {tabData.map((item, index) => {
          return (
            <View key={index} style={{marginRight: 0, flex: 1, alignItems: 'center'}}>
              <Tab item={item} ref={item.ref} onItemPress={() => onItemPress(index)}
                   selected={pageNumber === index} scrollX={scrollX} index={index}
              />
            </View>
          );
        })}
        {measures.length > 0 && <Indicator measures={measures} scrollX={scrollX}/>}
      </View>
    </View>
  );
};

const FeedScreen = () => {
  const dispatch = useDispatch();
  const user_profile = useSelector(state => state?.auth?.user_profile);
  const user_info = useSelector(state => state?.auth?.user_info);
  const receiptList = useSelector(state => state.app.receipts);
  const [pageNumber, setPageNumber] = useState(0);
  const [profileUrl, setProfileUrl] = useState('');
  const scrollX = React.useRef(new Animated.Value(0)).current;
  const ref = React.useRef();

  const {data: personData, loading, error} = useQuery(GET_PERSON_QUERY, {
    variables: {'id': user_info?.session?.identity?.id},
  });

  useEffect(() => {
    if (personData?.person) {
      dispatch(updateProfile(personData?.person));
    }
  }, [personData]);

  useEffect(() => {
    setProfileUrl(user_profile?.profile.image?.cloudinaryData?.secure_url);
  }, [user_profile]);

  useEffect(() => {

    const backAction = () => {
      const currentRoute = navigation.getRouteName();
      if (currentRoute?.name === 'Feed') {
        Alert.alert(
          'Reveel',
          'Are you sure to exit app?',
          [
            {
              text: 'No',
              onPress: () => {
                return true;
              },
              style: 'cancel',
            },
            {
              text: 'Yes', onPress: () => {
                dispatch(loadLandingPage());
                BackHandler.exitApp();
              },
            },
          ],
        );
        return true;
      }
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();

  }, []);

  useEffect(() => {

    if (!Array.isArray(receiptList) || receiptList?.length < 1) {
      return;
    }

    setTimeout(() => {

      if (GlobalVariables.global_transaction_cancel) {
        GlobalVariables.global_transaction_cancel = false;
        return;
      }

      const findIndex = receiptList.findIndex(item => item?.shareTransaction === 1);

      if (findIndex > -1) {
        console.log(receiptList[findIndex]);
        let newList = [...receiptList];

        const selectItem = receiptList[findIndex];
        newList[findIndex] = {
          ...selectItem,
          shareTransaction: 2,
        };
        dispatch(setReceipts(newList));
      }
    }, 3000);

  }, [receiptList]);

  const onItemPress = React.useCallback(itemIndex => {
    ref?.current?.scrollToOffset({
      offset: itemIndex * WINDOW_WIDTH,
    });
    // setPageNumber(itemIndex);
  });

  React.useEffect(() => {
    ref?.current?.scrollToOffset({
      offset: 0,
    });
  }, []);

  const onPressLeft = () => {
    navigation.navigate('Profile');
  };

  const onPressRight = () => {
    const item = {
      brand: {
        name: 'Nike',
      },
    };
    navigation?.navigate('PostCamera', {item});
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden={false} translucent={true} backgroundColor={'transparent'}/>
      <FeedNavHeader
        leftIcon={profileUrl}
        title={'REVEEL'}
        rightIcon={Theme.icon_add}
        onPressLeft={onPressLeft}
        onPressRight={onPressRight}
      />

      <View style={{flex: 1, backgroundColor: Theme.white}}>
        <Tabs data={tabData} scrollX={scrollX} onItemPress={onItemPress} pageNumber={pageNumber}/>

        <Animated.FlatList
          ref={ref}
          data={tabData}
          keyExtractor={item => item.key}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {x: scrollX}}}],
            {
              useNativeDriver: false,
              listener: event => {
                let newPage = parseInt((event.nativeEvent.contentOffset.x) / (WINDOW_WIDTH - 1));
                if (pageNumber !== newPage) {
                  setPageNumber(newPage)
                }
              },
            },
          )}

          bounces={false}
          renderItem={({item}) => {
            return (
              <View style={{width: WINDOW_WIDTH}}>
                {item?.title === 'Trending' &&
                <TrendingFeed
                  type={'trending'}
                />
                }
                {item?.title === 'People I Follow' &&
                <FollowingFeed
                  type={'People I Follow'}
                />
                }
              </View>
            );
          }}
        />
        <View style={{height: IS_IPHONE_X ? 80 : 60}}/>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  tabsContainer: {
    marginTop: 5,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Theme.background,
  },
});

export default FeedScreen;
