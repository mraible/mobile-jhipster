import FixtureAPI from '../../../../app/shared/services/fixture-api';
import { put } from 'redux-saga/effects';
import UserSagas from '../../../../app/shared/sagas/user.sagas';
import UserActions from '../../../../app/shared/reducers/user.reducer';

const stepper = (fn) => (mock) => fn.next(mock).value;

test('getAll success path', () => {
  const response = FixtureAPI.getAllUsers();
  const step = stepper(UserSagas.getAllUsers(FixtureAPI, { options: { page: 0, sort: 'id,asc', size: 20 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Successful return and data!
  expect(step(response)).toEqual(put(UserActions.userAllSuccess([{ id: 1 }, { id: 2 }])));
});

test('getAll failure path', () => {
  const response = { ok: false };
  const step = stepper(UserSagas.getAllUsers(FixtureAPI, { options: { page: 0, sort: 'id,asc', size: 20 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Failed response.
  expect(step(response)).toEqual(put(UserActions.userAllFailure()));
});
