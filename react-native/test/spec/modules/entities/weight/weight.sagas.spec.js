import { put } from 'redux-saga/effects';

import FixtureAPI from '../../../../../app/shared/services/fixture-api';
import WeightSagas from '../../../../../app/modules/entities/weight/weight.sagas';
import WeightActions from '../../../../../app/modules/entities/weight/weight.reducer';

const { getWeight, getAllWeights, updateWeight, deleteWeight } = WeightSagas;
const stepper = (fn) => (mock) => fn.next(mock).value;

test('get success path', () => {
  const response = FixtureAPI.getWeight(1);
  const step = stepper(getWeight(FixtureAPI, { weightId: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Successful return and data!
  expect(step(response)).toEqual(put(WeightActions.weightSuccess(response.data)));
});

test('get failure path', () => {
  const response = { ok: false };
  const step = stepper(getWeight(FixtureAPI, { weightId: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Failed response.
  expect(step(response)).toEqual(put(WeightActions.weightFailure()));
});

test('getAll success path', () => {
  const response = FixtureAPI.getAllWeights();
  const step = stepper(getAllWeights(FixtureAPI, { options: { page: 0, sort: 'id,asc', size: 20 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Successful return and data!
  expect(step(response)).toEqual(put(WeightActions.weightAllSuccess([{ id: 1 }, { id: 2 }])));
});

test('getAll failure path', () => {
  const response = { ok: false };
  const step = stepper(getAllWeights(FixtureAPI, { options: { page: 0, sort: 'id,asc', size: 20 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Failed response.
  expect(step(response)).toEqual(put(WeightActions.weightAllFailure()));
});

test('update success path', () => {
  const response = FixtureAPI.updateWeight({ id: 1 });
  const step = stepper(updateWeight(FixtureAPI, { weight: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Successful return and data!
  expect(step(response)).toEqual(put(WeightActions.weightUpdateSuccess(response.data)));
});

test('update failure path', () => {
  const response = { ok: false };
  const step = stepper(updateWeight(FixtureAPI, { weight: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Failed response.
  expect(step(response)).toEqual(put(WeightActions.weightUpdateFailure()));
});

test('delete success path', () => {
  const response = FixtureAPI.deleteWeight({ id: 1 });
  const step = stepper(deleteWeight(FixtureAPI, { weightId: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Successful return and data!
  expect(step(response)).toEqual(put(WeightActions.weightDeleteSuccess(response.data)));
});

test('delete failure path', () => {
  const response = { ok: false };
  const step = stepper(deleteWeight(FixtureAPI, { weightId: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Failed response.
  expect(step(response)).toEqual(put(WeightActions.weightDeleteFailure()));
});
