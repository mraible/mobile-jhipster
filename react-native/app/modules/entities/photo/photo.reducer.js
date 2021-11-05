import { createReducer, createActions } from 'reduxsauce';
import Immutable from 'seamless-immutable';
import { loadMoreDataWhenScrolled } from '../../../shared/util/pagination-utils';
import { parseHeaderForLinks } from '../../../shared/util/url-utils';

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  photoRequest: ['photoId'],
  photoAllRequest: ['options'],
  photoUpdateRequest: ['photo'],
  photoDeleteRequest: ['photoId'],

  photoSuccess: ['photo'],
  photoAllSuccess: ['photoList', 'headers'],
  photoUpdateSuccess: ['photo'],
  photoDeleteSuccess: [],

  photoFailure: ['error'],
  photoAllFailure: ['error'],
  photoUpdateFailure: ['error'],
  photoDeleteFailure: ['error'],

  photoReset: [],
});

export const PhotoTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  fetchingOne: false,
  fetchingAll: false,
  updating: false,
  deleting: false,
  updateSuccess: false,
  photo: { id: undefined },
  photoList: [],
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
    photo: INITIAL_STATE.photo,
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
  const { photo } = action;
  return state.merge({
    fetchingOne: false,
    errorOne: null,
    photo,
  });
};
// successful api lookup for all entities
export const allSuccess = (state, action) => {
  const { photoList, headers } = action;
  const links = parseHeaderForLinks(headers.link);
  return state.merge({
    fetchingAll: false,
    errorAll: null,
    links,
    totalItems: parseInt(headers['x-total-count'], 10),
    photoList: loadMoreDataWhenScrolled(state.photoList, photoList, links),
  });
};
// successful api update
export const updateSuccess = (state, action) => {
  const { photo } = action;
  return state.merge({
    updateSuccess: true,
    updating: false,
    errorUpdating: null,
    photo,
  });
};
// successful api delete
export const deleteSuccess = (state) => {
  return state.merge({
    deleting: false,
    errorDeleting: null,
    photo: INITIAL_STATE.photo,
  });
};

// Something went wrong fetching a single entity.
export const failure = (state, action) => {
  const { error } = action;
  return state.merge({
    fetchingOne: false,
    errorOne: error,
    photo: INITIAL_STATE.photo,
  });
};
// Something went wrong fetching all entities.
export const allFailure = (state, action) => {
  const { error } = action;
  return state.merge({
    fetchingAll: false,
    errorAll: error,
    photoList: [],
  });
};
// Something went wrong updating.
export const updateFailure = (state, action) => {
  const { error } = action;
  return state.merge({
    updateSuccess: false,
    updating: false,
    errorUpdating: error,
    photo: state.photo,
  });
};
// Something went wrong deleting.
export const deleteFailure = (state, action) => {
  const { error } = action;
  return state.merge({
    deleting: false,
    errorDeleting: error,
    photo: state.photo,
  });
};

export const reset = (state) => INITIAL_STATE;

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.PHOTO_REQUEST]: request,
  [Types.PHOTO_ALL_REQUEST]: allRequest,
  [Types.PHOTO_UPDATE_REQUEST]: updateRequest,
  [Types.PHOTO_DELETE_REQUEST]: deleteRequest,

  [Types.PHOTO_SUCCESS]: success,
  [Types.PHOTO_ALL_SUCCESS]: allSuccess,
  [Types.PHOTO_UPDATE_SUCCESS]: updateSuccess,
  [Types.PHOTO_DELETE_SUCCESS]: deleteSuccess,

  [Types.PHOTO_FAILURE]: failure,
  [Types.PHOTO_ALL_FAILURE]: allFailure,
  [Types.PHOTO_UPDATE_FAILURE]: updateFailure,
  [Types.PHOTO_DELETE_FAILURE]: deleteFailure,
  [Types.PHOTO_RESET]: reset,
});
