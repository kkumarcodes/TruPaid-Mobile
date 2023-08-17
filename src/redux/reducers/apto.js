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
  SET_REVEELAPTO_ID,
  SET_PAYMENTSOURCE,
} from '../actions/actionType';

const initialState = {
  verification_id: null,
  secondary_verification_id: null,
  phone_number: null,
  country_code: null,
  first_name: null,
  last_name: null,
  email: null,
  street_one: null,
  street_two: null,
  locality: null,
  region: null,
  postal_code: null,
  country: null,
  birthdate: null,
  ssn: null,
  issueCard: null,
  trupaidAptoId: null,
  paymentSource: null,
};

export const aptoReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case SET_APTO_VERIFICATION_ID:
      return {
        ...state,
        verification_id: payload,
      };
      
      case SET_APTO_SECONDARY_VERIFICATION_ID:
        return {
          ...state,
          secondary_verification_id: payload,
        };

      case SET_APTO_PHONE_NUMBER:
      return {
        ...state,
        phone_number: payload,
      };

      case SET_APTO_COUNTRY_CODE:
      return {
        ...state,
        country_code: payload,
      };

      case SET_APTO_NAME_EMAIL:
      return {
        ...state,
        first_name: payload.first_name,
        last_name: payload.last_name,
        email: payload.email,
      };

      case SET_APTO_ADDRESS:
      return {
        ...state,
        street_one: payload.street_one,
        street_two: payload.street_two,
        locality: payload.locality,
        region: payload.region,
        postal_code: payload.postal_code,
        country: payload.country,
      };

      case SET_APTO_BIRTHDATE:
      return {
        ...state,
        birthdate: payload,
      };

      case SET_APTO_SSN:
      return {
        ...state,
        ssn: payload,
      };

      case SET_APTO_ISSUE_CARD:
      return {
        ...state,
        issueCard: payload,
      };

      case SET_REVEELAPTO_ID:
      return {
        ...state,
        trupaidAptoId: payload,
      };

      case SET_PAYMENTSOURCE:
      return {
        ...state,
        paymentSource: payload,
      };
    default:
      return state;
  }
};
