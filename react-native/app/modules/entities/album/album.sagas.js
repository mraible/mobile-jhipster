import { call, put } from 'redux-saga/effects';
import { callApi } from '../../../shared/sagas/call-api.saga';
import AlbumActions from './album.reducer';
import { convertDateTimeFromServer } from '../../../shared/util/date-transforms';

function* getAlbum(api, action) {
  const { albumId } = action;
  // make the call to the api
  const apiCall = call(api.getAlbum, albumId);
  const response = yield call(callApi, apiCall);

  // success?
  if (response.ok) {
    response.data = mapDateFields(response.data);
    yield put(AlbumActions.albumSuccess(response.data));
  } else {
    yield put(AlbumActions.albumFailure(response.data));
  }
}

function* getAllAlbums(api, action) {
  const { options } = action;
  // make the call to the api
  const apiCall = call(api.getAllAlbums, options);
  const response = yield call(callApi, apiCall);

  // success?
  if (response.ok) {
    yield put(AlbumActions.albumAllSuccess(response.data, response.headers));
  } else {
    yield put(AlbumActions.albumAllFailure(response.data));
  }
}

function* updateAlbum(api, action) {
  const { album } = action;
  // make the call to the api
  const idIsNotNull = !(album.id === null || album.id === undefined);
  const apiCall = call(idIsNotNull ? api.updateAlbum : api.createAlbum, album);
  const response = yield call(callApi, apiCall);

  // success?
  if (response.ok) {
    response.data = mapDateFields(response.data);
    yield put(AlbumActions.albumUpdateSuccess(response.data));
  } else {
    yield put(AlbumActions.albumUpdateFailure(response.data));
  }
}

function* deleteAlbum(api, action) {
  const { albumId } = action;
  // make the call to the api
  const apiCall = call(api.deleteAlbum, albumId);
  const response = yield call(callApi, apiCall);

  // success?
  if (response.ok) {
    yield put(AlbumActions.albumDeleteSuccess());
  } else {
    yield put(AlbumActions.albumDeleteFailure(response.data));
  }
}
function mapDateFields(data) {
  data.created = convertDateTimeFromServer(data.created);
  return data;
}

export default {
  getAllAlbums,
  getAlbum,
  deleteAlbum,
  updateAlbum,
};
