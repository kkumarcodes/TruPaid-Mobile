import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image, Text, ScrollView, Animated,
} from 'react-native';
import {PADDING_HOR, WINDOW_WIDTH} from '../../../styles/constant';
import {CommonStyle} from '../../../styles';
import {useDispatch, useSelector} from 'react-redux';
import {Theme} from '../../../styles/theme';
import FeedCard from '../../../components/feed-card';
import {popularPostList} from '../../../assets/template/template';
import {numberWithCommas} from '../../../styles/global';

const MostPopularPostCard = () => {
  const dispatch = useDispatch();
  const [popularPostData, setPopularPostData] = useState(popularPostList);
  let ref = React.useRef();
  const scrollX = new Animated.Value(0);

  const TextItemLayout = (title, value, icon) => {
    return (
      <View style={[CommonStyle.row_bw, {paddingTop: 6}]}>
        <View style={CommonStyle.row}>
          {icon &&
          <Image source={icon} style={styles.iconR}/>
          }
          <Text style={[CommonStyle.text12_inter_r, {color: Theme.black, paddingLeft: icon ? 5 : 0}]}>
            {title}
          </Text>
        </View>

        <Text style={CommonStyle.text12_inter_r}>
          {title === 'Earned Cash' ? `$ ${numberWithCommas(value)}` : numberWithCommas(value)}
        </Text>
      </View>
    );
  };

  const ProductLayout = (item, index) => {
    return (
      <View style={{width: WINDOW_WIDTH - 2 * PADDING_HOR}}>
        <FeedCard item={item} borderRadius={6} onPressItem={() => console.log('aaa')}/>

        <View style={{height: 10}}/>
        {TextItemLayout('Purchases by Followers', item?.purchases, Theme.icon_r)}
        {TextItemLayout('Post Interactions', item?.post_interactions)}
        {TextItemLayout('Earned Cash', item?.earned_cash, Theme.icon_r)}
      </View>
    );
  };

  const PopularPostView = () => {
    let position = Animated.divide(scrollX, WINDOW_WIDTH);

    return (
      <View style={{
        flex: 1,
        alignSelf: 'center',
        justifyContent: 'center',
        marginTop: 15,
      }}>
        <ScrollView
          ref={ref}
          snapToInterval={WINDOW_WIDTH}
          decelerationRate={0.85}
          horizontal={true}
          pagingEnabled={true}
          snapToAlignment={'center'}
          nestedScrollEnabled={true}
          showsHorizontalScrollIndicator={false}
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {x: scrollX}}}],
            {useNativeDriver: false},
          )}
          scrollEventThrottle={16}
          style={{marginHorizontal: 0, marginTop: 0}}
        >
          {Array.isArray(popularPostData) && popularPostData?.map((item, key) => (
            <View key={key} style={{width: WINDOW_WIDTH, paddingHorizontal: PADDING_HOR}}>
              {ProductLayout(item, key)}
            </View>
          ))}
        </ScrollView>

        <View style={{flexDirection: 'row', marginTop: 20, alignSelf: 'center'}}>
          {popularPostData?.map((_, i) => {
            let opacity = position.interpolate({
              inputRange: [i - 1, i, i + 1],
              outputRange: [0.3, 1, 0.3],
              extrapolate: 'clamp',
            });

            let dotColor = position.interpolate({
              inputRange: [i - 1, i, i + 1],
              outputRange: ['rgba(63, 63, 198, 0.15)', '#B0B0CC', 'rgba(63, 63, 198, 0.15)'],
              extrapolate: 'clamp',
            });

            return (
              <Animated.View
                key={i}
                style={{
                  opacity,
                  height: 7,
                  width: 7,
                  backgroundColor: dotColor,
                  margin: 5,
                  borderRadius: 10,
                }}
              />
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <View style={{paddingTop: 30, justifyContent: 'center', marginHorizontal: -PADDING_HOR}}>

      <TouchableOpacity style={[CommonStyle.row_bw, {paddingHorizontal: PADDING_HOR}]}>
        <Text style={[CommonStyle.text14_inter_m, {color: Theme.black, paddingLeft: 5}]}>
          Most popular posts
        </Text>
        <Image source={Theme.arrow_right} style={styles.arrowRight}/>
      </TouchableOpacity>

      {PopularPostView()}
    </View>
  );
};

const styles = StyleSheet.create({
  arrowRight: {
    width: 12,
    height: 12,
    resizeMode: 'contain',
  },
  iconR: {
    width: 11,
    height: 11,
    resizeMode: 'contain',
  },
});

export default MostPopularPostCard;
