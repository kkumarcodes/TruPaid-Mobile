import React, {useEffect, useState} from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {Theme} from '../../../styles/theme';
import {navigation} from '../../../routes/navigation';
import {PADDING_HOR, WINDOW_WIDTH} from '../../../styles/constant';
import {IS_IPHONE_X, isIOS} from '../../../styles/global';
import {CommonStyle} from '../../../styles';
import BasicNavHeader from '../../../components/basic-nav-header';
import MainButton from '../../../components/main-button';
import {setReceipts} from '../../../redux/actions/app';
import {CREATE_POST_IMAGE_QUERY, CREATE_POST_QUERY} from '../../../utils/Query';
import {setApiLoading} from '../../../redux/actions/config';
import Share from 'react-native-share';
import {cloudinaryUpload} from '../../../utils/GlobalFunc';
import Toast from 'react-native-toast-message';
import {useMutation} from '@apollo/client';

const PostPublishScreen = (props) => {
    const dispatch = useDispatch();
    const receiptList = useSelector(state => state.app.receipts);
    const [selectImage, setSelectImage] = useState(props.route.params.imageInfo);
    const [transactionInfo, setTransactionInfo] = useState(props.route.params.transactionInfo);
    const [isTagged, setTagged] = useState(props.route.params.isTagged);
    const [description, setDescription] = useState('');
    const [facebook_lock, setFaceBookLock] = useState(false);
    const [instagram_lock, setInstagramLock] = useState(false);
    const [twitter_lock, setTwitterLock] = useState(false);
    const [cloudinaryData, setCloudinaryData] = useState(null);
    const [imageId, setImageId] = useState(-1);
    const [isPublish, setIsPublish] = useState(false);

    const [createPostImage, {data: createdImageData}] = useMutation(CREATE_POST_IMAGE_QUERY, {
      variables: {
        'payload': {
          'cloudinaryData': cloudinaryData,
        },
      },
    });

    const [createPost, {data: createPostData}] = useMutation(CREATE_POST_QUERY, {
      variables: {
        'payload': {
          'receiptId': transactionInfo?.id,
          'title': '',
          'description': description,
          'imageId': imageId ? imageId : null,
        },
      },
    });

    // create post image
    useEffect(() => {
      if (cloudinaryData?.secure_url) {
        dispatch(setApiLoading(true));
        createPostImage()
          .then(res => {
            // dispatch(setApiLoading(false));
            setCloudinaryData(null);
            const imageId = res?.data?.createPostImage?.id;
            setImageId(imageId);
            setIsPublish(true);
          })
          .catch(e => {
            dispatch(setApiLoading(false));
            console.log(e);
          });
      }
    }, [cloudinaryData?.secure_url]);

    // create post
    useEffect(() => {
      if (imageId !== -1) {
        dispatch(setApiLoading(true));
        createPost()
          .then(res => {
            dispatch(setApiLoading(false));
            console.log('create post success: ', res?.data);
            setIsPublish(false);
            setImageId(-1);
            const postData = res?.data?.createPost;
            let newList = [];
            receiptList.map((item, key) => {
              if (item?.id === transactionInfo?.id) {
                let newPosts = [...item?.posts];
                newPosts.push(postData);
                newList.push({
                  ...item,
                  shareTransaction: 1,
                  posts: newPosts,
                  newestPost: postData,
                });
              } else {
                newList.push(item);
              }
            });
            dispatch(setReceipts(newList));
            navigation.navigate('Profile');
          })
          .catch(e => {
            dispatch(setApiLoading(false));
            setIsPublish(false);
            setImageId(-1);
            console.log(e);
            Toast.show({
              type: 'toast_custom_type',
              text1: '',
              text2: 'Something error',
              visibilityTime: 3000,
            });
          });
      }
    }, [imageId]);

    const onPressLeft = () => {
      navigation.goBack();
    };

    const customShare = async () => {
      let options = {
        title: 'Share via',
        message: 'some message',
        url: selectImage?.src,
        social: Share.Social.FACEBOOK, //INSTAGRAM, // FACEBOOK, TWITTER, TELEGRAM
        forceDialog: true, //!isIOS,
      };

      console.log('---------------1------------------');
      if (facebook_lock) {
        const shareOptions = {
          ...options,
          title: 'Share via facebook',
          social: Share.Social.FACEBOOK, //INSTAGRAM, // FACEBOOK, TWITTER, TELEGRAM
          backgroundBottomColor: '#fefefe',
          backgroundTopColor: '#906df4',
        };
        try {
          const res = await Share.shareSingle(shareOptions);
          console.log(res);
        } catch (e) {
          console.log(e);
        }
      }
      console.log('---------------2------------------');
      if (twitter_lock) {
        const shareOptions = {
          ...options,
          title: 'Share via twitter',
          social: Share.Social.TWITTER, //INSTAGRAM, // FACEBOOK, TWITTER, TELEGRAM
        };
        try {
          const res = await Share.shareSingle(shareOptions);
          console.log(res);
        } catch (e) {
          console.log(e);
        }
      }
      console.log('---------------3------------------');
      if (instagram_lock) {
        const shareOptions = {
          ...options,
          title: 'Share via instagram',
          social: Share.Social.INSTAGRAM, //INSTAGRAM, // FACEBOOK, TWITTER, TELEGRAM
        };
        try {
          const res = await Share.shareSingle(shareOptions);
          console.log(res);
        } catch (e) {
          console.log(e);
        }
      }
      console.log('---------------4------------------');
    };

    const selectShare = async () => {
      const shareOptions = {
        message: description,
        url: selectImage?.src,
        // urls: [selectImage?.src, selectImage?.src],
        // filename: selectImage?.src,
      };

      Share.open(shareOptions)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          err && console.log(err);
        });
    };

    const onPressRight = () => {

    };

    const onPressPublish = async () => {

      if (!transactionInfo?.id) {
        return;
      }

      const cloduinaryResult = await cloudinaryUpload(selectImage, transactionInfo, isTagged);
      if (cloduinaryResult) {
        setCloudinaryData(cloduinaryResult);
      } else {
        setImageId(null);
      }
    };

    const onPressSwitch = (type, flag) => {
      if (type === 1) {
        setFaceBookLock(flag);
      } else if (type === 2) {
        setTwitterLock(flag);
      } else if (type === 3) {
        setInstagramLock(flag);
      }
    };

    const onPressFacebook = async () => {
      let shareOptions = {
        title: 'Share via instagram',
        message: description,
        url: selectImage?.src,
        social: Share.Social.FACEBOOK, //INSTAGRAM, // FACEBOOK, TWITTER, TELEGRAM
        forceDialog: true, //!isIOS,
      };

      try {
        const res = await Share.shareSingle(shareOptions);
        console.log(res);
      } catch (e) {
        console.log(e);
      }
    };

    const onPressTweeter = async () => {
      let shareOptions = {
        title: 'Share via instagram',
        message: description,
        url: selectImage?.src,
        social: Share.Social.TWITTER, //INSTAGRAM, // FACEBOOK, TWITTER, TELEGRAM
        forceDialog: true, //!isIOS,
      };

      try {
        const res = await Share.shareSingle(shareOptions);
        console.log(res);
      } catch (e) {
        console.log(e);
      }
    };

    const onPressInstagram = async () => {
      let shareOptions = {
        title: 'Share via instagram',
        message: description,
        url: selectImage?.src,
        social: Share.Social.INSTAGRAM, //INSTAGRAM, // FACEBOOK, TWITTER, TELEGRAM
        forceDialog: true, //!isIOS,
      };

      try {
        const res = await Share.shareSingle(shareOptions);
        console.log(res);
      } catch (e) {
        console.log(e);
      }
    };

    const TaggedBrand = () => {
      return (
        <View style={{marginTop: 20}}>
          <Text style={CommonStyle.text14_inter_sb}>
            Tagged brand
          </Text>

          {TabCard(transactionInfo?.brand?.name)}
        </View>
      );
    };

    const ShareLayout = () => {
      return (
        <View style={{marginTop: 25}}>
          <Text style={CommonStyle.text14_inter_sb}>
            Share your verified purchase
          </Text>

          <View style={{height: 15}}/>

          {/*<TouchableOpacity style={styles.btnShare} onPress={() => onPressFacebook()}>*/}
          {/*  <Image source={Theme.icon_instagram} style={styles.instagram}/>*/}
          {/*  <Text style={[CommonStyle.text12_inter_m, {paddingLeft: 10}]}>*/}
          {/*    Share To Facebook*/}
          {/*  </Text>*/}
          {/*</TouchableOpacity>*/}

          {/*<View style={{height: 10}}/>*/}

          {/*<TouchableOpacity style={styles.btnShare} onPress={() => onPressTweeter()}>*/}
          {/*  <Image source={Theme.icon_instagram} style={styles.instagram}/>*/}
          {/*  <Text style={[CommonStyle.text12_inter_m, {paddingLeft: 10}]}>*/}
          {/*    Share To Tweeter*/}
          {/*  </Text>*/}
          {/*</TouchableOpacity>*/}

          {/*<View style={{height: 10}}/>*/}

          <TouchableOpacity style={styles.btnShare} onPress={() => onPressInstagram()}>
            <Image source={Theme.icon_instagram} style={styles.instagram}/>
            <Text style={[CommonStyle.text12_inter_m, {paddingLeft: 10}]}>
              Share To Instagram
            </Text>
          </TouchableOpacity>

          {/*<CustomSwitch*/}
          {/*  title={'Facebook'}*/}
          {/*  locked={facebook_lock}*/}
          {/*  type={1}*/}
          {/*  onPressItem={onPressSwitch}>*/}
          {/*</CustomSwitch>*/}

          {/*<CustomSwitch*/}
          {/*  title={'Twitter'}*/}
          {/*  locked={twitter_lock}*/}
          {/*  type={2}*/}
          {/*  onPressItem={onPressSwitch}>*/}
          {/*</CustomSwitch>*/}

          {/* <CustomSwitch
            title={'Instagram'}
            locked={instagram_lock}
            type={3}
            onPressItem={onPressSwitch}>
          </CustomSwitch> */}

          <View style={{height: 30}}/>

          {/*<View style={styles.container}>*/}
          {/*  <TouchableOpacity*/}
          {/*    style={[styles.btnWrapper]}*/}
          {/*    activeOpacity={0.73}*/}
          {/*    onPress={customShare}*/}
          {/*  >*/}
          {/*    <Text style={[CommonStyle.text14_inter_r, {color: Theme.black}]}>*/}
          {/*      Share*/}
          {/*    </Text>*/}
          {/*  </TouchableOpacity>*/}
          {/*</View>*/}

          <View style={{height: 20}}/>
          {/*<View style={styles.container}>*/}
          {/*  <TouchableOpacity*/}
          {/*    style={[styles.btnWrapper]}*/}
          {/*    activeOpacity={0.73}*/}
          {/*    onPress={selectShare}*/}
          {/*  >*/}
          {/*    <Text style={[CommonStyle.text14_inter_r, {color: Theme.black}]}>*/}
          {/*      Select to share*/}
          {/*    </Text>*/}
          {/*  </TouchableOpacity>*/}
          {/*</View>*/}

        </View>
      );
    };

    const TabCard = (text) => {
      return (
        <View style={{marginTop: 10, flexDirection: 'row'}}>
          <View style={styles.tabCardContainer}>
            <Text style={CommonStyle.text12_inter_r}>
              {text}
            </Text>
            <View style={{paddingHorizontal: 10}}>
              <Image source={Theme.icon_receipt} style={styles.imageReceipt}/>
            </View>
            <TouchableOpacity style={styles.closeWrapper} onPress={() => setTagged(false)}>
              <Image source={Theme.icon_close_w} style={styles.close}/>
            </TouchableOpacity>
          </View>
        </View>
      );
    };

    return (
      <View style={styles.container}>
        <StatusBar hidden={false} translucent={true} backgroundColor={'transparent'} barStyle={'dark-content'}/>

        <BasicNavHeader
          leftIcon={Theme.icon_back_arrow_w}
          title={'New Post'}
          rightText={'Next'}
          onPressLeft={onPressLeft}
          onPressRight={onPressRight}
        />

        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                              style={{flex: 1, paddingHorizontal: PADDING_HOR}}>
          <ScrollView showsVerticalScrollIndicator={false}
                      contentContainerStyle={{paddingTop: 10}}
          >
            {selectImage?.src ?
              <View style={styles.imageWrapper}>
                <Image source={{uri: selectImage?.src}} style={styles.image}/>
              </View>
              : <View style={styles.imageWrapper2}/>
            }

            <View style={{marginTop: 20}}>
              <Text style={CommonStyle.text14_inter_sb}>
                Description
              </Text>
              <View style={[styles.descWrapper, {marginTop: 10}]}>
                <TextInput
                  placeholder={'Description'}
                  placeholderTextColor={'#B8B8B8'}
                  style={styles.input}
                  underlineColorAndroid='transparent'
                  textAlignVertical="top"
                  multiline={true}
                  value={description}
                  onChangeText={(text) => setDescription(text)}
                />
              </View>
            </View>

            {isTagged && TaggedBrand()}

            {ShareLayout()}

            <View style={{height: IS_IPHONE_X ? 20 : 0}}/>

          </ScrollView>

        </KeyboardAvoidingView>

        <View style={styles.btnContainer}>
          <MainButton
            onPress={onPressPublish}
            title={'Publish'}
            isValid={true}
          />
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
  imageWrapper: {
    width: 88,
    height: 88,
    borderRadius: 6,
    overflow: 'hidden',
  },
  imageWrapper2: {
    width: 88,
    height: 88,
    borderRadius: 6,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Theme.grey,
  },
  image: {
    width: 88,
    height: 88,
    resizeMode: 'cover',
  },
  descWrapper: {
    borderRadius: 8,
    borderColor: '#E5E5E5',
    borderWidth: 1,
    height: 150,
    width: '100%',
    padding: 16,
    paddingVertical: 5,
    backgroundColor: '#F9F9F9',
  },
  input: {
    ...CommonStyle.text14_inter_r,
  },
  tabCardContainer: {
    ...CommonStyle.row,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#F3F3F3',
  },
  imageReceipt: {
    width: 12,
    height: 15,
    resizeMode: 'cover',
    tintColor: Theme.black,
  },
  closeWrapper: {
    width: 15,
    height: 15,
    borderRadius: 15,
    backgroundColor: 'rgba(80,80,80,0.1)',
    ...CommonStyle.center,
  },
  close: {
    width: 6,
    height: 6,
    resizeMode: 'cover',
    tintColor: Theme.grey,
  },
  btnContainer: {
    width: WINDOW_WIDTH,
    paddingHorizontal: PADDING_HOR,
    paddingBottom: 30,
    paddingTop: 10,
    alignSelf: 'center',
    justifyContent: 'flex-end',
    backgroundColor: Theme.white,
  },
  btnWrapper: {
    height: 48,
    backgroundColor: Theme.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  instagram: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
  },
  btnShare: {
    ...CommonStyle.row,
    justifyContent: 'center',
    backgroundColor: Theme.background,
    borderRadius: 8,
    paddingVertical: 13,
    alignSelf: 'flex-start',
    paddingHorizontal: 30,
    width: 200,
  },
});

export default PostPublishScreen;
