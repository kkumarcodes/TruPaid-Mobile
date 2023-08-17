import {API_LOADING} from '../actions/actionType';

const initialState = {
  apiLoading: false,
};

export const configReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case API_LOADING:
      return {
        ...state,
        apiLoading: payload,
      };
    default:
      return state;
  }
};
