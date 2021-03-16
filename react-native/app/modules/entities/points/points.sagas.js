import { call, put } from 'redux-saga/effects';
import { callApi } from '../../../shared/sagas/call-api.saga';
import PointsActions from './points.reducer';
import { convertLocalDateFromServer } from '../../../shared/util/date-transforms';

function* getPoints(api, action) {
  const { pointsId } = action;
  // make the call to the api
  const apiCall = call(api.getPoints, pointsId);
  const response = yield call(callApi, apiCall);

  // success?
  if (response.ok) {
    response.data = mapDateFields(response.data);
    yield put(PointsActions.pointsSuccess(response.data));
  } else {
    yield put(PointsActions.pointsFailure(response.data));
  }
}

function* getAllPoints(api, action) {
  const { options } = action;
  // make the call to the api
  const apiCall = call(api.getAllPoints, options);
  const response = yield call(callApi, apiCall);

  // success?
  if (response.ok) {
    yield put(PointsActions.pointsAllSuccess(response.data, response.headers));
  } else {
    yield put(PointsActions.pointsAllFailure(response.data));
  }
}

function* updatePoints(api, action) {
  const { points } = action;
  // make the call to the api
  const idIsNotNull = !(points.id === null || points.id === undefined);
  const apiCall = call(idIsNotNull ? api.updatePoints : api.createPoints, points);
  const response = yield call(callApi, apiCall);

  // success?
  if (response.ok) {
    response.data = mapDateFields(response.data);
    yield put(PointsActions.pointsUpdateSuccess(response.data));
  } else {
    yield put(PointsActions.pointsUpdateFailure(response.data));
  }
}

function* deletePoints(api, action) {
  const { pointsId } = action;
  // make the call to the api
  const apiCall = call(api.deletePoints, pointsId);
  const response = yield call(callApi, apiCall);

  // success?
  if (response.ok) {
    yield put(PointsActions.pointsDeleteSuccess());
  } else {
    yield put(PointsActions.pointsDeleteFailure(response.data));
  }
}
function mapDateFields(data) {
  data.date = convertLocalDateFromServer(data.date);
  return data;
}

export default {
  getAllPoints,
  getPoints,
  deletePoints,
  updatePoints,
};
