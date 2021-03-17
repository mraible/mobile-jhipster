import { put } from 'redux-saga/effects';

import FixtureAPI from '../../../../../app/shared/services/fixture-api';
import PreferencesSagas from '../../../../../app/modules/entities/preferences/preferences.sagas';
import PreferencesActions from '../../../../../app/modules/entities/preferences/preferences.reducer';

const { getPreferences, getAllPreferences, updatePreferences, deletePreferences } = PreferencesSagas;
const stepper = (fn) => (mock) => fn.next(mock).value;

test('get success path', () => {
  const response = FixtureAPI.getPreferences(1);
  const step = stepper(getPreferences(FixtureAPI, { preferencesId: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Successful return and data!
  expect(step(response)).toEqual(put(PreferencesActions.preferencesSuccess(response.data)));
});

test('get failure path', () => {
  const response = { ok: false };
  const step = stepper(getPreferences(FixtureAPI, { preferencesId: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Failed response.
  expect(step(response)).toEqual(put(PreferencesActions.preferencesFailure()));
});

test('getAll success path', () => {
  const response = FixtureAPI.getAllPreferences();
  const step = stepper(getAllPreferences(FixtureAPI, { options: { page: 0, sort: 'id,asc', size: 20 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Successful return and data!
  expect(step(response)).toEqual(put(PreferencesActions.preferencesAllSuccess([{ id: 1 }, { id: 2 }])));
});

test('getAll failure path', () => {
  const response = { ok: false };
  const step = stepper(getAllPreferences(FixtureAPI, { options: { page: 0, sort: 'id,asc', size: 20 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Failed response.
  expect(step(response)).toEqual(put(PreferencesActions.preferencesAllFailure()));
});

test('update success path', () => {
  const response = FixtureAPI.updatePreferences({ id: 1 });
  const step = stepper(updatePreferences(FixtureAPI, { preferences: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Successful return and data!
  expect(step(response)).toEqual(put(PreferencesActions.preferencesUpdateSuccess(response.data)));
});

test('update failure path', () => {
  const response = { ok: false };
  const step = stepper(updatePreferences(FixtureAPI, { preferences: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Failed response.
  expect(step(response)).toEqual(put(PreferencesActions.preferencesUpdateFailure()));
});

test('delete success path', () => {
  const response = FixtureAPI.deletePreferences({ id: 1 });
  const step = stepper(deletePreferences(FixtureAPI, { preferencesId: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Successful return and data!
  expect(step(response)).toEqual(put(PreferencesActions.preferencesDeleteSuccess(response.data)));
});

test('delete failure path', () => {
  const response = { ok: false };
  const step = stepper(deletePreferences(FixtureAPI, { preferencesId: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Failed response.
  expect(step(response)).toEqual(put(PreferencesActions.preferencesDeleteFailure()));
});
