import {
  GET_CREDIT,
  SET_RECEIPTS
} from '../actions/actionType';

const initialState = {
  credit_info: null,
  receipts: []
};

export const app = (state = initialState, action) => {
  switch (action.type) {
    case GET_CREDIT:
      return {
        ...state,
        credit_info: action.data,
      };
    case SET_RECEIPTS:
      return {
        ...state,
        receipts: action.data,
      };
    default:
      return state;
  }
};
