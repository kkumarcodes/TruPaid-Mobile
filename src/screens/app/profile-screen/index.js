import React, {useEffect, useRef, useState} from 'react';
import {View, StyleSheet, StatusBar, Text, TouchableOpacity, Image, ScrollView, Platform} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {Theme} from '../../../styles/theme';
import {CommonStyle} from '../../../styles';
import {navigation} from '../../../routes/navigation';
import {PADDING_HOR, WINDOW_WIDTH} from '../../../styles/constant';
import {isIOS, numberWithCommas} from '../../../styles/global';
import ProfileNavHeader from '../../../components/profile-nav-header';
import CustomSwipe from '../../../components/custom-swipe';
import LinearGradient from 'react-native-linear-gradient';
import MyReceiptCard from '../../../components/my-receipt-card';
import {setReceipts} from '../../../redux/actions/app';
import {GlobalVariables} from '../../../utils/GlobalVariables';
import {
  CREATE_PROFILE_IMAGE_QUERY,
  INFLUENCED_BY_QUERY,
  MY_RECEIPTS_QUERY,
  UPDATE_USER_PROFILE_QUERY,
} from '../../../utils/Query';
import ApiGraphqlKit from '../../../utils/ApiGraphqlKit';
import {setApiLoading} from '../../../redux/actions/config';
import {useMutation, useQuery} from '@apollo/client';
import ImagePicker from 'react-native-image-crop-picker';
import RBSheet from 'react-native-raw-bottom-sheet';
import {cloudinaryUpload} from '../../../utils/GlobalFunc';
import Toast from 'react-native-toast-message';
import {updateProfileImage} from '../../../redux/actions/auth';

