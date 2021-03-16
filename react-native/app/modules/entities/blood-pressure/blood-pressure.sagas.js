import { call, put } from 'redux-saga/effects';
import { callApi } from '../../../shared/sagas/call-api.saga';
import BloodPressureActions from './blood-pressure.reducer';
import { convertDateTimeFromServer } from '../../../shared/util/date-transforms';

function* getBloodPressure(api, action) {
  const { bloodPressureId } = action;
  // make the call to the api
  const apiCall = call(api.getBloodPressure, bloodPressureId);
  const response = yield call(callApi, apiCall);

  // success?
  if (response.ok) {
    response.data = mapDateFields(response.data);
    yield put(BloodPressureActions.bloodPressureSuccess(response.data));
  } else {
    yield put(BloodPressureActions.bloodPressureFailure(response.data));
  }
}

function* getAllBloodPressures(api, action) {
  const { options } = action;
  // make the call to the api
  const apiCall = call(api.getAllBloodPressures, options);
  const response = yield call(callApi, apiCall);

  // success?
  if (response.ok) {
    yield put(BloodPressureActions.bloodPressureAllSuccess(response.data, response.headers));
  } else {
    yield put(BloodPressureActions.bloodPressureAllFailure(response.data));
  }
}

function* updateBloodPressure(api, action) {
  const { bloodPressure } = action;
  // make the call to the api
  const idIsNotNull = !(bloodPressure.id === null || bloodPressure.id === undefined);
  const apiCall = call(idIsNotNull ? api.updateBloodPressure : api.createBloodPressure, bloodPressure);
  const response = yield call(callApi, apiCall);

  // success?
  if (response.ok) {
    response.data = mapDateFields(response.data);
    yield put(BloodPressureActions.bloodPressureUpdateSuccess(response.data));
  } else {
    yield put(BloodPressureActions.bloodPressureUpdateFailure(response.data));
  }
}

function* deleteBloodPressure(api, action) {
  const { bloodPressureId } = action;
  // make the call to the api
  const apiCall = call(api.deleteBloodPressure, bloodPressureId);
  const response = yield call(callApi, apiCall);

  // success?
  if (response.ok) {
    yield put(BloodPressureActions.bloodPressureDeleteSuccess());
  } else {
    yield put(BloodPressureActions.bloodPressureDeleteFailure(response.data));
  }
}
function mapDateFields(data) {
  data.timestamp = convertDateTimeFromServer(data.timestamp);
  return data;
}

export default {
  getAllBloodPressures,
  getBloodPressure,
  deleteBloodPressure,
  updateBloodPressure,
};
