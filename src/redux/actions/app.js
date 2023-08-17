import {
  GET_CREDIT, SET_RECEIPTS,
} from './actionType';

export const getCredit = payload => ({
  type: GET_CREDIT,
});

export const setReceipts = payload => ({
  type: SET_RECEIPTS,
  data: payload
});

