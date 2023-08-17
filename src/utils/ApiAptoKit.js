import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const API_ENDPOINT = __DEV__
  ? 'https://api.sbx.aptopayments.com'
  : 'https://api.sbx.aptopayments.com';

const ApiAptoKit = axios.create({
  baseURL: API_ENDPOINT,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

export const setApiAptoPublicKey = apiKey => {
  return new Promise(async resolve => {
    if (apiKey) {
      ApiAptoKit.defaults.headers['Api-Key'] = 'Bearer ' + apiKey;
      try {
        await AsyncStorage.setItem('@apto_apiKey', apiKey);
      } catch (e) {}
      resolve();
    } else {
      delete ApiAptoKit.defaults.headers.Authorization;
      try {
        await AsyncStorage.removeItem('@apto_apiKey');
      } catch (e) {}
      resolve();
    }
  });
};

export const setApiAptoToken = token => {
  return new Promise(async resolve => {
    if (token) {
      ApiAptoKit.defaults.headers.Authorization = 'Bearer ' + token;
      try {
        await AsyncStorage.setItem('@apto_token', token);
      } catch (e) {}
      resolve();
    } else {
      delete ApiAptoKit.defaults.headers.Authorization;
      try {
        await AsyncStorage.removeItem('@apto_token');
      } catch (e) {}
      resolve();
    }
  });
};

export const verificationStart = async (country_code, phone_number) => {
  await setApiAptoToken()
  const params = '/v1/verifications/start';
  const body = {
    datapoint_type: 'phone',
    datapoint: {
      data_type: 'phone',
      country_code,
      phone_number,
    },
  };
  return await ApiAptoKit.post(params, body);
};

export const completeVerification = async (verification_id, secret) => {
  await setApiAptoToken()
  const params = `/v1/verifications/${verification_id}/finish`;
  const body = {
    secret,
  };
  return await ApiAptoKit.post(params, body);
};

export const cardproducts = async () => {
  const params = `/v1/config/cardproducts`;

  return await ApiAptoKit.get(params, {});
};

export const cardApply = async card_product_id => {
  const params = `/v1/user/accounts/apply`;
  const body = {
    card_product_id,
  };
  return await ApiAptoKit.post(params, body);
};

export const cardStatus = async application_id => {
  const params = `/v1/user/accounts/applications/${application_id}/status`;
  return await ApiAptoKit.get(params, {});
};

export const acceptAgreement = async (workflow_object_id, action_id) => {
  const params = `/v1/disclaimers/accept`;
  const body = {
    workflow_object_id,
    action_id,
  };
  return await ApiAptoKit.post(params, body);
};

export const setAgreementStatus = async () => {
  const params = `/v1/agreements`;
  const body = {
    agreements_keys: [
      'apto_cha',
      'apto_privacy',
      'evolve_eua',
      'evolve_privacy',
    ],
    user_action: 'ACCEPTED',
  };
  return await ApiAptoKit.post(params, body);
};

export const issueCard = async application_id => {
  const params = `/v1/user/accounts/issuecard`;
  const body = {
    application_id,
  };
  return await ApiAptoKit.post(params, body);
};

export const userLogin = async (verification_id, secondary_verification_id) => {
  const params = `/v1/user/login`;
  const body = {
    verifications: {
      type: 'list',
      data: [
        {
          verification_id,
        },
        {
          verification_id: secondary_verification_id,
        },
      ],
    },
  };
  return await ApiAptoKit.post(params, body);
};

export const addPaymentSources = async data => {
  const params = `/v1/payment_sources`;
  const body = {
    description: 'My Credit card',
    type: 'card',
    card: {
      pan: data.pan,
      cvv: data.cvv,
      exp_date: data.exp_date,
      last_four: data.last_four,
      postal_code: data.postal_code,
      is_preferred: true,
    },
  };
  return await ApiAptoKit.post(params, body);
};

export const getPaymentSources = async () => {
  const params = `/v1/payment_sources`;

  return await ApiAptoKit.get(params, {});
};

export const getSinglePaymentSourceData = async (payment_source_id) => {
  const params = `/v1/payment_sources/${payment_source_id}`;

  return await ApiAptoKit.get(params, {});
};

export const pushFundsPaymentSource = async (payment_source_id, data) => {
  const params = `/v1/payment_sources/${payment_source_id}/push`;
  const body = {
    amount: {
      currency: 'USD',
      amount: data.amount,
    },
    type: 'funding',
    balance_id: data.balance_id,
  };
  return await ApiAptoKit.post(params, body);
};

export const pullFundsPaymentSource = async (payment_source_id, data) => {
  const params = `/v1/payment_sources/${payment_source_id}/pull`;
  const body = {
    amount: {
      currency: 'USD',
      amount: data.amount,
    },
    balance_id: data.balance_id,
  };
  return await ApiAptoKit.post(params, body);
};

export const setCardFundingSource = async (account_id, funding_source_id) => {
  const params = `/v1/user/accounts/${account_id}/balance`;
  const body = {
    funding_source_id,
  };
  return await ApiAptoKit.post(params, body);
};

export const getCardFundingSource = async (account_id) => {
  const params = `/v1/user/accounts/${account_id}/balance`;

  return await ApiAptoKit.get(params, {});
};

export const listAvailableFundingSource = async (account_id) => {
  const params = `/v1/user/accounts/${account_id}/balances`;

  return await ApiAptoKit.get(params, {});
};

export const RetriveFundingSource = async (account_id) => {
  const params = `/v1/user/accounts/${account_id}/balance`;

  return await ApiAptoKit.get(params, {});
};

export const createUser = async ({
  verification_id,
  country_code,
  phone_number,
  email,
  birthdate,
  first_name,
  last_name,
  street_one,
  street_two,
  locality,
  region,
  postal_code,
  country,
}) => {
  const params = `/v1/user`;
  const body = {
    metadata: 'example_meta',
    custodian_uid: null,
    data_points: {
      type: 'list',
      data: [
        {
          data_type: 'phone',
          verified: false,
          verification: {
            type: 'verification',
            verification_type: 'phone',
            verification_mechanism: 'phone',
            verification_id,
            status: 'pending',
            secondary_credential: {
              type: 'verification',
              verification_type: 'birthdate',
              verification_id,
              status: 'pending',
            },
          },
          not_specified: false,
          country_code,
          phone_number,
        },
        {
          type: 'email',
          email: email,
        },
        {
          type: 'birthdate',
          date: birthdate,
        },
        {
          type: 'name',
          first_name,
          last_name,
        },
        {
          type: 'address',
          street_one,
          street_two,
          locality,
          region,
          postal_code,
          country,
        },
      ],
      has_more: false,
      page: 0,
      rows: 1,
      total_count: 1,
    },
  };

  return await ApiAptoKit.post(params, body);
};
export default ApiAptoKit;
