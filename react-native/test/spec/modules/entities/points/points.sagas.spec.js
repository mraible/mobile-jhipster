import { put } from 'redux-saga/effects';

import FixtureAPI from '../../../../../app/shared/services/fixture-api';
import PointsSagas from '../../../../../app/modules/entities/points/points.sagas';
import PointsActions from '../../../../../app/modules/entities/points/points.reducer';

const { getPoints, getAllPoints, updatePoints, deletePoints } = PointsSagas;
const stepper = (fn) => (mock) => fn.next(mock).value;

test('get success path', () => {
  const response = FixtureAPI.getPoints(1);
  const step = stepper(getPoints(FixtureAPI, { pointsId: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Successful return and data!
  expect(step(response)).toEqual(put(PointsActions.pointsSuccess(response.data)));
});

test('get failure path', () => {
  const response = { ok: false };
  const step = stepper(getPoints(FixtureAPI, { pointsId: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Failed response.
  expect(step(response)).toEqual(put(PointsActions.pointsFailure()));
});

test('getAll success path', () => {
  const response = FixtureAPI.getAllPoints();
  const step = stepper(getAllPoints(FixtureAPI, { options: { page: 0, sort: 'id,asc', size: 20 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Successful return and data!
  expect(step(response)).toEqual(put(PointsActions.pointsAllSuccess([{ id: 1 }, { id: 2 }])));
});

test('getAll failure path', () => {
  const response = { ok: false };
  const step = stepper(getAllPoints(FixtureAPI, { options: { page: 0, sort: 'id,asc', size: 20 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Failed response.
  expect(step(response)).toEqual(put(PointsActions.pointsAllFailure()));
});

test('update success path', () => {
  const response = FixtureAPI.updatePoints({ id: 1 });
  const step = stepper(updatePoints(FixtureAPI, { points: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Successful return and data!
  expect(step(response)).toEqual(put(PointsActions.pointsUpdateSuccess(response.data)));
});

test('update failure path', () => {
  const response = { ok: false };
  const step = stepper(updatePoints(FixtureAPI, { points: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Failed response.
  expect(step(response)).toEqual(put(PointsActions.pointsUpdateFailure()));
});

test('delete success path', () => {
  const response = FixtureAPI.deletePoints({ id: 1 });
  const step = stepper(deletePoints(FixtureAPI, { pointsId: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Successful return and data!
  expect(step(response)).toEqual(put(PointsActions.pointsDeleteSuccess(response.data)));
});

test('delete failure path', () => {
  const response = { ok: false };
  const step = stepper(deletePoints(FixtureAPI, { pointsId: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Failed response.
  expect(step(response)).toEqual(put(PointsActions.pointsDeleteFailure()));
});
