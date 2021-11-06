import { call, put } from 'redux-saga/effects';
import { callApi } from '../../../shared/sagas/call-api.saga';
import TagActions from './tag.reducer';

function* getTag(api, action) {
  const { tagId } = action;
  // make the call to the api
  const apiCall = call(api.getTag, tagId);
  const response = yield call(callApi, apiCall);

  // success?
  if (response.ok) {
    yield put(TagActions.tagSuccess(response.data));
  } else {
    yield put(TagActions.tagFailure(response.data));
  }
}

function* getAllTags(api, action) {
  const { options } = action;
  // make the call to the api
  const apiCall = call(api.getAllTags, options);
  const response = yield call(callApi, apiCall);

  // success?
  if (response.ok) {
    yield put(TagActions.tagAllSuccess(response.data, response.headers));
  } else {
    yield put(TagActions.tagAllFailure(response.data));
  }
}

function* updateTag(api, action) {
  const { tag } = action;
  // make the call to the api
  const idIsNotNull = !(tag.id === null || tag.id === undefined);
  const apiCall = call(idIsNotNull ? api.updateTag : api.createTag, tag);
  const response = yield call(callApi, apiCall);

  // success?
  if (response.ok) {
    yield put(TagActions.tagUpdateSuccess(response.data));
  } else {
    yield put(TagActions.tagUpdateFailure(response.data));
  }
}

function* deleteTag(api, action) {
  const { tagId } = action;
  // make the call to the api
  const apiCall = call(api.deleteTag, tagId);
  const response = yield call(callApi, apiCall);

  // success?
  if (response.ok) {
    yield put(TagActions.tagDeleteSuccess());
  } else {
    yield put(TagActions.tagDeleteFailure(response.data));
  }
}

export default {
  getAllTags,
  getTag,
  deleteTag,
  updateTag,
};
