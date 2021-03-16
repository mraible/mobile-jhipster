import { call, put } from 'redux-saga/effects';
import { callApi } from '../../../shared/sagas/call-api.saga';
import WeightActions from './weight.reducer';
import { convertDateTimeFromServer } from '../../../shared/util/date-transforms';

function* getWeight(api, action) {
  const { weightId } = action;
  // make the call to the api
  const apiCall = call(api.getWeight, weightId);
  const response = yield call(callApi, apiCall);

  // success?
  if (response.ok) {
    response.data = mapDateFields(response.data);
    yield put(WeightActions.weightSuccess(response.data));
  } else {
    yield put(WeightActions.weightFailure(response.data));
  }
}

function* getAllWeights(api, action) {
  const { options } = action;
  // make the call to the api
  const apiCall = call(api.getAllWeights, options);
  const response = yield call(callApi, apiCall);

  // success?
  if (response.ok) {
    yield put(WeightActions.weightAllSuccess(response.data, response.headers));
  } else {
    yield put(WeightActions.weightAllFailure(response.data));
  }
}

function* updateWeight(api, action) {
  const { weight } = action;
  // make the call to the api
  const idIsNotNull = !(weight.id === null || weight.id === undefined);
  const apiCall = call(idIsNotNull ? api.updateWeight : api.createWeight, weight);
  const response = yield call(callApi, apiCall);

  // success?
  if (response.ok) {
    response.data = mapDateFields(response.data);
    yield put(WeightActions.weightUpdateSuccess(response.data));
  } else {
    yield put(WeightActions.weightUpdateFailure(response.data));
  }
}

function* deleteWeight(api, action) {
  const { weightId } = action;
  // make the call to the api
  const apiCall = call(api.deleteWeight, weightId);
  const response = yield call(callApi, apiCall);

  // success?
  if (response.ok) {
    yield put(WeightActions.weightDeleteSuccess());
  } else {
    yield put(WeightActions.weightDeleteFailure(response.data));
  }
}
function mapDateFields(data) {
  data.timestamp = convertDateTimeFromServer(data.timestamp);
  return data;
}

export default {
  getAllWeights,
  getWeight,
  deleteWeight,
  updateWeight,
};
