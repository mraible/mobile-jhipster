import { put } from 'redux-saga/effects';

import FixtureAPI from '../../../../../app/shared/services/fixture-api';
import PhotoSagas from '../../../../../app/modules/entities/photo/photo.sagas';
import PhotoActions from '../../../../../app/modules/entities/photo/photo.reducer';

const { getPhoto, getAllPhotos, updatePhoto, deletePhoto } = PhotoSagas;
const stepper = (fn) => (mock) => fn.next(mock).value;

test('get success path', () => {
  const response = FixtureAPI.getPhoto(1);
  const step = stepper(getPhoto(FixtureAPI, { photoId: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Successful return and data!
  expect(step(response)).toEqual(put(PhotoActions.photoSuccess(response.data)));
});

test('get failure path', () => {
  const response = { ok: false };
  const step = stepper(getPhoto(FixtureAPI, { photoId: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Failed response.
  expect(step(response)).toEqual(put(PhotoActions.photoFailure()));
});

test('getAll success path', () => {
  const response = FixtureAPI.getAllPhotos();
  const step = stepper(getAllPhotos(FixtureAPI, { options: { page: 0, sort: 'id,asc', size: 20 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Successful return and data!
  expect(step(response)).toEqual(put(PhotoActions.photoAllSuccess([{ id: 1 }, { id: 2 }])));
});

test('getAll failure path', () => {
  const response = { ok: false };
  const step = stepper(getAllPhotos(FixtureAPI, { options: { page: 0, sort: 'id,asc', size: 20 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Failed response.
  expect(step(response)).toEqual(put(PhotoActions.photoAllFailure()));
});

test('update success path', () => {
  const response = FixtureAPI.updatePhoto({ id: 1 });
  const step = stepper(updatePhoto(FixtureAPI, { photo: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Successful return and data!
  expect(step(response)).toEqual(put(PhotoActions.photoUpdateSuccess(response.data)));
});

test('update failure path', () => {
  const response = { ok: false };
  const step = stepper(updatePhoto(FixtureAPI, { photo: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Failed response.
  expect(step(response)).toEqual(put(PhotoActions.photoUpdateFailure()));
});

test('delete success path', () => {
  const response = FixtureAPI.deletePhoto({ id: 1 });
  const step = stepper(deletePhoto(FixtureAPI, { photoId: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Successful return and data!
  expect(step(response)).toEqual(put(PhotoActions.photoDeleteSuccess(response.data)));
});

test('delete failure path', () => {
  const response = { ok: false };
  const step = stepper(deletePhoto(FixtureAPI, { photoId: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Failed response.
  expect(step(response)).toEqual(put(PhotoActions.photoDeleteFailure()));
});
