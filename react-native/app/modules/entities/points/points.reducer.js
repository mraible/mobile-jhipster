import { createReducer, createActions } from 'reduxsauce';
import Immutable from 'seamless-immutable';
import { loadMoreDataWhenScrolled } from '../../../shared/util/pagination-utils';
import { parseHeaderForLinks } from '../../../shared/util/url-utils';

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  pointsRequest: ['pointsId'],
  pointsAllRequest: ['options'],
  pointsUpdateRequest: ['points'],
  pointsDeleteRequest: ['pointsId'],

  pointsSuccess: ['points'],
  pointsAllSuccess: ['pointsList', 'headers'],
  pointsUpdateSuccess: ['points'],
  pointsDeleteSuccess: [],

  pointsFailure: ['error'],
  pointsAllFailure: ['error'],
  pointsUpdateFailure: ['error'],
  pointsDeleteFailure: ['error'],

  pointsReset: [],
});

export const PointsTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  fetchingOne: false,
  fetchingAll: false,
  updating: false,
  deleting: false,
  updateSuccess: false,
  points: { id: undefined },
  pointsList: [],
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
    points: INITIAL_STATE.points,
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
  const { points } = action;
  return state.merge({
    fetchingOne: false,
    errorOne: null,
    points,
  });
};
// successful api lookup for all entities
export const allSuccess = (state, action) => {
  const { pointsList, headers } = action;
  const links = parseHeaderForLinks(headers.link);
  return state.merge({
    fetchingAll: false,
    errorAll: null,
    links,
    totalItems: parseInt(headers['x-total-count'], 10),
    pointsList: loadMoreDataWhenScrolled(state.pointsList, pointsList, links),
  });
};
// successful api update
export const updateSuccess = (state, action) => {
  const { points } = action;
  return state.merge({
    updateSuccess: true,
    updating: false,
    errorUpdating: null,
    points,
  });
};
// successful api delete
export const deleteSuccess = (state) => {
  return state.merge({
    deleting: false,
    errorDeleting: null,
    points: INITIAL_STATE.points,
  });
};

// Something went wrong fetching a single entity.
export const failure = (state, action) => {
  const { error } = action;
  return state.merge({
    fetchingOne: false,
    errorOne: error,
    points: INITIAL_STATE.points,
  });
};
// Something went wrong fetching all entities.
export const allFailure = (state, action) => {
  const { error } = action;
  return state.merge({
    fetchingAll: false,
    errorAll: error,
    pointsList: [],
  });
};
// Something went wrong updating.
export const updateFailure = (state, action) => {
  const { error } = action;
  return state.merge({
    updateSuccess: false,
    updating: false,
    errorUpdating: error,
    points: state.points,
  });
};
// Something went wrong deleting.
export const deleteFailure = (state, action) => {
  const { error } = action;
  return state.merge({
    deleting: false,
    errorDeleting: error,
    points: state.points,
  });
};

export const reset = (state) => INITIAL_STATE;

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.POINTS_REQUEST]: request,
  [Types.POINTS_ALL_REQUEST]: allRequest,
  [Types.POINTS_UPDATE_REQUEST]: updateRequest,
  [Types.POINTS_DELETE_REQUEST]: deleteRequest,

  [Types.POINTS_SUCCESS]: success,
  [Types.POINTS_ALL_SUCCESS]: allSuccess,
  [Types.POINTS_UPDATE_SUCCESS]: updateSuccess,
  [Types.POINTS_DELETE_SUCCESS]: deleteSuccess,

  [Types.POINTS_FAILURE]: failure,
  [Types.POINTS_ALL_FAILURE]: allFailure,
  [Types.POINTS_UPDATE_FAILURE]: updateFailure,
  [Types.POINTS_DELETE_FAILURE]: deleteFailure,
  [Types.POINTS_RESET]: reset,
});
