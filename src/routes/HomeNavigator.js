import React, {useEffect} from 'react';
import {
  StatusBar,
} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {useSelector, useDispatch} from 'react-redux';
import {BottomTab} from '../screens/app/BottomTab';
import PostDetailScreen from '../screens/app/post-detail-screen';
import UserProfileScreen from '../screens/app/user-profile-screen';
import PostSelectScreen from '../screens/app/post-select-screen';
import PostTapScreen from '../screens/app/post-tap-screen';
import PostPublishScreen from '../screens/app/post-publish-screen';
import MyPostDetailScreen from '../screens/app/my-post-detail-screen';
import DashboardScreen from '../screens/app/dashboard-screen';
import SettingScreen from '../screens/app/setting-screen';
import PostCameraScreen from '../screens/app/post-camera-screen';
import PostGalleryScreen from '../screens/app/post-gallery-screen';
import AptoInputPhoneScreen from '../screens/apto/apto-input-phone';
import AptoVerifyCodeScreen from '../screens/apto/apto-verify-code';
import AptoEnterNameScreen from '../screens/apto/apto-enter-name';
import AptoHomeAddressScreen from '../screens/apto/apto-home-address';
import AptoPersonalBirthdayScreen from '../screens/apto/apto-personal-birthday';
import AptoPersonalNumberScreen from '../screens/apto/apto-personal-number';
import AptoLegalAgreementScreen from '../screens/apto/apto-legal_agreement';
import AptoSuccessScreen from '../screens/apto/apto-success';
import ReveelCardManagementScreen from '../screens/trupaid-card/trupaid-card-management';
import ReveelCardAddMoneyScreen from '../screens/trupaid-card/trupaid-card-add-money';
import ReveelCardAddNewScreen from '../screens/trupaid-card/trupaid-card-add-new';
import ReveelCardSuccessScreen from '../screens/trupaid-card/trupaid-card-success';

const Stack = createStackNavigator();
const HomeNavigator = () => {
  const dispatch = useDispatch();
  const state = useSelector(state => state);

  useEffect(() => {
  }, []);

  return (
    <React.Fragment>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent"/>
      <Stack.Navigator
        screenOptions={{headerShown: false}}>
        <Stack.Screen
          name="BottomTab"
          component={BottomTab}
          options={{gestureEnabled: false}}
        />
        <Stack.Screen
          name="PostDetail"
          component={PostDetailScreen}
          options={{gestureEnabled: false}}
        />
        <Stack.Screen
          name="MyPostDetail"
          component={MyPostDetailScreen}
          options={{gestureEnabled: false}}
        />
        <Stack.Screen
          name="UserProfile"
          component={UserProfileScreen}
          options={{gestureEnabled: false}}
        />
        <Stack.Screen
          name="PostSelect"
          component={PostSelectScreen}
          options={{gestureEnabled: false}}
        />
        <Stack.Screen
          name="PostCamera"
          component={PostCameraScreen}
          options={{gestureEnabled: false}}
        />
        <Stack.Screen
          name="PostGallery"
          component={PostGalleryScreen}
          options={{gestureEnabled: false}}
        />

        <Stack.Screen
          name="PostTap"
          component={PostTapScreen}
          options={{gestureEnabled: false}}
        />
        <Stack.Screen
          name="PostPublish"
          component={PostPublishScreen}
          options={{gestureEnabled: false}}
        />
        <Stack.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={{gestureEnabled: false}}
        />
        <Stack.Screen
          name="Setting"
          component={SettingScreen}
          options={{gestureEnabled: false}}
        />
        <Stack.Screen
          name="AptoInputPhone"
          component={AptoInputPhoneScreen}
        />
        <Stack.Screen
          name="AptoVerifyCode"
          component={AptoVerifyCodeScreen}
        />
        <Stack.Screen
          name="AptoEnterName"
          component={AptoEnterNameScreen}
        />
        <Stack.Screen
          name="AptoHomeAddress"
          component={AptoHomeAddressScreen}
        />
        <Stack.Screen
          name="AptoPersonalBirthday"
          component={AptoPersonalBirthdayScreen}
        />
        <Stack.Screen
          name="AptoPersonalNumber"
          component={AptoPersonalNumberScreen}
        />
        <Stack.Screen
          name="AptoLegalAgreement"
          component={AptoLegalAgreementScreen}
        />
        <Stack.Screen
          name="AptoSuccess"
          component={AptoSuccessScreen}
        />
        <Stack.Screen
          name="ReveelCardManagement"
          component={ReveelCardManagementScreen}
        />
        <Stack.Screen
          name="ReveelCardAddMoney"
          component={ReveelCardAddMoneyScreen}
        />
        <Stack.Screen
          name="ReveelCardAddNew"
          component={ReveelCardAddNewScreen}
        />
        <Stack.Screen
          name="ReveelCardSuccess"
          component={ReveelCardSuccessScreen}
        />
      </Stack.Navigator>
    </React.Fragment>
  );
};

export default HomeNavigator;
