import {
  LOAD_LANDING_PAGE,
  LOAD_SIGN_UP, TO_HOME_PAGE,
  UPDATE_PROFILE, UPDATE_PROFILE_IMAGE, UPDATE_USER_INFO,
} from '../actions/actionType';

export const auth = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_LANDING_PAGE:
      return {
        ...state,
        signUpPage: false,
        landingPage: true,
        homePage: false
      };
    case LOAD_SIGN_UP:
      return {
        ...state,
        signUpPage: true,
        landingPage: false,
        homePage: false
      };
    case UPDATE_PROFILE:
      return {
        ...state,
        user_profile: action?.data,
      };
    case UPDATE_PROFILE_IMAGE:
      let new_profile = {
        ...state.user_profile?.profile,
        image: action?.data
      }
      let newProfile = {
        ...state.user_profile,
        profile: new_profile
      }
      return {
        ...state,
        user_profile: newProfile,
      };

    case UPDATE_USER_INFO:
      return {
        ...state,
        user_info: action?.data,
      };
    case TO_HOME_PAGE:
      return {
        ...state,
        homePage: true,
        signUpPage: false,
        landingPage: false,
      };
    default:
      return state;
  }
};

export const initialState = {
  user_profile: null,
  user_info: null,
  signUpPage: false,
  landingPage: true,
  homePage: false
};
