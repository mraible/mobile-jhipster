import { call, put } from 'redux-saga/effects';
import { callApi } from '../../../shared/sagas/call-api.saga';
import PreferencesActions from './preferences.reducer';

function* getPreferences(api, action) {
  const { preferencesId } = action;
  // make the call to the api
  const apiCall = call(api.getPreferences, preferencesId);
  const response = yield call(callApi, apiCall);

  // success?
  if (response.ok) {
    yield put(PreferencesActions.preferencesSuccess(response.data));
  } else {
    yield put(PreferencesActions.preferencesFailure(response.data));
  }
}

function* getAllPreferences(api, action) {
  const { options } = action;
  // make the call to the api
  const apiCall = call(api.getAllPreferences, options);
  const response = yield call(callApi, apiCall);

  // success?
  if (response.ok) {
    yield put(PreferencesActions.preferencesAllSuccess(response.data, response.headers));
  } else {
    yield put(PreferencesActions.preferencesAllFailure(response.data));
  }
}

function* updatePreferences(api, action) {
  const { preferences } = action;
  // make the call to the api
  const idIsNotNull = !(preferences.id === null || preferences.id === undefined);
  const apiCall = call(idIsNotNull ? api.updatePreferences : api.createPreferences, preferences);
  const response = yield call(callApi, apiCall);

  // success?
  if (response.ok) {
    yield put(PreferencesActions.preferencesUpdateSuccess(response.data));
  } else {
    yield put(PreferencesActions.preferencesUpdateFailure(response.data));
  }
}

function* deletePreferences(api, action) {
  const { preferencesId } = action;
  // make the call to the api
  const apiCall = call(api.deletePreferences, preferencesId);
  const response = yield call(callApi, apiCall);

  // success?
  if (response.ok) {
    yield put(PreferencesActions.preferencesDeleteSuccess());
  } else {
    yield put(PreferencesActions.preferencesDeleteFailure(response.data));
  }
}

export default {
  getAllPreferences,
  getPreferences,
  deletePreferences,
  updatePreferences,
};
