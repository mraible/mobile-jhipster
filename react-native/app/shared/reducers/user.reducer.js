import { createReducer, createActions } from 'reduxsauce';
import Immutable from 'seamless-immutable';

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  userAllRequest: ['options'],

  userAllSuccess: ['userList'],

  userAllFailure: ['error'],
});

export const UserTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  fetchingAll: false,
  userList: [],
  errorAll: null,
});

/* ------------- Reducers ------------- */

// request the data from an api
export const allRequest = (state) =>
  state.merge({
    fetchingAll: true,
    userList: [],
  });

// successful api lookup for all entities
export const allSuccess = (state, action) => {
  const { userList } = action;
  return state.merge({
    fetchingAll: false,
    errorAll: null,
    userList,
  });
};

// Something went wrong fetching all entities.
export const allFailure = (state, action) => {
  const { error } = action;
  return state.merge({
    fetchingAll: false,
    errorAll: error,
    userList: [],
  });
};

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.USER_ALL_REQUEST]: allRequest,

  [Types.USER_ALL_SUCCESS]: allSuccess,

  [Types.USER_ALL_FAILURE]: allFailure,
});
