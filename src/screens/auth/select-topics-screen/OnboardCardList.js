import React from 'react';
import OnboardCardWrapper from './OnboardCardWrapper';
import {FlatList, RefreshControl, View} from 'react-native';

const OnboardCardList = (props) => {
  return (
    <FlatList
      data={props?.data}
      showsVerticalScrollIndicator={false}
      nestedScrollEnabled={true}
      keyExtractor={(item, index) => index.toString()}
      extraData={props?.data}
      numColumns={2}
      renderItem={({item, index}) =>
        <OnboardCardWrapper
          item={item}
          onPressItem={props?.onPressItem}
          index={index}
          type={props?.type}
        />
      }

      onEndReachedThreshold={0}
      onEndReached={props?.onEndReached}
      onScroll={({nativeEvent}) => props?.isCloseToBottom(nativeEvent)}

      refreshControl={
        <RefreshControl
          refreshing={props?.refreshing}
          onRefresh={props?.onRefresh}
        />
      }
      ListFooterComponent={() => <View style={{height: 0}}/>}
    >
    </FlatList>
  );
};

export default OnboardCardList;
