import { createReducer, createActions } from 'reduxsauce';
import Immutable from 'seamless-immutable';
import { loadMoreDataWhenScrolled } from '../../../shared/util/pagination-utils';
import { parseHeaderForLinks } from '../../../shared/util/url-utils';

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  weightRequest: ['weightId'],
  weightAllRequest: ['options'],
  weightUpdateRequest: ['weight'],
  weightDeleteRequest: ['weightId'],

  weightSuccess: ['weight'],
  weightAllSuccess: ['weightList', 'headers'],
  weightUpdateSuccess: ['weight'],
  weightDeleteSuccess: [],

  weightFailure: ['error'],
  weightAllFailure: ['error'],
  weightUpdateFailure: ['error'],
  weightDeleteFailure: ['error'],

  weightReset: [],
});

export const WeightTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  fetchingOne: false,
  fetchingAll: false,
  updating: false,
  deleting: false,
  updateSuccess: false,
  weight: { id: undefined },
  weightList: [],
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
    weight: INITIAL_STATE.weight,
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
  const { weight } = action;
  return state.merge({
    fetchingOne: false,
    errorOne: null,
    weight,
  });
};
// successful api lookup for all entities
export const allSuccess = (state, action) => {
  const { weightList, headers } = action;
  const links = parseHeaderForLinks(headers.link);
  return state.merge({
    fetchingAll: false,
    errorAll: null,
    links,
    totalItems: parseInt(headers['x-total-count'], 10),
    weightList: loadMoreDataWhenScrolled(state.weightList, weightList, links),
  });
};
// successful api update
export const updateSuccess = (state, action) => {
  const { weight } = action;
  return state.merge({
    updateSuccess: true,
    updating: false,
    errorUpdating: null,
    weight,
  });
};
// successful api delete
export const deleteSuccess = (state) => {
  return state.merge({
    deleting: false,
    errorDeleting: null,
    weight: INITIAL_STATE.weight,
  });
};

// Something went wrong fetching a single entity.
export const failure = (state, action) => {
  const { error } = action;
  return state.merge({
    fetchingOne: false,
    errorOne: error,
    weight: INITIAL_STATE.weight,
  });
};
// Something went wrong fetching all entities.
export const allFailure = (state, action) => {
  const { error } = action;
  return state.merge({
    fetchingAll: false,
    errorAll: error,
    weightList: [],
  });
};
// Something went wrong updating.
export const updateFailure = (state, action) => {
  const { error } = action;
  return state.merge({
    updateSuccess: false,
    updating: false,
    errorUpdating: error,
    weight: state.weight,
  });
};
// Something went wrong deleting.
export const deleteFailure = (state, action) => {
  const { error } = action;
  return state.merge({
    deleting: false,
    errorDeleting: error,
    weight: state.weight,
  });
};

export const reset = (state) => INITIAL_STATE;

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.WEIGHT_REQUEST]: request,
  [Types.WEIGHT_ALL_REQUEST]: allRequest,
  [Types.WEIGHT_UPDATE_REQUEST]: updateRequest,
  [Types.WEIGHT_DELETE_REQUEST]: deleteRequest,

  [Types.WEIGHT_SUCCESS]: success,
  [Types.WEIGHT_ALL_SUCCESS]: allSuccess,
  [Types.WEIGHT_UPDATE_SUCCESS]: updateSuccess,
  [Types.WEIGHT_DELETE_SUCCESS]: deleteSuccess,

  [Types.WEIGHT_FAILURE]: failure,
  [Types.WEIGHT_ALL_FAILURE]: allFailure,
  [Types.WEIGHT_UPDATE_FAILURE]: updateFailure,
  [Types.WEIGHT_DELETE_FAILURE]: deleteFailure,
  [Types.WEIGHT_RESET]: reset,
});
