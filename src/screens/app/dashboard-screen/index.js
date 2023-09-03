import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Animated,
  ScrollView,
  Alert,
  BackHandler,
  Image, Text,
} from 'react-native';
import {PADDING_HOR, WINDOW_WIDTH} from '../../../styles/constant';
import {CommonStyle} from '../../../styles';
import {useDispatch, useSelector} from 'react-redux';
import {Theme} from '../../../styles/theme';
import {peopleFollowList, trendingList, userInfo, userProfileInfo} from '../../../assets/template/template';
import {navigation} from '../../../routes/navigation';
import {Platform} from 'react-native';
import {loadLandingPage} from '../../../redux/actions/auth';
import TopNavHeader from '../../../components/top-nav-header';
import GeneralSummCard from './GeneralSummCard';
import ChartCard from './ChartCard';
import EarnedCashCard from './EarnedCashCard';
import MostPopularPostCard from './MostPopularPostCard';
import MetricsHeader from './MetricsHeader';
import ActivityCard from './ActivityCard';

const tabList = {
  'Basic Metrics': Theme.icon_feed_dis,
  'Financial Metrics': Theme.icon_feed_dis,
};

const metricsViewData = [
  {
    id: 1,
    count: 7,
    name: 'Shared Posts',
  },
  {
    id: 2,
    count: 184,
    name: 'Profile Views',
  },
  {
    id: 3,
    count: 3,
    name: 'Demand Retailers',
  },
  {
    id: 4,
    count: 84,
    name: 'Shared Posts',
  },
];

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
        <Animated.Text style={[selected ? CommonStyle.text14_inter_m : CommonStyle.text14_inter_m, {color: selColor}]}>
          {item.title}
        </Animated.Text>
      </View>
    </TouchableOpacity>
  );
});

