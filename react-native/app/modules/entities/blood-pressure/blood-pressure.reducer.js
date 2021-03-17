import { createReducer, createActions } from 'reduxsauce';
import Immutable from 'seamless-immutable';
import { loadMoreDataWhenScrolled } from '../../../shared/util/pagination-utils';
import { parseHeaderForLinks } from '../../../shared/util/url-utils';

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  bloodPressureRequest: ['bloodPressureId'],
  bloodPressureAllRequest: ['options'],
  bloodPressureUpdateRequest: ['bloodPressure'],
  bloodPressureDeleteRequest: ['bloodPressureId'],

  bloodPressureSuccess: ['bloodPressure'],
  bloodPressureAllSuccess: ['bloodPressureList', 'headers'],
  bloodPressureUpdateSuccess: ['bloodPressure'],
  bloodPressureDeleteSuccess: [],

  bloodPressureFailure: ['error'],
  bloodPressureAllFailure: ['error'],
  bloodPressureUpdateFailure: ['error'],
  bloodPressureDeleteFailure: ['error'],

  bloodPressureReset: [],
});

export const BloodPressureTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  fetchingOne: false,
  fetchingAll: false,
  updating: false,
  deleting: false,
  updateSuccess: false,
  bloodPressure: { id: undefined },
  bloodPressureList: [],
  errorOne: null,
  errorAll: null,
  errorUpdating: null,
  errorDeleting: null,
  links: { next: 0 },
  totalItems: 0,
});

/* ------------- Reducers ------------- */

// request the data from an api
export const request = (state) =>
  state.merge({
    fetchingOne: true,
    errorOne: false,
    bloodPressure: INITIAL_STATE.bloodPressure,
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
  const { bloodPressure } = action;
  return state.merge({
    fetchingOne: false,
    errorOne: null,
    bloodPressure,
  });
};
// successful api lookup for all entities
export const allSuccess = (state, action) => {
  const { bloodPressureList, headers } = action;
  const links = parseHeaderForLinks(headers.link);
  return state.merge({
    fetchingAll: false,
    errorAll: null,
    links,
    totalItems: parseInt(headers['x-total-count'], 10),
    bloodPressureList: loadMoreDataWhenScrolled(state.bloodPressureList, bloodPressureList, links),
  });
};
// successful api update
export const updateSuccess = (state, action) => {
  const { bloodPressure } = action;
  return state.merge({
    updateSuccess: true,
    updating: false,
    errorUpdating: null,
    bloodPressure,
  });
};
// successful api delete
export const deleteSuccess = (state) => {
  return state.merge({
    deleting: false,
    errorDeleting: null,
    bloodPressure: INITIAL_STATE.bloodPressure,
  });
};

// Something went wrong fetching a single entity.
export const failure = (state, action) => {
  const { error } = action;
  return state.merge({
    fetchingOne: false,
    errorOne: error,
    bloodPressure: INITIAL_STATE.bloodPressure,
  });
};
// Something went wrong fetching all entities.
export const allFailure = (state, action) => {
  const { error } = action;
  return state.merge({
    fetchingAll: false,
    errorAll: error,
    bloodPressureList: [],
  });
};
// Something went wrong updating.
export const updateFailure = (state, action) => {
  const { error } = action;
  return state.merge({
    updateSuccess: false,
    updating: false,
    errorUpdating: error,
    bloodPressure: state.bloodPressure,
  });
};
// Something went wrong deleting.
export const deleteFailure = (state, action) => {
  const { error } = action;
  return state.merge({
    deleting: false,
    errorDeleting: error,
    bloodPressure: state.bloodPressure,
  });
};

export const reset = (state) => INITIAL_STATE;

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.BLOOD_PRESSURE_REQUEST]: request,
  [Types.BLOOD_PRESSURE_ALL_REQUEST]: allRequest,
  [Types.BLOOD_PRESSURE_UPDATE_REQUEST]: updateRequest,
  [Types.BLOOD_PRESSURE_DELETE_REQUEST]: deleteRequest,

  [Types.BLOOD_PRESSURE_SUCCESS]: success,
  [Types.BLOOD_PRESSURE_ALL_SUCCESS]: allSuccess,
  [Types.BLOOD_PRESSURE_UPDATE_SUCCESS]: updateSuccess,
  [Types.BLOOD_PRESSURE_DELETE_SUCCESS]: deleteSuccess,

  [Types.BLOOD_PRESSURE_FAILURE]: failure,
  [Types.BLOOD_PRESSURE_ALL_FAILURE]: allFailure,
  [Types.BLOOD_PRESSURE_UPDATE_FAILURE]: updateFailure,
  [Types.BLOOD_PRESSURE_DELETE_FAILURE]: deleteFailure,
  [Types.BLOOD_PRESSURE_RESET]: reset,
});
