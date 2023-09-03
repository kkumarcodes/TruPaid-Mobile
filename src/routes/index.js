import React, { useEffect } from 'react';
import {
  StatusBar,
} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { _navigationRef, navigation, setIsNavigationReady } from './navigation';

import SplashScreen from '../screens/splash';
import { Theme } from '../styles/theme';
import SignUpScreen from '../screens/auth/signup';
import RegisterCardScreen from '../screens/auth/register-card';
import ChooseAccountScreen from '../screens/auth/choose-account';
import ScanCardScreen from '../screens/auth/scan-card-screen';
import AddPaymentScreen from '../screens/auth/add-payment-screen';
import SendCardScreen from '../screens/auth/send-card-screen';
import HomeNavigator from './HomeNavigator';
import LoginScreen from '../screens/auth/login';
import ApiLoading from '../components/api-loading';
import PlaidLinkScreen from '../screens/auth/choose-account/PlaidLink';
import ResetPasswordScreen from '../screens/auth/reset-password';
import CheckEmailScreen from '../screens/auth/check-email';
import CreateNewPasswordScreen from '../screens/auth/create-new-password';
import LinkBankFirstScreen from '../screens/auth/link-bank-first';
import LinkBankSecondScreen from '../screens/auth/link-bank-second';
import AddPaymentMethodScreen from '../screens/auth/add-payment-method';
import CardSelectionScreen from '../screens/auth/card-selection';
import SelectFollowPeopleScreen from '../screens/auth/select-topics-screen/SelectFollowPeople';
import SelectFavoriteBrandScreen from '../screens/auth/select-topics-screen/SelectFavoriteBrand';
import SelectInterestTopicScreen from '../screens/auth/select-topics-screen/SelectInterestTopic';

const Stack = createStackNavigator();

const Route = () => {
  const dispatch = useDispatch();
  const landingPage = useSelector(state => state.auth.landingPage);
  const signUpPage = useSelector(state => state.auth.signUpPage);
  const homePage = useSelector(state => state.auth.homePage);
  const routeNameRef = React.useRef();

  useEffect(() => {
    console.log('route ====', landingPage, signUpPage, homePage)
    setIsNavigationReady(true);
  }, []);

  const chooseScreen = () => {
    
    if (landingPage) {
      return (
        <>
          <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
          <SplashScreen />
        </>
      );
    } else if (signUpPage) {
      return (
        <>
          <StatusBar barStyle="dark-content" translucent backgroundColor={Theme.primary} />
          <Stack.Navigator
            screenOptions={{ headerShown: false }}>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
            />
            <Stack.Screen
              name="SignUp"
              component={SignUpScreen}
            />
            <Stack.Screen
              name="RegisterCard"
              component={RegisterCardScreen}
            />
            <Stack.Screen
              name="ChooseAccount"
              component={ChooseAccountScreen}
            />
            <Stack.Screen
              name="PlaidLink"
              component={PlaidLinkScreen}
            />

            <Stack.Screen
              name="ScanCard"
              component={ScanCardScreen}
            />
            <Stack.Screen
              name="AddPayment"
              component={AddPaymentScreen}
            />
            <Stack.Screen
              name="SendCard"
              component={SendCardScreen}
            />
            <Stack.Screen
              name="SelectTopics"
              component={SelectInterestTopicScreen}
            />
            <Stack.Screen
              name="SelectFollowPeople"
              component={SelectFollowPeopleScreen}
            />
            <Stack.Screen
              name="SelectFavoriteBrand"
              component={SelectFavoriteBrandScreen}
            />
            <Stack.Screen
              name="ResetPassword"
              component={ResetPasswordScreen}
            />
            <Stack.Screen
              name="CheckEmail"
              component={CheckEmailScreen}
            />
            <Stack.Screen
              name="CreateNewPassword"
              component={CreateNewPasswordScreen}
            />
            <Stack.Screen
              name="LinkBankFirst"
              component={LinkBankFirstScreen}
            />
            <Stack.Screen
              name="LinkBankSecond"
              component={LinkBankSecondScreen}
            />
            <Stack.Screen
              name="AddPaymentMethod"
              component={AddPaymentMethodScreen}
            />
            <Stack.Screen
              name="CardSelection"
              component={CardSelectionScreen}
            />
          </Stack.Navigator>
        </>
      );
    } else if (homePage) {
      return (
        <>
          <StatusBar barStyle="dark-content" translucent backgroundColor={Theme.primary} />
          <Stack.Navigator
            screenOptions={{ headerShown: false }}>
            <Stack.Screen
              name="HomeNavigator"
              component={HomeNavigator}
              options={{ gestureEnabled: false }}
            />
          </Stack.Navigator>
        </>
      );
    } else {
      return (
        <>
          <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
          <SplashScreen />
        </>
      );
    }
  };

  return (
    <React.Fragment>
      <NavigationContainer ref={_navigationRef}
        onReady={() => {
          console.log(navigation.getNavigate().current.getCurrentRoute()?.name, '==navigation.getNavigate().current.getCurrentRoute()?.name==')
          routeNameRef.current = navigation.getNavigate().current.getCurrentRoute()?.name;
        }}
        onStateChange={async (state) => {
          console.log(state, '===state===')
          const previousRouteName = routeNameRef.current;
          const currentRouteName = navigation.getNavigate().current.getCurrentRoute()?.name;

          if (previousRouteName !== currentRouteName) {

          }
          routeNameRef.current = currentRouteName;
        }}
      >
        {chooseScreen()}
        <ApiLoading />

      </NavigationContainer>
    </React.Fragment>
  );
};

export default Route;
