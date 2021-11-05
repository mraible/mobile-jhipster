import { put } from 'redux-saga/effects';

import FixtureAPI from '../../../../../app/shared/services/fixture-api';
import TagSagas from '../../../../../app/modules/entities/tag/tag.sagas';
import TagActions from '../../../../../app/modules/entities/tag/tag.reducer';

const { getTag, getAllTags, updateTag, deleteTag } = TagSagas;
const stepper = (fn) => (mock) => fn.next(mock).value;

test('get success path', () => {
  const response = FixtureAPI.getTag(1);
  const step = stepper(getTag(FixtureAPI, { tagId: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Successful return and data!
  expect(step(response)).toEqual(put(TagActions.tagSuccess(response.data)));
});

test('get failure path', () => {
  const response = { ok: false };
  const step = stepper(getTag(FixtureAPI, { tagId: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Failed response.
  expect(step(response)).toEqual(put(TagActions.tagFailure()));
});

test('getAll success path', () => {
  const response = FixtureAPI.getAllTags();
  const step = stepper(getAllTags(FixtureAPI, { options: { page: 0, sort: 'id,asc', size: 20 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Successful return and data!
  expect(step(response)).toEqual(put(TagActions.tagAllSuccess([{ id: 1 }, { id: 2 }])));
});

test('getAll failure path', () => {
  const response = { ok: false };
  const step = stepper(getAllTags(FixtureAPI, { options: { page: 0, sort: 'id,asc', size: 20 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Failed response.
  expect(step(response)).toEqual(put(TagActions.tagAllFailure()));
});

test('update success path', () => {
  const response = FixtureAPI.updateTag({ id: 1 });
  const step = stepper(updateTag(FixtureAPI, { tag: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Successful return and data!
  expect(step(response)).toEqual(put(TagActions.tagUpdateSuccess(response.data)));
});

test('update failure path', () => {
  const response = { ok: false };
  const step = stepper(updateTag(FixtureAPI, { tag: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Failed response.
  expect(step(response)).toEqual(put(TagActions.tagUpdateFailure()));
});

test('delete success path', () => {
  const response = FixtureAPI.deleteTag({ id: 1 });
  const step = stepper(deleteTag(FixtureAPI, { tagId: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Successful return and data!
  expect(step(response)).toEqual(put(TagActions.tagDeleteSuccess(response.data)));
});

test('delete failure path', () => {
  const response = { ok: false };
  const step = stepper(deleteTag(FixtureAPI, { tagId: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Failed response.
  expect(step(response)).toEqual(put(TagActions.tagDeleteFailure()));
});
