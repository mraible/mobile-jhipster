import { createReducer, createActions } from 'reduxsauce';
import Immutable from 'seamless-immutable';
import { loadMoreDataWhenScrolled } from '../../../shared/util/pagination-utils';
import { parseHeaderForLinks } from '../../../shared/util/url-utils';

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  albumRequest: ['albumId'],
  albumAllRequest: ['options'],
  albumUpdateRequest: ['album'],
  albumDeleteRequest: ['albumId'],

  albumSuccess: ['album'],
  albumAllSuccess: ['albumList', 'headers'],
  albumUpdateSuccess: ['album'],
  albumDeleteSuccess: [],

  albumFailure: ['error'],
  albumAllFailure: ['error'],
  albumUpdateFailure: ['error'],
  albumDeleteFailure: ['error'],

  albumReset: [],
});

export const AlbumTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  fetchingOne: false,
  fetchingAll: false,
  updating: false,
  deleting: false,
  updateSuccess: false,
  album: { id: undefined },
  albumList: [],
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
    album: INITIAL_STATE.album,
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
  const { album } = action;
  return state.merge({
    fetchingOne: false,
    errorOne: null,
    album,
  });
};
// successful api lookup for all entities
export const allSuccess = (state, action) => {
  const { albumList, headers } = action;
  const links = parseHeaderForLinks(headers.link);
  return state.merge({
    fetchingAll: false,
    errorAll: null,
    links,
    totalItems: parseInt(headers['x-total-count'], 10),
    albumList: loadMoreDataWhenScrolled(state.albumList, albumList, links),
  });
};
// successful api update
export const updateSuccess = (state, action) => {
  const { album } = action;
  return state.merge({
    updateSuccess: true,
    updating: false,
    errorUpdating: null,
    album,
  });
};
// successful api delete
export const deleteSuccess = (state) => {
  return state.merge({
    deleting: false,
    errorDeleting: null,
    album: INITIAL_STATE.album,
  });
};

// Something went wrong fetching a single entity.
export const failure = (state, action) => {
  const { error } = action;
  return state.merge({
    fetchingOne: false,
    errorOne: error,
    album: INITIAL_STATE.album,
  });
};
// Something went wrong fetching all entities.
export const allFailure = (state, action) => {
  const { error } = action;
  return state.merge({
    fetchingAll: false,
    errorAll: error,
    albumList: [],
  });
};
// Something went wrong updating.
export const updateFailure = (state, action) => {
  const { error } = action;
  return state.merge({
    updateSuccess: false,
    updating: false,
    errorUpdating: error,
    album: state.album,
  });
};
// Something went wrong deleting.
export const deleteFailure = (state, action) => {
  const { error } = action;
  return state.merge({
    deleting: false,
    errorDeleting: error,
    album: state.album,
  });
};

export const reset = (state) => INITIAL_STATE;

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.ALBUM_REQUEST]: request,
  [Types.ALBUM_ALL_REQUEST]: allRequest,
  [Types.ALBUM_UPDATE_REQUEST]: updateRequest,
  [Types.ALBUM_DELETE_REQUEST]: deleteRequest,

  [Types.ALBUM_SUCCESS]: success,
  [Types.ALBUM_ALL_SUCCESS]: allSuccess,
  [Types.ALBUM_UPDATE_SUCCESS]: updateSuccess,
  [Types.ALBUM_DELETE_SUCCESS]: deleteSuccess,

  [Types.ALBUM_FAILURE]: failure,
  [Types.ALBUM_ALL_FAILURE]: allFailure,
  [Types.ALBUM_UPDATE_FAILURE]: updateFailure,
  [Types.ALBUM_DELETE_FAILURE]: deleteFailure,
  [Types.ALBUM_RESET]: reset,
});
