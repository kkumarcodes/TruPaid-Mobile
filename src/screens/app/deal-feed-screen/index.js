import React, {useEffect, useState} from 'react';
import {View, StyleSheet, StatusBar, TouchableOpacity, Animated, ScrollView, Text} from 'react-native';
import {PADDING_HOR, WINDOW_WIDTH} from '../../../styles/constant';
import {CommonStyle} from '../../../styles';
import {useDispatch, useSelector} from 'react-redux';
import {Theme} from '../../../styles/theme';
import FeedNavHeader from '../../../components/feed-nav-header';
import {numberWithCommas} from '../../../styles/global';
import OfferCard from '../../../components/offer-card';
import CategoriesView from '../../../components/categories-view';
import {Platform} from 'react-native';
import {FEED_DEALS, GET_CATEGORIES} from '../../../utils/Query';
import ApiGraphqlKit from '../../../utils/ApiGraphqlKit';
import {setApiLoading} from '../../../redux/actions/config';
import {navigation} from '../../../routes/navigation';

const tabList = {
  'All offers': Theme.icon_feed_dis,
  'Trending offers': Theme.icon_feed_dis,
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

const DealFeedScreen = () => {
  const dispatch = useDispatch();
  const user_profile = useSelector(state => state?.auth?.user_profile);
  const [feedDeals, setFeedDeals] = useState([]);
  const [selectCategory, setSelectCategory] = useState(null);
  const [categoryData, setCategories] = useState([]);
  const [profileUrl, setProfileUrl] = useState('');
  const [pageNumber, setPageNumber] = useState(0);
  const scrollX = React.useRef(new Animated.Value(0)).current;
  const ref = React.useRef();

  const onItemPress = React.useCallback(itemIndex => {
    ref?.current?.scrollToOffset({
      offset: itemIndex * WINDOW_WIDTH,
    });
    // setPageNumber(itemIndex)
  });

  React.useEffect(() => {
    ref?.current?.scrollToOffset({
      offset: 0,
    });
  }, []);

  useEffect(() => {
    getCategories();
    getFeedDeals();
  }, []);

  useEffect(() => {
    setProfileUrl(user_profile?.profile.image?.cloudinaryData?.secure_url);
  }, [user_profile]);

  const getFeedDeals = () => {
    let body = {
      'operationName': null,
      'variables': {},
      'query': FEED_DEALS,
    };
    dispatch(setApiLoading(true));
    ApiGraphqlKit.post('', body).then(res => {
      const feedDeals = res?.data?.data?.feedDeals ? res?.data?.data?.feedDeals : [];
      setFeedDeals(feedDeals);
      dispatch(setApiLoading(false));
    }).catch(error => {
      dispatch(setApiLoading(false));
      console.log('graphql error: ', error?.response?.data);
    });
  };

  // get category list using graphQL
  const getCategories = () => {
    let body = {
      'operationName': null,
      'variables': {},
      'query': GET_CATEGORIES,
    };

    dispatch(setApiLoading(true));

    ApiGraphqlKit.post('', body).then(res => {

      const categories = res?.data?.data?.categories;
      let newCategories = [];
      Array.isArray(categories) && categories.map((item, key) => {
        newCategories.push({
          id: item?.id,
          src: item?.image,
          title: item?.name,
          checked: key === 0,
        });
      });

      setCategories(newCategories);
      dispatch(setApiLoading(false));


    }).catch(error => {
      dispatch(setApiLoading(false));
      console.log('graphql error: ', error?.response?.data);
    });
  };

  const onPressLeft = () => {
    navigation.navigate('Profile');
  };

  const OfferLayout = (props) => {
    const offers = props?.data;
    return (
      <View>

        <View style={{
          width: WINDOW_WIDTH,
          flexDirection: 'row',
          flexWrap: 'wrap',
        }}>
          {Array.isArray(offers) && offers.map((item, key) => {
            return (
              <View key={key} style={{
                width: (WINDOW_WIDTH - PADDING_HOR * 2 - 6) / 2,
                marginRight: key % 2 === 0 ? 6 : 0,
                marginLeft: key % 2 === 0 ? PADDING_HOR : 0,
                marginTop: 6,
                marginHorizontal: PADDING_HOR,
                borderRadius: 4,
                overflow: 'hidden',
              }}>
                <OfferCard item={item} products={offers}
                           width={(WINDOW_WIDTH - PADDING_HOR * 2 - 6) / 2}
                />
              </View>
            );
          })
          }
        </View>
      </View>
    );
  };

  const HeaderLayout = () => {
    return (
      <View style={{paddingHorizontal: PADDING_HOR}}>
        <Text style={CommonStyle.text22_inter_r}>
          Discover deals at over
        </Text>
        <Text style={CommonStyle.text22_inter_sb}>
          {numberWithCommas(30000)} brands
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden={false} translucent={true} backgroundColor={'transparent'}/>

      <FeedNavHeader
        leftIcon={profileUrl}
        title={'TRUPAID'}
        onPressLeft={onPressLeft}
      />

      {HeaderLayout()}

      <View style={{flex: 1, backgroundColor: Theme.white, marginTop: 10}}>
        <Tabs data={tabData} scrollX={scrollX} onItemPress={onItemPress} pageNumber={pageNumber}/>

        <ScrollView showsVerticalScrollIndicator={false} style={{backgroundColor: '#F6F6F6'}}>

          {categoryData?.length > 0 &&
          <CategoriesView data={categoryData} setSelectCategory={setSelectCategory}/>
          }

          <Animated.FlatList
            scrollEnabled={false}
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
                },
              },
            )}
            bounces={false}
            renderItem={({item}) => {
              return (
                <View style={{width: WINDOW_WIDTH, marginTop: 10}}>
                  {item?.title === 'All offers' && <OfferLayout data={feedDeals}/>}
                  {item?.title === 'Trending offers' && <OfferLayout data={feedDeals}/>}
                </View>
              );
            }}
          />
          <View style={{height: Platform.OS === 'ios' ? 100 : 80}}/>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.white,
  },
  tabsContainer: {
    marginTop: 5,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Theme.background,
  },
  btnCategory: {
    ...CommonStyle.center,
    borderRadius: 8,
    height: 36,
    paddingHorizontal: 20,
    minWidth: WINDOW_WIDTH * 0.25,
  },
});

export default DealFeedScreen;
