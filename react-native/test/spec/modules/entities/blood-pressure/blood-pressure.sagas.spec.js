import { put } from 'redux-saga/effects';

import FixtureAPI from '../../../../../app/shared/services/fixture-api';
import BloodPressureSagas from '../../../../../app/modules/entities/blood-pressure/blood-pressure.sagas';
import BloodPressureActions from '../../../../../app/modules/entities/blood-pressure/blood-pressure.reducer';

const { getBloodPressure, getAllBloodPressures, updateBloodPressure, deleteBloodPressure } = BloodPressureSagas;
const stepper = (fn) => (mock) => fn.next(mock).value;

test('get success path', () => {
  const response = FixtureAPI.getBloodPressure(1);
  const step = stepper(getBloodPressure(FixtureAPI, { bloodPressureId: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Successful return and data!
  expect(step(response)).toEqual(put(BloodPressureActions.bloodPressureSuccess(response.data)));
});

test('get failure path', () => {
  const response = { ok: false };
  const step = stepper(getBloodPressure(FixtureAPI, { bloodPressureId: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Failed response.
  expect(step(response)).toEqual(put(BloodPressureActions.bloodPressureFailure()));
});

test('getAll success path', () => {
  const response = FixtureAPI.getAllBloodPressures();
  const step = stepper(getAllBloodPressures(FixtureAPI, { options: { page: 0, sort: 'id,asc', size: 20 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Successful return and data!
  expect(step(response)).toEqual(put(BloodPressureActions.bloodPressureAllSuccess([{ id: 1 }, { id: 2 }])));
});

test('getAll failure path', () => {
  const response = { ok: false };
  const step = stepper(getAllBloodPressures(FixtureAPI, { options: { page: 0, sort: 'id,asc', size: 20 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Failed response.
  expect(step(response)).toEqual(put(BloodPressureActions.bloodPressureAllFailure()));
});

test('update success path', () => {
  const response = FixtureAPI.updateBloodPressure({ id: 1 });
  const step = stepper(updateBloodPressure(FixtureAPI, { bloodPressure: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Successful return and data!
  expect(step(response)).toEqual(put(BloodPressureActions.bloodPressureUpdateSuccess(response.data)));
});

test('update failure path', () => {
  const response = { ok: false };
  const step = stepper(updateBloodPressure(FixtureAPI, { bloodPressure: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Failed response.
  expect(step(response)).toEqual(put(BloodPressureActions.bloodPressureUpdateFailure()));
});

test('delete success path', () => {
  const response = FixtureAPI.deleteBloodPressure({ id: 1 });
  const step = stepper(deleteBloodPressure(FixtureAPI, { bloodPressureId: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Successful return and data!
  expect(step(response)).toEqual(put(BloodPressureActions.bloodPressureDeleteSuccess(response.data)));
});

test('delete failure path', () => {
  const response = { ok: false };
  const step = stepper(deleteBloodPressure(FixtureAPI, { bloodPressureId: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Failed response.
  expect(step(response)).toEqual(put(BloodPressureActions.bloodPressureDeleteFailure()));
});
