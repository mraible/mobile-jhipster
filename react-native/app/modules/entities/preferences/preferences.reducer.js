import { createReducer, createActions } from 'reduxsauce';
import Immutable from 'seamless-immutable';

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  preferencesRequest: ['preferencesId'],
  preferencesAllRequest: ['options'],
  preferencesUpdateRequest: ['preferences'],
  preferencesDeleteRequest: ['preferencesId'],

  preferencesSuccess: ['preferences'],
  preferencesAllSuccess: ['preferencesList', 'headers'],
  preferencesUpdateSuccess: ['preferences'],
  preferencesDeleteSuccess: [],

  preferencesFailure: ['error'],
  preferencesAllFailure: ['error'],
  preferencesUpdateFailure: ['error'],
  preferencesDeleteFailure: ['error'],

  preferencesReset: [],
});

export const PreferencesTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  fetchingOne: false,
  fetchingAll: false,
  updating: false,
  deleting: false,
  updateSuccess: false,
  preferences: { id: undefined },
  preferencesList: [],
  errorOne: null,
  errorAll: null,
  errorUpdating: null,
  errorDeleting: null,
});

/* ------------- Reducers ------------- */

// request the data from an api
export const request = (state) =>
  state.merge({
    fetchingOne: true,
    errorOne: false,
    preferences: INITIAL_STATE.preferences,
  });

// request the data from an api
export const allRequest = (state) =>
  state.merge({
    fetchingAll: true,
    errorAll: false,
  });

// request to update from an api
export const updateRequest = (state) =>
  state.merge({
    updateSuccess: false,
    updating: true,
  });
// request to delete from an api
export const deleteRequest = (state) =>
  state.merge({
    deleting: true,
  });

// successful api lookup for single entity
export const success = (state, action) => {
  const { preferences } = action;
  return state.merge({
    fetchingOne: false,
    errorOne: null,
    preferences,
  });
};
// successful api lookup for all entities
export const allSuccess = (state, action) => {
  const { preferencesList } = action;
  return state.merge({
    fetchingAll: false,
    errorAll: null,
    preferencesList,
  });
};
// successful api update
export const updateSuccess = (state, action) => {
  const { preferences } = action;
  return state.merge({
    updateSuccess: true,
    updating: false,
    errorUpdating: null,
    preferences,
  });
};
// successful api delete
export const deleteSuccess = (state) => {
  return state.merge({
    deleting: false,
    errorDeleting: null,
    preferences: INITIAL_STATE.preferences,
  });
};

// Something went wrong fetching a single entity.
export const failure = (state, action) => {
  const { error } = action;
  return state.merge({
    fetchingOne: false,
    errorOne: error,
    preferences: INITIAL_STATE.preferences,
  });
};
// Something went wrong fetching all entities.
export const allFailure = (state, action) => {
  const { error } = action;
  return state.merge({
    fetchingAll: false,
    errorAll: error,
    preferencesList: [],
  });
};
// Something went wrong updating.
export const updateFailure = (state, action) => {
  const { error } = action;
  return state.merge({
    updateSuccess: false,
    updating: false,
    errorUpdating: error,
    preferences: state.preferences,
  });
};
// Something went wrong deleting.
export const deleteFailure = (state, action) => {
  const { error } = action;
  return state.merge({
    deleting: false,
    errorDeleting: error,
    preferences: state.preferences,
  });
};

export const reset = (state) => INITIAL_STATE;

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.PREFERENCES_REQUEST]: request,
  [Types.PREFERENCES_ALL_REQUEST]: allRequest,
  [Types.PREFERENCES_UPDATE_REQUEST]: updateRequest,
  [Types.PREFERENCES_DELETE_REQUEST]: deleteRequest,

  [Types.PREFERENCES_SUCCESS]: success,
  [Types.PREFERENCES_ALL_SUCCESS]: allSuccess,
  [Types.PREFERENCES_UPDATE_SUCCESS]: updateSuccess,
  [Types.PREFERENCES_DELETE_SUCCESS]: deleteSuccess,

  [Types.PREFERENCES_FAILURE]: failure,
  [Types.PREFERENCES_ALL_FAILURE]: allFailure,
  [Types.PREFERENCES_UPDATE_FAILURE]: updateFailure,
  [Types.PREFERENCES_DELETE_FAILURE]: deleteFailure,
  [Types.PREFERENCES_RESET]: reset,
});