const ProfileScreen = (props) => {
    const dispatch = useDispatch();
    const user_profile = useSelector(state => state?.auth?.user_profile);
    const user_info = useSelector(state => state?.auth?.user_info);
    const receiptList = useSelector(state => state.app.receipts);
    const [currentlyOpenSwipeable, setCurrentlyOpenSwipeable] = useState(null);
    const [traits, setTraits] = useState(user_info?.session?.identity?.traits);
    const [myProfile, setMyProfile] = useState([]);
    const [myPostCount, setMyPostCount] = useState(0);
    const [person, setPerson] = useState(null);
    const [profileUrl, setProfileUrl] = useState('');
    const [cloudinaryData, setCloudinaryData] = useState(null);
    const [imageId, setProfileImageId] = useState(null);
    const refRBSheet = useRef();

    const {data: myReceiptsData, loading, error} = useQuery(MY_RECEIPTS_QUERY);

    const [createProfileImage, {data: createdImageData}] = useMutation(CREATE_PROFILE_IMAGE_QUERY, {
      variables: {
        'payload': {
          'cloudinaryData': cloudinaryData,
        },
      },
    });

    const [updateUserProfile, {data: updatedUserProfileData}] = useMutation(UPDATE_USER_PROFILE_QUERY, {
      variables: {
        'payload': {
          'userId': user_info?.session?.identity?.id,
          'imageId': imageId,
        },
      },
    });

    useEffect(() => {
      dispatch(setApiLoading(loading));
    }, [loading]);

    useEffect(() => {
      const myReceipts = myReceiptsData?.myReceipts ? myReceiptsData?.myReceipts : [];
      getMyProfile(myReceipts);
      getReceipts(myReceipts);
    }, [myReceiptsData]);

    // create profile image
    useEffect(() => {
      if (cloudinaryData?.secure_url) {
        dispatch(setApiLoading(true));
        createProfileImage()
          .then(res => {
            // dispatch(setApiLoading(false));
            const imageId = res?.data?.createProfileImage?.id;
            setProfileImageId(imageId);
          })
          .catch(e => {
            dispatch(setApiLoading(false));
            console.log(e);
          });
      }
    }, [cloudinaryData?.secure_url]);

    // update user profile
    useEffect(() => {
      if (imageId) {
        dispatch(setApiLoading(true));
        updateUserProfile()
          .then(res => {
            dispatch(setApiLoading(false));
            if (res?.data?.updateUserProfile) {
              Toast.show({
                type: 'toast_custom_type',
                text1: '',
                text2: 'Your profile was updated successfully',
                visibilityTime: 3000,
              });

              const payload = {
                '__typename': 'ProfileImage',
                'cloudinaryData': cloudinaryData,
                'id': imageId,
              };

              dispatch(updateProfileImage(payload));
              setProfileImageId(null);
              setCloudinaryData(null);

            } else {
              Toast.show({
                type: 'toast_custom_type',
                text1: '',
                text2: 'Something error',
                visibilityTime: 3000,
              });
            }
          })
          .catch(e => {
            dispatch(setApiLoading(false));
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

    useEffect(() => {
      setPerson(user_profile);
      setProfileUrl(user_profile?.profile.image?.cloudinaryData?.secure_url);
    }, [user_profile]);

    const getMyProfile = (inputData) => {

      if (Array.isArray(inputData) && inputData?.length > 0) {
        const myProfile = inputData[0]?.user;
        setMyProfile(myProfile);
      }
    };

    const getReceipts = (inputData) => {
      let newReceipts = [];
      let totalPostCount = 0;
      Array.isArray(inputData) && inputData.map((item) => {
        newReceipts.push({
          'amount': item?.amount,
          'brand': item?.brand,
          'description': item?.description,
          'id': item?.id,
          'posts': item?.posts,
          'status': item?.status,
          'subtype': item?.subtype,
          'timestamp': item?.timestamp,
          'visibility': item?.visibility,
          'user': item?.user,
          shareTransaction: 0,
          newestPost: item?.posts?.length < 1 ? null : item?.posts[item?.posts?.length - 1],
        });

        totalPostCount = totalPostCount + (item?.posts?.length > 0 ? item?.posts?.length : 0);

      });

      const reversedReceipts = newReceipts.reverse();
      dispatch(setReceipts(reversedReceipts));
      setMyPostCount(totalPostCount);
    };

    const onPressRight = () => {
      navigation.navigate('Setting');
    };

    const onPressCamera = () => {
      ImagePicker.openCamera({
        ...Platform.select({
          ios: {
            width: 1500,
            height: 1500,
          },
        }),
        compressImageQuality: isIOS ? 0.8 : 0.8,
        cropping: true,
      }).then(async image => {
        const filename = image.path.replace(/^.*[\\\/]/, '');
        const source = {
          src: Platform.OS === 'android' ? image.path : image.path.replace('file://', ''),
          type: image.mime,
          name: `${filename}`,
        };
        setProfileUrl(image.path);

        refRBSheet.current.close();

        const cloduinaryResult = await cloudinaryUpload(source, null, false);
        setCloudinaryData(cloduinaryResult);
        setProfileUrl(cloduinaryResult?.secure_url);
      }).catch(err => {
        refRBSheet.current.close();
        console.log(err);
      });
    };

    const onPressGallery = () => {
      ImagePicker.openPicker({
        ...Platform.select({
          ios: {
            width: 1500,
            height: 1500,
          },
        }),
        compressImageQuality: isIOS ? 0.8 : 0.8,
        cropping: true,
      }).then(async image => {
        const filename = image.path.replace(/^.*[\\\/]/, '');
        const source = {
          src: Platform.OS === 'android' ? image.path : image.path.replace('file://', ''),
          type: image.mime,
          name: `${filename}`,
        };
        setProfileUrl(image.path);

        refRBSheet.current.close();

        const cloduinaryResult = await cloudinaryUpload(source, null, false);
        setCloudinaryData(cloduinaryResult);

        // setProfileUrl(url);
      }).catch(err => {
        refRBSheet.current.close();
        console.log(err);
      });
    };

    const onPressItem = (item) => {
      navigation?.navigate('PostDetail', {postId: item?.newestPost?.id});
    };

    const onPressBuyingClub = (postId) => {

      return;

      const variables = {
        'postId': '6e2c6dbb-1939-4d17-b05a-1834869162a9',
      };

      let body = {
        'operationName': null,
        'variables': variables,
        'query': INFLUENCED_BY_QUERY,
      };

      dispatch(setApiLoading(true));
      ApiGraphqlKit.post('', body).then(res => {
        dispatch(setApiLoading(false));
        console.log('buying club success: ', res?.data);
      }).catch(e => {
        dispatch(setApiLoading(false));
        console.log('create post error: ', e?.response?.data);
      });
    };

    const onPressCancel = (item) => {
      return;

      if (!Array.isArray(receiptList) || receiptList?.length < 1) {
        return;
      }

      const findIndex = receiptList.findIndex(item => item?.shareTransaction === 1);

      if (findIndex > -1) {
        console.log(receiptList[findIndex]);
        let newList = [...receiptList];

        const selectItem = receiptList[findIndex];
        newList[findIndex] = {
          ...selectItem,
          shareTransaction: 0,
        };
        GlobalVariables.global_transaction_cancel = true;
        dispatch(setReceipts(newList));
      }
    };

    const onSwipeLeft = (item) => {
      navigation?.navigate('PostCamera', {item});
    };

    const CardLayout = () => {
      return (
        <View style={styles.cardWrapper}>
          <View style={[CommonStyle.row]}>
            <Image source={Theme.icon_receipt} style={styles.card}/>
            <View style={{paddingLeft: 8}}>
              <Text style={CommonStyle.text12_inter_r}>
                {numberWithCommas(person?.profile?.stats?.numReceipts)}
              </Text>
            </View>
          </View>

          <View style={[CommonStyle.row, {marginHorizontal: WINDOW_WIDTH * 0.1}]}>
            <Image source={Theme.icon_cart_yellow} style={styles.card}/>
            <View style={{paddingLeft: 8}}>
              <Text style={CommonStyle.text12_inter_r}>
                {numberWithCommas(person?.profile?.stats?.totalPendingDemand)}
              </Text>
            </View>
          </View>

          <View style={[CommonStyle.row]}>
            <Image source={Theme.icon_card} style={styles.card}/>
            <View style={{paddingLeft: 8}}>
              <Text style={CommonStyle.text12_inter_r}>
                {numberWithCommas(person?.profile?.stats?.totalInfluencedPurchases)}
              </Text>
            </View>
          </View>

        </View>
      );
    };

    const SocietyLayout = () => {
      return (
        <View style={[CommonStyle.row_bw, {paddingVertical: 20}]}>
          <View style={[CommonStyle.center, {flex: 1}]}>
            <Text style={CommonStyle.text16_inter_m}>
              {numberWithCommas(person?.profile?.stats?.numPosts)}
            </Text>
            <Text style={[CommonStyle.text11_inter_r, {paddingTop: 2}]}>
              Posts
            </Text>
          </View>

          <View style={[{flex: 1}]}>
            <View style={CommonStyle.row_bw}>
              <View style={styles.verticalLine}/>

              <View style={CommonStyle.center}>
                <Text style={CommonStyle.text16_inter_m}>
                  {numberWithCommas(person?.profile?.stats?.numFollowers)}
                </Text>
                <Text style={[CommonStyle.text11_inter_r, {paddingTop: 2}]}>
                  Followers
                </Text>
              </View>

              <View style={styles.verticalLine}/>
            </View>
          </View>

          <View style={[CommonStyle.center, {flex: 1}]}>
            <Text style={CommonStyle.text16_inter_m}>
              {numberWithCommas(person?.profile?.stats?.numFollowing)}
            </Text>
            <Text style={[CommonStyle.text11_inter_r, {paddingTop: 2}]}>
              Following
            </Text>
          </View>
        </View>
      );
    };

    const ProfileCardLayout = () => {
      return (
        <View style={{paddingHorizontal: PADDING_HOR, paddingVertical: 10}}>
          <View style={{flexDirection: 'row'}}>
            <View style={[CommonStyle.center, {flex: 1}]}>
              <View style={styles.photoContainer}>
                <View style={styles.profileWrapper}>
                  <Image source={profileUrl ? {uri: profileUrl} : Theme.icon_profile} style={styles.profile}/>
                </View>
                <TouchableOpacity style={styles.btnCamera}
                                  onPress={() => refRBSheet.current.open()}
                >
                  <Image source={Theme.camera} style={styles.camera}/>
                </TouchableOpacity>
              </View>

              <Text style={[CommonStyle.text14_inter_r, {paddingTop: 10}]}>
                {myProfile?.firstName} {myProfile?.lastName}
              </Text>
            </View>

          </View>

          {SocietyLayout()}

          {CardLayout()}

        </View>
      );
    };

    const onPressItemRight = (selItem) => {
      console.log(selItem);
      navigation.navigate('Dashboard', {selItem});
    };

    const onOpen = (event, gestureState, swipeable) => {
      if (currentlyOpenSwipeable && currentlyOpenSwipeable !== swipeable) {
        currentlyOpenSwipeable.recenter();
      }

      setCurrentlyOpenSwipeable(swipeable);
    };

    const onClose = () => {
      setCurrentlyOpenSwipeable(null);
    };

    const ReceiptLayout = () => {

      return (
        <View style={styles.receiptWrapper}>
          <View style={styles.receiptHeader}>
            <Image source={Theme.icon_receipt} style={styles.receiptImage}/>
            <View style={{paddingLeft: 8}}>
              <Text style={CommonStyle.text12_inter_r}>
                Receipt
              </Text>
            </View>
          </View>

          <ScrollView style={{flex: 1}}
                      showsVerticalScrollIndicator={false}
          >
            {Array.isArray(receiptList) && receiptList?.map((item, key) => {
              return (
                <View key={key}>
                  {/*{(item?.visibility === 'public' || item?.shareTransaction !== 0) ?*/}
                  {(item?.newestPost?.id || item?.shareTransaction !== 0) ?
                    <CustomSwipe
                      leftContent={null}
                      rightButtons={[
                        <TouchableOpacity style={[styles.rightSwipeItem, {backgroundColor: '#F7F7FE'}]}
                                          activeOpacity={0.7}
                                          onPress={() => onPressItemRight(item)}
                        >
                          <View style={{width: 100, alignItems: 'center'}}>
                            <Image source={Theme.icon_metric} style={styles.metric}/>
                            <Text style={[CommonStyle.text11_inter_r, {color: '#B0B0CC'}]}>
                              Metrics
                            </Text>
                          </View>
                        </TouchableOpacity>,
                      ]}
                      rightButtonWidth={100}
                      onPanAnimatedValueRef={(event) => {
                      }}
                      onRightButtonsOpenRelease={onOpen}
                      onRightButtonsCloseRelease={onClose}
                    >
                      <MyReceiptCard item={item} myProfile={myProfile} onPressItem={onPressItem}
                                     onPressBuyingClub={onPressBuyingClub}
                                     onPressCancel={onPressCancel}/>

                    </CustomSwipe>
                    :
                    <CustomSwipe
                      leftContent={(
                        <LinearGradient
                          start={{x: 0, y: 0.25}} end={{x: 1.0, y: 1.0}}
                          locations={[0, 0.99]}
                          colors={['rgba(165,175,218,1)', 'rgba(194, 207, 224, 1)']}
                          style={styles.leftSwipeItem}
                        >
                        </LinearGradient>
                      )}
                      rightButtons={null}
                      leftActionActivationDistance={WINDOW_WIDTH / 1.5}
                      onLeftActionRelease={() => onSwipeLeft(item)}
                      onPanAnimatedValueRef={(event) => console.log(event)}
                      onRightButtonsOpenRelease={onOpen}
                      onRightButtonsCloseRelease={onClose}
                    >
                      <MyReceiptCard item={item} myProfile={myProfile} onPressItem={onPressItem}/>
                    </CustomSwipe>
                  }
                </View>
              );
            })}

            <View style={{height: isIOS ? 90 : 60}}/>
          </ScrollView>
        </View>
      );
    };

    const BottomSheet = () => {
      return (
        <RBSheet
          closeOnDragDown={true}
          closeOnPressMask={false}
          ref={refRBSheet}
          height={200}
          openDuration={250}
          customStyles={{
            container: {
              alignItems: 'center',
              borderTopRightRadius: 35,
              borderTopLeftRadius: 35,
              justifyContent: 'space-evenly',
              backgroundColor: Theme.white,
            },
          }}
        >
          <View style={{width: '100%', padding: 20, alignItems: 'center'}}>
            <TouchableOpacity onPress={() => onPressCamera()} style={styles.applybtn}>
              <Text style={[CommonStyle.text12_inter_r, {color: Theme.white}]}>Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onPressGallery()} style={styles.applybtn}>
              <Text style={[CommonStyle.text12_inter_r, {color: Theme.white}]}>Album</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => refRBSheet.current.close()} style={styles.applybtn}>
              <Text style={[CommonStyle.text12_inter_r, {color: Theme.white}]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </RBSheet>
      );
    };

    return (
      <View style={styles.container}>
        <StatusBar hidden={false} translucent={true} backgroundColor={'transparent'}/>

        <ProfileNavHeader
          title={traits?.name?.first + ' ' + traits?.name?.last}
          // title={myProfile?.firstName + ' ' + myProfile?.lastName}
          onPressRight={onPressRight}
          rightIcon={Theme.icon_setting}
        />

        {ProfileCardLayout()}

        {ReceiptLayout()}

        {BottomSheet()}

      </View>
    );
  }
;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F6F6',
  },
  profileWrapper: {
    width: 88,
    height: 88,
    backgroundColor: Theme.white,
    borderRadius: 88,
    borderWidth: 0.5,
    borderColor: 'rgba(196, 196, 196, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  photoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  profile: {
    width: 88,
    height: 88,
    resizeMode: 'cover',
  },
  btnFollowingWrapper: {
    position: 'absolute',
    right: 0,
    paddingHorizontal: 10,
    paddingVertical: 7,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: Theme.grey,
    borderWidth: 0.5,
    borderRadius: 4,
  },
  verticalLine: {
    height: 20,
    width: 0.5,
    backgroundColor: '#B9B9B9',
  },
  cardWrapper: {
    flexDirection: 'row',
    backgroundColor: Theme.white,
    borderRadius: 4,
    paddingVertical: 15,
    justifyContent: 'center',
  },
  card: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
  },
  receiptWrapper: {
    flex: 1,
    backgroundColor: Theme.white,
    marginTop: 10,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },
  receiptHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(196, 196, 196, 0.28)',
  },
  receiptImage: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    tintColor: '#5A5A5A',
  },
  leftSwipeItem: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingRight: 20,
  },
  rightSwipeItem: {
    flex: 1,
    justifyContent: 'center',
  },
  metric: {
    width: 21,
    height: 19,
    resizeMode: 'contain',
  },
  btnCamera: {
    position: 'absolute',
    right: 0,
    bottom: 0,
  },
  camera: {
    width: 28,
    height: 28,
  },
  applybtn: {
    backgroundColor: Theme.primary,
    height: 30,
    width: 140,
    borderRadius: 100,
    marginVertical: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ProfileScreen;
