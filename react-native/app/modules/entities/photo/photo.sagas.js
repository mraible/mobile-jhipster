import { call, put } from 'redux-saga/effects';
import { callApi } from '../../../shared/sagas/call-api.saga';
import PhotoActions from './photo.reducer';
import { convertDateTimeFromServer } from '../../../shared/util/date-transforms';

function* getPhoto(api, action) {
  const { photoId } = action;
  // make the call to the api
  const apiCall = call(api.getPhoto, photoId);
  const response = yield call(callApi, apiCall);

  // success?
  if (response.ok) {
    response.data = mapDateFields(response.data);
    yield put(PhotoActions.photoSuccess(response.data));
  } else {
    yield put(PhotoActions.photoFailure(response.data));
  }
}

function* getAllPhotos(api, action) {
  const { options } = action;
  // make the call to the api
  const apiCall = call(api.getAllPhotos, options);
  const response = yield call(callApi, apiCall);

  // success?
  if (response.ok) {
    yield put(PhotoActions.photoAllSuccess(response.data, response.headers));
  } else {
    yield put(PhotoActions.photoAllFailure(response.data));
  }
}

function* updatePhoto(api, action) {
  const { photo } = action;
  // make the call to the api
  const idIsNotNull = !(photo.id === null || photo.id === undefined);
  const apiCall = call(idIsNotNull ? api.updatePhoto : api.createPhoto, photo);
  const response = yield call(callApi, apiCall);

  // success?
  if (response.ok) {
    response.data = mapDateFields(response.data);
    yield put(PhotoActions.photoUpdateSuccess(response.data));
  } else {
    yield put(PhotoActions.photoUpdateFailure(response.data));
  }
}

function* deletePhoto(api, action) {
  const { photoId } = action;
  // make the call to the api
  const apiCall = call(api.deletePhoto, photoId);
  const response = yield call(callApi, apiCall);

  // success?
  if (response.ok) {
    yield put(PhotoActions.photoDeleteSuccess());
  } else {
    yield put(PhotoActions.photoDeleteFailure(response.data));
  }
}
function mapDateFields(data) {
  data.taken = convertDateTimeFromServer(data.taken);
  data.uploaded = convertDateTimeFromServer(data.uploaded);
  return data;
}

export default {
  getAllPhotos,
  getPhoto,
  deletePhoto,
  updatePhoto,
};
