import { createReducer, createActions } from 'reduxsauce';
import Immutable from 'seamless-immutable';
import { loadMoreDataWhenScrolled } from '../../../shared/util/pagination-utils';
import { parseHeaderForLinks } from '../../../shared/util/url-utils';

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  tagRequest: ['tagId'],
  tagAllRequest: ['options'],
  tagUpdateRequest: ['tag'],
  tagDeleteRequest: ['tagId'],

  tagSuccess: ['tag'],
  tagAllSuccess: ['tagList', 'headers'],
  tagUpdateSuccess: ['tag'],
  tagDeleteSuccess: [],

  tagFailure: ['error'],
  tagAllFailure: ['error'],
  tagUpdateFailure: ['error'],
  tagDeleteFailure: ['error'],

  tagReset: [],
});

export const TagTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  fetchingOne: false,
  fetchingAll: false,
  updating: false,
  deleting: false,
  updateSuccess: false,
  tag: { id: undefined },
  tagList: [],
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
    tag: INITIAL_STATE.tag,
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
  const { tag } = action;
  return state.merge({
    fetchingOne: false,
    errorOne: null,
    tag,
  });
};
// successful api lookup for all entities
export const allSuccess = (state, action) => {
  const { tagList, headers } = action;
  const links = parseHeaderForLinks(headers.link);
  return state.merge({
    fetchingAll: false,
    errorAll: null,
    links,
    totalItems: parseInt(headers['x-total-count'], 10),
    tagList: loadMoreDataWhenScrolled(state.tagList, tagList, links),
  });
};
// successful api update
export const updateSuccess = (state, action) => {
  const { tag } = action;
  return state.merge({
    updateSuccess: true,
    updating: false,
    errorUpdating: null,
    tag,
  });
};
// successful api delete
export const deleteSuccess = (state) => {
  return state.merge({
    deleting: false,
    errorDeleting: null,
    tag: INITIAL_STATE.tag,
  });
};

// Something went wrong fetching a single entity.
export const failure = (state, action) => {
  const { error } = action;
  return state.merge({
    fetchingOne: false,
    errorOne: error,
    tag: INITIAL_STATE.tag,
  });
};
// Something went wrong fetching all entities.
export const allFailure = (state, action) => {
  const { error } = action;
  return state.merge({
    fetchingAll: false,
    errorAll: error,
    tagList: [],
  });
};
// Something went wrong updating.
export const updateFailure = (state, action) => {
  const { error } = action;
  return state.merge({
    updateSuccess: false,
    updating: false,
    errorUpdating: error,
    tag: state.tag,
  });
};
// Something went wrong deleting.
export const deleteFailure = (state, action) => {
  const { error } = action;
  return state.merge({
    deleting: false,
    errorDeleting: error,
    tag: state.tag,
  });
};

export const reset = (state) => INITIAL_STATE;

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.TAG_REQUEST]: request,
  [Types.TAG_ALL_REQUEST]: allRequest,
  [Types.TAG_UPDATE_REQUEST]: updateRequest,
  [Types.TAG_DELETE_REQUEST]: deleteRequest,

  [Types.TAG_SUCCESS]: success,
  [Types.TAG_ALL_SUCCESS]: allSuccess,
  [Types.TAG_UPDATE_SUCCESS]: updateSuccess,
  [Types.TAG_DELETE_SUCCESS]: deleteSuccess,

  [Types.TAG_FAILURE]: failure,
  [Types.TAG_ALL_FAILURE]: allFailure,
  [Types.TAG_UPDATE_FAILURE]: updateFailure,
  [Types.TAG_DELETE_FAILURE]: deleteFailure,
  [Types.TAG_RESET]: reset,
});
