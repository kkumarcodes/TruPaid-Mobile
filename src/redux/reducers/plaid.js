import {SET_PLAID_ACCESS_TOKEN, UPDATE_BANK_ACCOUNT} from '../actions/actionType';

const initialState = {
  bank_accounts: [],
};

export const plaidReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case SET_PLAID_ACCESS_TOKEN:
      return {
        ...state,
        accessToken: payload,
      };
    case UPDATE_BANK_ACCOUNT:
      return {
        ...state,
        bank_accounts: payload,
      };
    default:
      return state;
  }
};


