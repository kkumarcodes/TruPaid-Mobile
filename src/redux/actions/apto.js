import {
  SET_APTO_VERIFICATION_ID,
  SET_APTO_SECONDARY_VERIFICATION_ID,
  SET_APTO_PHONE_NUMBER,
  SET_APTO_COUNTRY_CODE,
  SET_APTO_NAME_EMAIL,
  SET_APTO_ADDRESS,
  SET_APTO_BIRTHDATE,
  SET_APTO_SSN,
  SET_APTO_ISSUE_CARD,
  SET_TRUPAIDAPTO_ID,
  SET_PAYMENTSOURCE,
} from './actionType';

export const setVerificationId = payload => dispatch => {
  dispatch({
    type: SET_APTO_VERIFICATION_ID,
    payload: payload,
  });
};

export const setSecondaryVerificationId = payload => dispatch => {
  dispatch({
    type: SET_APTO_SECONDARY_VERIFICATION_ID,
    payload: payload,
  });
};

export const setPhonenumber = payload => dispatch => {
  dispatch({
    type: SET_APTO_PHONE_NUMBER,
    payload: payload,
  });
};

export const setCountryCode = payload => dispatch => {
  dispatch({
    type: SET_APTO_COUNTRY_CODE,
    payload: payload,
  });
};

export const setNameAndEmail = payload => dispatch => {
  dispatch({
    type: SET_APTO_NAME_EMAIL,
    payload: payload,
  });
};

export const setAddress = payload => dispatch => {
  dispatch({
    type: SET_APTO_ADDRESS,
    payload: payload,
  });
};

export const setBirthDate = payload => dispatch => {
  dispatch({
    type: SET_APTO_BIRTHDATE,
    payload: payload,
  });
};

export const setAptoSSN = payload => dispatch => {
  dispatch({
    type: SET_APTO_SSN,
    payload: payload,
  });
};

export const setIssueCard = payload => dispatch => {
  dispatch({
    type: SET_APTO_ISSUE_CARD,
    payload: payload,
  });
};

export const setTruPaidAptoId = payload => dispatch => {
  dispatch({
    type: SET_TRUPAIDAPTO_ID,
    payload: payload,
  });
};

export const setPaymentSource = payload => dispatch => {
  dispatch({
    type: SET_PAYMENTSOURCE,
    payload: payload,
  });
};
