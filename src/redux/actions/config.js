import {
  API_LOADING,

} from './actionType';

export const setApiLoading = (loading) => dispatch => {
  dispatch({
    type: API_LOADING,
    payload: loading,
  });
};

