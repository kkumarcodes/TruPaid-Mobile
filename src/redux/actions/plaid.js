import {
  SET_PLAID_ACCESS_TOKEN,
  UPDATE_BANK_ACCOUNT
} from './actionType';

export const setPlaidAccessToken = (payload) => dispatch => {
  dispatch({
    type: SET_PLAID_ACCESS_TOKEN,
    payload: payload,
  });
};

export const updateBankAccount = (payload) => dispatch => {
  dispatch({
    type: UPDATE_BANK_ACCOUNT,
    payload: payload,
  });
};
