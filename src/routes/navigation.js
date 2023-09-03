import { CommonActions, DrawerActions } from '@react-navigation/native';
import React from 'react';

let _isNavigationReady = false;

export const _navigationRef = React.createRef();

export const setIsNavigationReady = (isReady) => {
  _isNavigationReady = isReady;
};

export const navigation = {
  getNavigate() {
    return _navigationRef
  },

  navigate: (name, params) => {
    if (!_isNavigationReady) {
      return;
    }
    _navigationRef.current?.navigate(name, params);
  },
  openDrawer() {
    if (!_isNavigationReady) {
      return;
    }
    _navigationRef.current?.dispatch(DrawerActions.openDrawer());
  },
  closeDrawer() {
    if (!_isNavigationReady) {
      return;
    }
    _navigationRef.current?.dispatch(DrawerActions.closeDrawer());
  },
  setRoot(name) {
    if (!_isNavigationReady) {
      return;
    }
    _navigationRef.current?.dispatch(
      CommonActions.reset({
        index: 0,
        // @ts-ignore
        routes: [{ name }],
      }),
    );
  },
  goBack() {
    if (!_isNavigationReady) {
      return;
    }
    _navigationRef.current?.goBack();
  },
  getRouteName() {
    if (!_isNavigationReady) {
      return;
    }
    return _navigationRef?.current?.getCurrentRoute();
  },
};
