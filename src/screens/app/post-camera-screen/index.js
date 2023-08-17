import React, {useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  StatusBar,
  Image,
  Platform,
  PermissionsAndroid,
  FlatList,
} from 'react-native';
// eslint-disable-next-line import/no-unresolved
import {RNCamera} from 'react-native-camera';
import PostNavHeader from '../../../components/post-nav-header';
import {Theme} from '../../../styles/theme';
import {navigation} from '../../../routes/navigation';
import LinearGradient from 'react-native-linear-gradient';
import {PADDING_HOR, WINDOW_HEIGHT} from '../../../styles/constant';
import {useDispatch} from 'react-redux';
import CameraRoll from '@react-native-community/cameraroll';
import {useFocusEffect} from '@react-navigation/native';
import {CommonStyle} from '../../../styles';

const BUTTON_SIZE = 68;
const GALLERY_SPACING = WINDOW_HEIGHT * 0.02;
const BUTTON_PADDING = 10; //WINDOW_HEIGHT * 0.018;
const BOTTOM_HEIGHT = WINDOW_HEIGHT * 0.29;

const PostCameraScreen = (props) => {
  const dispatch = useDispatch();
  const [flash, setFlash] = useState(false);
  const [selfie, setSelfie] = useState(false);
  const [ratio, setRatio] = useState('16:9');
  const [images, setImages] = useState([]);
  const [selectImage, setSelectImage] = useState(null);
  const [transactionInfo, setTransactionInfo] = useState(props?.route?.params?.item);
  const [showGallery, setShowGallery] = useState(false);
  const [visibleCamera, setVisibleCamera] = useState(true);

  const cameraRef = React.useRef(null);

  const askPermission = async () => {
    if (Platform.OS === 'android') {
      const result = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'Permission Explanation',
          message: 'TruPaid would like to access your photos!',
        },
      );
      if (result !== 'granted') {
        console.log('Access to pictures was denied');
        return;
      } else {
        getPhotos();
      }
    } else {
      getPhotos();
    }
  };

  useEffect(() => {
    askPermission();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      setVisibleCamera(true);
    }, []),
  );

  const getPhotos = () => {
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
        setSelectImage(items[0]);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const toggleFlash = () => {
    setFlash(!flash);
  };

  const toggleSelfie = () => {
    setSelfie(!selfie);
  };

  const takePicture = async () => {
    if (cameraRef) {
      const image = await cameraRef.current.takePictureAsync();
      const filename = image.uri.replace(/^.*[\\\/]/, '');
      const extension = filename.split('.').pop();
      const type = extension === 'png' ? 'image/png' : 'image/jpeg';
      const source = {
        src: Platform.OS === 'android' ? image.uri : image.uri.replace('file://', ''),
        type: type,
        name: `${filename}`,
        checked: true,
      };
      setSelectImage(source);
      await CameraRoll.save(image.uri, {type: 'photo'});
      navigation.goBack();
      navigation?.navigate('PostSelect', {images, selItem: null, item: transactionInfo});
    }
  };

  const onPressLeft = () => {
    navigation.goBack();
  };

  const onPressRight = () => {
    setVisibleCamera(false);
    navigation.navigate('PostPublish', {
      imageInfo: null,
      transactionInfo,
      isTagged: false,
    });
  };

  const onPressGallery = () => {
    setShowGallery(!showGallery);
  };

  const onPressCategoryItem = (selItem) => {
    navigation.goBack();
    navigation?.navigate('PostSelect', {images, selItem, item: transactionInfo});
  };

  const onPressMore = () => {
    setVisibleCamera(false);
    navigation.navigate('PostGallery', {images, selItem: null, item: transactionInfo});
  };

  const ButtonLayout = () => {
    return (
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.buttonWrapper} activeOpacity={0.73} onPress={onPressGallery}>
          <Image source={Theme.icon_gallery} style={styles.button}/>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => takePicture()}>
          <Image source={Theme.camera_capture} style={{width: 66, height: 66, resizeMode: 'contain'}}/>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonWrapper} activeOpacity={0.73} onPress={toggleSelfie}>
          <Image source={Theme.icon_camera_switch} style={styles.button}/>
        </TouchableOpacity>
      </View>
    );
  };

  const GalleryButton = (item) => {
    if (item.empty) {
      return (
        <View style={[styles.btnCategory, {}]}/>
      );
    }

    return (
      <TouchableOpacity style={[styles.btnCategory, {
        borderColor: item?.checked ? Theme.white : 'transparent',
        borderWidth: item?.checked ? 0 : 0,
      }]}
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
        paddingLeft: key === 0 ? PADDING_HOR - 17 : 1,
        paddingRight: key === images.length - 1 ? PADDING_HOR - 17 : 0,
      }}>
        {GalleryButton(item)}
      </View>
    );
  };

  const GalleryLayout = () => {
    return (
      <View>
        <View style={{alignItems: 'center', height: 30, justifyContent: 'center'}}>
          <TouchableOpacity onPress={onPressMore}>
            <Image source={Theme.icon_arrow_up}
                   style={{width: 18, height: 18, resizeMode: 'contain', tintColor: 'rgba(255, 255, 255, 0.8)'}}/>
          </TouchableOpacity>
        </View>
        <View style={styles.galleryContainer}>
          <FlatList
            showsHorizontalScrollIndicator={false}
            horizontal
            data={images}
            renderItem={({item, index}) =>
              RenderItem(item, index)
            }
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </View>
    );
  };

  const RenderCamera = () => {
    return (
      <RNCamera
        ref={cameraRef}
        style={{flex: 1}}
        type={selfie ? RNCamera.Constants.Type.front : RNCamera.Constants.Type.back}
        flashMode={flash ? RNCamera.Constants.FlashMode.on : RNCamera.Constants.FlashMode.off}
        ratio={ratio}
        captureAudio={false}
        androidCameraPermissionOptions={{
          title: 'Permission to use camera',
          message: 'We need your permission to use your camera',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel',
        }}
      >
        <PostNavHeader
          leftIcon={Theme.icon_close_w}
          title={'New Post'}
          rightText={'WITHOUT PHOTO'}
          rightIcon={Theme.next_arrow_w}
          onPressLeft={onPressLeft}
          onPressRight={onPressRight}
        />
        <View style={{alignItems: 'flex-end', marginTop: 16, marginRight: 16}}>
          <View style={{alignItems: 'center'}}>
            <TouchableOpacity style={styles.flipButton} onPress={toggleFlash}>
              <Image source={Theme.icon_flash}
                     style={{width: 16, height: 24, resizeMode: 'contain', opacity: flash ? 1 : 0.35}}/>
            </TouchableOpacity>
          </View>
        </View>

        <LinearGradient
          colors={['rgba(34,34,34,0.7)', 'rgba(34,34,34,0.7)']}
          style={[styles.linearGradient, {height: showGallery ? BOTTOM_HEIGHT : BUTTON_PADDING * 2 + 66 + 13}]}
        >
          {showGallery && GalleryLayout()}

          {ButtonLayout()}

        </LinearGradient>

      </RNCamera>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden={false} translucent={true} backgroundColor={'transparent'} barStyle={'light-content'}/>

      {visibleCamera && RenderCamera()}

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2E2E2E',
  },
  flipButton: {
    height: 42,
    width: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
    backgroundColor: 'rgba(57, 57, 57, 0.44)',
  },
  flipText: {
    color: 'white',
    fontSize: 15,
  },
  picButton: {
    backgroundColor: 'darkseagreen',
  },
  linearGradient: {
    position: 'absolute',
    width: '100%',
    height: BOTTOM_HEIGHT,
    bottom: 0,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingTop: BUTTON_PADDING + 5,
    paddingBottom: BUTTON_PADDING - 5,
  },
  buttonWrapper: {
    width: 44,
    height: 44,
    backgroundColor: 'rgba(164,164,164,0.1)',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  button: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
  },
  image: {
    width: BOTTOM_HEIGHT - 66 - 30 - BUTTON_PADDING * 2 - GALLERY_SPACING,
    height: BOTTOM_HEIGHT - 66 - 30 - BUTTON_PADDING * 2 - GALLERY_SPACING,
    resizeMode: 'cover',
  },
  galleryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  btnCategory: {
    ...CommonStyle.center,
    width: BOTTOM_HEIGHT - 66 - 30 - BUTTON_PADDING * 2 - GALLERY_SPACING,
    height: BOTTOM_HEIGHT - 66 - 30 - BUTTON_PADDING * 2 - GALLERY_SPACING,
  },
});

export default PostCameraScreen;
