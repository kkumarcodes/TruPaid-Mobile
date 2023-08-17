import {
  SIGN_IN,
  LOAD_SIGN_UP, UPDATE_PROFILE, UPDATE_USER_INFO, TO_HOME_PAGE, LOAD_LANDING_PAGE,
  UPDATE_PROFILE_IMAGE,
} from './actionType';

export const signIn = payload => ({
  type: SIGN_IN,
});

export const loadLandingPage = payload => ({
  type: LOAD_LANDING_PAGE,
});

export const loadSignUp = payload => ({
  type: LOAD_SIGN_UP,
});

export const loadHome = payload => ({
  type: TO_HOME_PAGE,
});

export const updateProfile = payload => ({
  type: UPDATE_PROFILE,
  data: payload
})

export const updateUserInfo = payload => ({
  type: UPDATE_USER_INFO,
  data: payload
})


export const updateProfileImage = payload => ({
  type: UPDATE_PROFILE_IMAGE,
  data: payload
})
