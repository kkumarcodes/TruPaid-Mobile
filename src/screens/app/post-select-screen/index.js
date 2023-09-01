import React, { useEffect, useCallback, useState } from 'react';
import {
  View, StyleSheet, Image, StatusBar, Text, TouchableOpacity, ImageBackground, FlatList,
  Platform,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { Theme } from '../../../styles/theme';
import PostNavHeader from '../../../components/post-nav-header';
import LinearGradient from 'react-native-linear-gradient';
import { navigation } from '../../../routes/navigation';
import { PADDING_HOR, WINDOW_HEIGHT, WINDOW_WIDTH } from '../../../styles/constant';
import ImagePicker from 'react-native-image-crop-picker';
import { isIOS } from '../../../styles/global';
import { CommonStyle } from '../../../styles';
import { useFocusEffect } from '@react-navigation/native';
import { CameraRoll } from "@react-native-camera-roll/camera-roll";

const BUTTON_SIZE = 38;
const GALLERY_SPACING = 2;
const GALLERY_SPACING_TOTAL = GALLERY_SPACING * 4 + 6;
const BUTTON_PADDING = WINDOW_HEIGHT * 0.018;
const BOTTOM_HEIGHT = ((WINDOW_WIDTH - GALLERY_SPACING_TOTAL) / 4) * 2.3 + BUTTON_SIZE + BUTTON_PADDING * 2;

const PostSelectScreen = (props) => {
  const dispatch = useDispatch();
  const [images, setImages] = useState(props?.route?.params?.images);
  const [selectImage, setSelectImage] = useState(props?.route?.params?.selItem);
  const [transactionInfo, setTransactionInfo] = useState(props?.route?.params?.item);
  const [resizeMode, setResizeMode] = useState('cover');
  const [active, setActive] = useState(true);

  useEffect(() => {
    if (active) {
      setSelectImage(props?.route?.params?.selItem);
      getPhotos(props?.route?.params?.selItem);
    }
  }, [active]);

  useFocusEffect(
    React.useCallback(() => {
      setActive(true);
    }, []),
  );

  const getPhotos = (selItem) => {
    CameraRoll.getPhotos({
      first: 400,
      assetType: 'Photos',
      include: ['filename', 'fileSize', 'imageSize'],
    })
      .then((res) => {
        console.log(res.edges);
        let items = [];
        res.edges.map((item, i) => {
          items.push({
            id: i,
            src: item.node.image.uri,
            type: item.node.type,
            name: item.node.image.filename,
            height: item.node.image.height,
            width: item.node.image.width,
            fileSize: item.node.image.fileSize,
            checked: i === 0,
          });
        });

        setImages(items);
        initSelectCategoryItem(items, selItem);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const onPressLeft = () => {
    setActive(false);
    navigation.goBack();
  };

  const onPressRight = () => {
    navigation.navigate('PostPublish', {
      imageInfo: null,
      transactionInfo,
      isTagged: false,
    });
  };

  const onPressResizeMode = () => {
    if (resizeMode === 'contain') {
      setResizeMode('cover');
    } else {
      setResizeMode('contain');
    }
  };

  const openCamera = () => {
    ImagePicker.openCamera({
      ...Platform.select({
        ios: {
          width: 1500,
          height: 1500,
        },
      }),
      compressImageQuality: isIOS ? 0.8 : 0.8,
      cropping: true,
    }).then(image => {
      const filename = image.path.replace(/^.*[\\\/]/, '');
      const source = {
        src: Platform.OS === 'android' ? image.path : image.path.replace('file://', ''),
        type: image.mime,
        name: `${filename}`,
        checked: true,
      };
      setSelectImage(source);
    }).catch(err => {
      console.log(err);
    });
  };

  const openGallery = () => {
    ImagePicker.openPicker({
      ...Platform.select({
        ios: {
          width: 1500,
          height: 1500,
        },
      }),
      compressImageQuality: isIOS ? 0.8 : 0.8,
      mediaType: 'photo',
    }).then(async image => {
      await cropImages(image);
    }).catch(err => {
      console.log(err);
    });
  };

  const cropImages = async (orgImage) => {

    const image = await ImagePicker.openCropper({
      path: orgImage.path,
      ...Platform.select({
        ios: {
          width: 1500,
          height: 1500,
        },
      }),
    });

    const filename = image.path.replace(/^.*[\\\/]/, '');
    const source = {
      src: Platform.OS === 'android' ? image.path : image.path.replace('file://', ''),
      type: image.mime,
      name: `${filename}`,
      checked: true,
    };
    setSelectImage(source);
  };

  const initSelectCategoryItem = (images, selItem) => {
    let newImages = [];

    if (images.length < 1) {
      return;
    }
    if (!selItem) {
      images.map((item, key) => {
        if (key !== 0) {
          newImages.push({
            ...item,
            checked: false,
          });
        } else {
          newImages.push({
            ...item,
            checked: true,
          });
          setSelectImage(item);
        }
      });

      setImages(newImages);
    } else {
      images.map((item, key) => {
        if (item?.src !== selItem?.src) {
          newImages.push({
            ...item,
            checked: false,
          });
        } else {
          newImages.push({
            ...item,
            checked: true,
          });
          setSelectImage(item);
        }
      });
      setImages(newImages);
    }
  };

  const onPressCategoryItem = (selItem) => {
    let newImages = [];
    images.map((item, key) => {
      if (item?.src !== selItem?.src) {
        newImages.push({
          ...item,
          checked: false,
        });
      } else {
        newImages.push({
          ...item,
          checked: true,
        });
        setSelectImage(item);
      }
    });
    setImages(newImages);
  };

  const onPressCamera = () => {
    setActive(false);
    navigation?.navigate('PostCamera', { item: transactionInfo });
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
        <View style={[styles.btnCategory, {}]} />
      );
    }

    return (
      <TouchableOpacity style={[styles.btnCategory]}
        activeOpacity={0.73}
        onPress={() => onPressCategoryItem(item)}
      >
        <Image source={{ uri: item?.src }} style={styles.image} />
        {item?.checked && <View style={styles.imageMask} />}
        {item?.checked && <View style={styles.imageBorder} />}
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
          renderItem={({ item, index }) =>
            RenderItem(item, index)
          }
          keyExtractor={(item, index) => index.toString()}
          numColumns={4}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
        />
      </View>
    );
  };

  const ButtonLayout = () => {
    return (
      <View style={styles.buttonContainer}>

        <View style={CommonStyle.row}>
          <TouchableOpacity style={styles.buttonWrapper} activeOpacity={0.73} onPress={onPressCamera}>
            <Image source={Theme.icon_camera} style={styles.button} />
          </TouchableOpacity>

        </View>

        <TouchableOpacity style={styles.buttonCaptureWrapper} activeOpacity={0.73}
          // onPress={() => navigation.navigate('PostTab', {imageInfo: null, transactionInfo})}
          onPress={() => {
            navigation.navigate('PostTap', { imageInfo: selectImage, transactionInfo });
          }}
        >
          <Text style={[CommonStyle.text14_inter_r, { marginRight: 20 }]}>
            NEXT
          </Text>
          <Image source={Theme.next_arrow_w}
            style={{ width: 15, height: 13, resizeMode: 'contain', tintColor: Theme.black }} />
        </TouchableOpacity>

      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden={false} translucent={true} backgroundColor={'transparent'} barStyle={'light-content'} />

      <PostNavHeader
        leftIcon={Theme.icon_close_w}
        title={'New Post'}
        rightText={'WITHOUT PHOTO'}
        rightIcon={Theme.next_arrow_w}
        onPressLeft={onPressLeft}
        onPressRight={onPressRight}
      />

      <View style={[{ flex: 1, backgroundColor: 'rgba(87,87,87,1)' }]}>
        {selectImage?.src ?
          <ImageBackground source={{ uri: selectImage?.src }}
            style={{ width: '100%', height: WINDOW_HEIGHT - BOTTOM_HEIGHT - 80 }}
            imageStyle={{ resizeMode }}
          >
            <View style={{
              flex: 1,
              flexDirection: 'column-reverse',
              width: BUTTON_SIZE,
              height: BUTTON_SIZE,
              marginBottom: 16,
              marginLeft: 16,
            }}>
              <TouchableOpacity onPress={onPressResizeMode}>
                <Image source={Theme.icon_scale}
                  style={{ width: BUTTON_SIZE, height: BUTTON_SIZE, resizeMode: 'contain' }} />
              </TouchableOpacity>
            </View>
          </ImageBackground>
          : null}

        <LinearGradient
          colors={['rgba(34,34,34,0.7)', 'rgba(34,34,34,0.7)']}
          style={styles.linearGradient}
        >
          {ButtonLayout()}

          {GalleryLayout()}

        </LinearGradient>
      </View>

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
    alignItems: 'center',
  },
  btnCategory: {
    ...CommonStyle.center,
    width: (WINDOW_WIDTH - GALLERY_SPACING_TOTAL) / 4,
    height: (WINDOW_WIDTH - GALLERY_SPACING_TOTAL) / 4,
  },
});

export default PostSelectScreen;
