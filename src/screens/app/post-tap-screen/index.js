import React, {useEffect, useCallback, useState} from 'react';
import {View, StyleSheet, Image, StatusBar, Text, TouchableOpacity, ImageBackground, ScrollView} from 'react-native';
import {useDispatch} from 'react-redux';
import {Theme} from '../../../styles/theme';
import PostNavHeader from '../../../components/post-nav-header';
import LinearGradient from 'react-native-linear-gradient';
import {navigation} from '../../../routes/navigation';
import {PADDING_HOR, WINDOW_HEIGHT} from '../../../styles/constant';
import {IS_IPHONE_X, isIOS} from '../../../styles/global';
import {CommonStyle} from '../../../styles';

const PostTapScreen = (props) => {
  const dispatch = useDispatch();
  const [selectImage, setSelectImage] = useState(props.route.params.imageInfo);
  const [transactionInfo, setTransactionInfo] = useState(props.route.params.transactionInfo);
  const [isTagged, setTagged] = useState(false);
  const [tagX, setTagPositionX] = useState(false);
  const [tagY, setTagPositionY] = useState(false);

  useEffect(() => {

  }, []);

  const onPressLeft = () => {
    navigation.goBack();
  };

  const onPressRight = () => {
    navigation.navigate('PostPublish', {imageInfo: selectImage, transactionInfo, isTagged});
  };

  const onPressTap = () => {
    setTagged(true);
  };
  const TagButton = () => {
    return (
      <View style={[styles.tagButtonContainer, {top: tagY, left: tagX}]}>
        <View style={[styles.circle1, {marginRight: 20}]}>
          <View style={styles.circle2}>
            <View style={styles.circle3}>
            </View>
          </View>
        </View>
        <View style={styles.btnTab}>
          <Text style={CommonStyle.text14_inter_r}>
            {transactionInfo?.brand?.name}
          </Text>
        </View>
      </View>
    );
  };

  const TagText = () => {
    return (
      <View style={styles.tagText} onPress={() => onPressTap()}>
        <Text style={[CommonStyle.text14_inter_r, {color: Theme.white}]}>
          Tap to tag purchases from {transactionInfo?.brand?.name}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden={false} translucent={true} backgroundColor={'transparent'} barStyle={'light-content'}/>

      <PostNavHeader
        leftIcon={Theme.icon_back_arrow_w}
        title={'New Post'}
        rightText={'Next'}
        onPressLeft={onPressLeft}
        onPressRight={onPressRight}
      />

      <TouchableOpacity
        style={[{flex: 1}]}
        activeOpacity={1.0}
        onPress={(event) => {
          const {
            // Location (x,y) is relative to
            // the top-left of the component
            locationX,
            locationY,

            // Page (x,y) is relative to
            // the top-left of the device screen
            pageX,
            pageY,
          } = event.nativeEvent;

          setTagged(true);
          setTagPositionX(pageX - 4);
          setTagPositionY(pageY - 96);
        }}
      >
        {selectImage?.src ?
          <ImageBackground source={{uri: selectImage?.src}}
                           style={{width: '100%', height: '100%'}}
                           imageStyle={{resizeMode: 'contain'}}
          >
            <LinearGradient
              colors={['rgba(0,0,0,0.0)', 'rgba(33,33,33, 0.7)', 'rgba(33,33,33, 1)']}
              style={styles.linearGradient}
            />

            <View style={{flex: 1}}>
              {isTagged && TagButton()}
            </View>

            {TagText()}
          </ImageBackground>
          :
          <View style={{flex: 1, backgroundColor: Theme.grey}}>
            <LinearGradient
              colors={['rgba(0,0,0,0.0)', 'rgba(33,33,33, 0.7)', 'rgba(33,33,33, 1)']}
              style={styles.linearGradient}
            />

            <View style={{flex: 1}}>
              {isTagged && TagButton()}
            </View>

            {TagText()}
          </View>
        }
      </TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2E2E2E',
  },
  linearGradient: {
    position: 'absolute',
    width: '100%',
    height: WINDOW_HEIGHT * 0.2,
    bottom: 0,
  },
  btnTab: {
    backgroundColor: Theme.white,
    borderRadius: 4,
    paddingHorizontal: 15,
    paddingVertical: 7,
  },
  circle1: {
    backgroundColor: 'rgba(255,255,255,1)',
    width: 12,
    height: 12,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle2: {
    backgroundColor: 'rgba(255,255,255, 0.6)',
    width: 20,
    height: 20,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle3: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    width: 30,
    height: 30,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tagButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    // ...CommonStyle.center,
  },
  tagText: {
    ...CommonStyle.center,
    marginBottom: IS_IPHONE_X ? 50 : 30,
    paddingTop: 10,
  },
});

export default PostTapScreen;