const Indicator = ({measures, scrollX}) => {
  // const paddingHoz = 10;
  // const inputRange = tabData.map((_, i) => i * WINDOW_WIDTH);
  // const indicatorWidth = scrollX.interpolate({
  //   inputRange,
  //   outputRange: measures.map((measure) => measure.width + paddingHoz * 2),
  // });
  // const translateX = scrollX.interpolate({
  //   inputRange,
  //   outputRange: measures.map((measure) => measure.x),
  // });

  const inputRange = tabData.map((_, i) => i * WINDOW_WIDTH);
  const indicatorWidth = scrollX.interpolate({
    inputRange,
    outputRange: measures.map((measure) => WINDOW_WIDTH / 2),
  });

  const translateX = scrollX.interpolate({
    inputRange: [0, WINDOW_WIDTH],
    outputRange: [0, WINDOW_WIDTH / 2],
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

const DashboardScreen = () => {
  const dispatch = useDispatch();
  const [transactionInfo, setTransactionInfo] = useState(userInfo);
  const receiptList = useSelector(state => state.app.receipts);
  const [initialize, setInit] = useState(false);
  const [pageNumber, setPageNumber] = useState(0);
  const scrollX = React.useRef(new Animated.Value(0)).current;
  const ref = React.useRef();

  useEffect(() => {

    const backAction = () => {
      const currentRoute = navigation.getRouteName();
      if (currentRoute?.name === 'Feed') {
        Alert.alert(
          'TruPaid',
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
    loadMyTransactions();
  }, []);


  const loadMyTransactions = () => {

    setTimeout(() => {
      setInit(true);
    }, 500);
  };

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

  const onPressProfile = () => {
    navigation.navigate('UserProfile', {item: transactionInfo});
  };

  const renderMetricsCard = (item) => {
    return (
      <View style={styles.cardMetrics}>
        <Text style={CommonStyle.text22_inter_m}>
          {item?.count}
        </Text>
        <Text style={[CommonStyle.text12_inter_r, {color: Theme.greyDark, paddingTop: 5}]}>
          {item?.name}
        </Text>
      </View>
    );
  };

  const MetricsView = () => {
    return (
      <View style={{paddingTop: 30}}>
        <MetricsHeader/>

        <View style={{
          marginHorizontal: -PADDING_HOR,
          width: WINDOW_WIDTH,
          flexDirection: 'row',
          flexWrap: 'wrap',
          marginTop: 5,
        }}>
          {Array.isArray(metricsViewData) && metricsViewData?.map((item, key) => {
            return (
              <View key={key} style={{
                width: (WINDOW_WIDTH - PADDING_HOR * 2 - 8) / 2,
                marginRight: key % 2 === 0 ? 8 : 0,
                marginLeft: key % 2 === 0 ? PADDING_HOR : 0,
                marginTop: 8,
                marginHorizontal: PADDING_HOR,
                borderRadius: 6,
                overflow: 'hidden',
              }}>
                {renderMetricsCard(item)}
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  const FollowerView = () => {
    return (
      <View style={[CommonStyle.row_bw, {paddingVertical: 30}]}>
        <View style={[CommonStyle.center, {flex: 1}]}>
          <Text style={CommonStyle.text22_inter_r}>
            500
          </Text>
          <Text style={[CommonStyle.text12_inter_r, {color: Theme.greyDarkMedium}]}>
            Follower purchases
          </Text>
        </View>

        <View style={[CommonStyle.center, {flex: 1}]}>
          <Text style={CommonStyle.text22_inter_r}>
            $930
          </Text>
          <Text style={[CommonStyle.text12_inter_r, {color: Theme.greyDarkMedium}]}>
            Total Follower Savings
          </Text>
        </View>
      </View>
    );
  };

  const BasicLayout = (props) => {
    return (
      <View style={styles.body}>
        <View style={[CommonStyle.row_bw]}>
          <View style={{flex: 1}}>
            <TouchableOpacity style={styles.btnAction}>
              <Text>
                My action
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{width: 10}}/>

          <View style={{flex: 1}}>
            <TouchableOpacity style={styles.btnFollowers}>
              <Text>
                Followers
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {MetricsView()}

        <View style={{height: 30}}/>
        <ActivityCard/>
      </View>
    );
  };

  const FinancialLayout = (props) => {
    return (
      <View style={styles.body}>
        <GeneralSummCard/>
        <ChartCard/>
        {FollowerView()}
        <EarnedCashCard/>
        <MostPopularPostCard/>
      </View>
    );
  };

  const ProfileCardLayout = () => {
    return (
      <View style={[CommonStyle.row_bw, {paddingHorizontal: PADDING_HOR, paddingVertical: 12}]}>
        <View style={CommonStyle.row}>
          <TouchableOpacity style={styles.profileWrapper} onPress={onPressProfile}>
            {transactionInfo?.profile &&
            <Image source={transactionInfo?.profile ? transactionInfo?.profile : {uri: 'http'}} style={styles.profile}/>
            }
          </TouchableOpacity>
          <View style={{paddingLeft: 10}}>
            <Text style={CommonStyle.text14_inter_m}>
              {transactionInfo?.fname} {transactionInfo?.lname}
            </Text>
          </View>
        </View>

        <View style={CommonStyle.row}>
          <Image source={Theme.icon_r} style={styles.iconR}/>
          <View style={{paddingLeft: 5}}/>
          <Text>
            <Text style={[CommonStyle.text16_inter_sb, {color: Theme.black}]}>
              88
            </Text>
            <Text style={CommonStyle.text10_inter_sb}>
              {' '}/{' '}
            </Text>
            <Text style={CommonStyle.text10_inter_r}>
              100
            </Text>
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden={false} translucent={true} backgroundColor={'transparent'}/>

      <TopNavHeader onPressLeft={onPressLeft} leftIcon={Theme.arrow_left} title={'Dashboard'}/>

      {ProfileCardLayout()}

      <View style={{flex: 1, backgroundColor: Theme.background}}>
        <Tabs data={tabData} scrollX={scrollX} onItemPress={onItemPress} pageNumber={pageNumber}/>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{backgroundColor: Theme.background}}>
          <Animated.FlatList
            ref={ref}
            data={tabData}
            scrollEnabled={false}
            keyExtractor={item => item.key}
            horizontal
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            onScroll={Animated.event(
              [{nativeEvent: {contentOffset: {x: scrollX}}}],
              {
                useNativeDriver: false,
                listener: event => {
                },
              },
            )}
            bounces={false}
            renderItem={({item}) => {
              return (
                <View style={{width: WINDOW_WIDTH, marginTop: 10}}>
                  {item?.title === 'Basic Metrics' && initialize && <BasicLayout data={trendingList}/>}
                  {item?.title === 'Financial Metrics' && initialize && <FinancialLayout data={peopleFollowList}/>}
                </View>
              );
            }}
          />
          <View style={{height: Platform.OS === 'ios' ? 80 : 60}}/>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  body: {
    flex: 1,
    paddingHorizontal: PADDING_HOR,
    paddingTop: 15,
  },
  tabsContainer: {
    paddingTop: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Theme.background,
    backgroundColor: Theme.white,
  },
  profileWrapper: {
    width: 46,
    height: 46,
    backgroundColor: Theme.white,
    borderRadius: 7,
    borderWidth: 0.5,
    borderColor: 'rgba(196, 196, 196, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  profile: {
    width: 46,
    height: 46,
    resizeMode: 'contain',
  },
  iconR: {
    width: 13,
    height: 13,
    resizeMode: 'contain',
  },
  btnAction: {
    flex: 1,
    backgroundColor: Theme.white,
    borderRadius: 200,
    height: 42,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  btnFollowers: {
    flex: 1,
    borderRadius: 200,
    borderWidth: 0.5,
    borderColor: Theme.greyIcon,
    height: 42,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  cardMetrics: {
    backgroundColor: Theme.white,
    height: 97,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default DashboardScreen;
