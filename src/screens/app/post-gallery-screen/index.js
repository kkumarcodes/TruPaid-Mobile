import React, {useEffect, useCallback, useState} from 'react';
import {
  View, StyleSheet, Image, StatusBar, TouchableOpacity, FlatList, Text,
} from 'react-native';
import {useDispatch} from 'react-redux';
import {Theme} from '../../../styles/theme';
import PostNavHeader from '../../../components/post-nav-header';
import {navigation} from '../../../routes/navigation';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../../../styles/constant';
import {CommonStyle} from '../../../styles';

const BUTTON_SIZE = 38;
const GALLERY_SPACING = 2;
const GALLERY_SPACING_TOTAL = GALLERY_SPACING * 4 + 6;
const BUTTON_PADDING = WINDOW_HEIGHT * 0.018;
const BOTTOM_HEIGHT = ((WINDOW_WIDTH - GALLERY_SPACING_TOTAL) / 4) * 2.3 + BUTTON_SIZE + BUTTON_PADDING * 2;

const PostGalleryScreen = (props) => {
    const dispatch = useDispatch();
    const [images, setImages] = useState(props?.route?.params?.images);
    const [transactionInfo, setTransactionInfo] = useState(props?.route?.params?.item);

    const onPressLeft = () => {
      navigation.goBack();
    };

    const onPressRight = () => {
      navigation.navigate('PostPublish', {
        imageInfo: null,
        transactionInfo,
        isTagged: false,
      });
    };

    const onPressCategoryItem = (selItem) => {
      navigation.goBack();
      navigation.goBack();
      navigation?.navigate('PostSelect', {images, selItem, item: transactionInfo});
    };

    // Adjust(fill) end item of row in FlatList Grid
    const formatData = (data, numColumns) => {
      let tempData = {
        src: '',
        empty: true,
      };
      const numberOfFullRows = Math.floor(data.length / numColumns);
      let numberOfElementsLastRow = data.length - (numberOfFullRows * numColumns);
      while (numberOfElementsLastRow !== numColumns && numberOfElementsLastRow !== 0) {
        data.push(tempData);
        numberOfElementsLastRow = numberOfElementsLastRow + 1;
      }

      return data;
    };

    const GalleryButton = (item) => {
      if (item.empty) {
        return (
          <View style={[styles.btnCategory, {}]}/>
        );
      }

      return (
        <TouchableOpacity style={[styles.btnCategory, {}]}
                          activeOpacity={0.73}
                          onPress={() => onPressCategoryItem(item)}
        >
          <Image source={{uri: item?.src}} style={styles.image}/>
        </TouchableOpacity>
      );
    };

    const RenderItem = (item, key) => {
      return (
        <View style={{
          paddingLeft: key % 4 === 0 ? 3 : 0,
          paddingRight: key % 4 === 3 ? 3 : 0,
        }}>
          {GalleryButton(item)}
        </View>
      );
    };

    const GalleryLayout = () => {
      return (
        <View style={styles.galleryContainer}>
          <FlatList
            showsHorizontalScrollIndicator={false}
            data={formatData(images, 4)}
            renderItem={({item, index}) =>
              RenderItem(item, index)
            }
            keyExtractor={(item, index) => index.toString()}
            numColumns={4}
            columnWrapperStyle={{justifyContent: 'space-between'}}
          />
        </View>
      );
    };

    return (
      <View style={styles.container}>
        <StatusBar hidden={false} translucent={true} backgroundColor={'transparent'} barStyle={'light-content'}/>

        <PostNavHeader
          leftIcon={Theme.arrow_left}
          onPressLeft={onPressLeft}
          onPressRight={onPressRight}
        />

        {GalleryLayout()}

      </View>
    );
  }
;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2E2E2E',
  },
  headerContainer: {
    marginTop: 47,
    alignItems: 'center',
  },
  linearGradient: {
    position: 'absolute',
    width: '100%',
    height: BOTTOM_HEIGHT,
    bottom: 0,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: BUTTON_PADDING,
  },
  buttonWrapper: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    backgroundColor: 'rgba(164,164,164,0.4)',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  button: {
    width: 20,
    height: 18,
    resizeMode: 'contain',
  },
  buttonCaptureWrapper: {
    flexDirection: 'row',
    backgroundColor: Theme.white,
    borderRadius: 100,
    borderColor: 'rgba(222,222,222,1)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 20,
    paddingRight: 10,
    height: BUTTON_SIZE,
  },
  image: {
    width: (WINDOW_WIDTH - GALLERY_SPACING_TOTAL) / 4,
    height: (WINDOW_WIDTH - GALLERY_SPACING_TOTAL) / 4,
    resizeMode: 'cover',
  },
  imageMask: {
    position: 'absolute',
    width: (WINDOW_WIDTH - GALLERY_SPACING_TOTAL) / 4,
    height: (WINDOW_WIDTH - GALLERY_SPACING_TOTAL) / 4,
    backgroundColor: 'rgba(255,255,255,0.58)',
  },
  imageBorder: {
    position: 'absolute',
    width: (WINDOW_WIDTH - GALLERY_SPACING_TOTAL) / 4,
    height: (WINDOW_WIDTH - GALLERY_SPACING_TOTAL) / 4,
    backgroundColor: 'transparent',
    borderWidth: 3,
    borderColor: Theme.white,
  },
  galleryContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  btnCategory: {
    ...CommonStyle.center,
    width: (WINDOW_WIDTH - GALLERY_SPACING_TOTAL) / 4,
    height: (WINDOW_WIDTH - GALLERY_SPACING_TOTAL) / 4,
  },
  listItemEmpty: {
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
    marginVertical: 3,
    marginHorizontal: 1,
  },
  itemInvisible: {
    backgroundColor: 'transparent',
  },
});

export default PostGalleryScreen;
