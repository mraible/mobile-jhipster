import { put } from 'redux-saga/effects';

import FixtureAPI from '../../../../../app/shared/services/fixture-api';
import AlbumSagas from '../../../../../app/modules/entities/album/album.sagas';
import AlbumActions from '../../../../../app/modules/entities/album/album.reducer';

const { getAlbum, getAllAlbums, updateAlbum, deleteAlbum } = AlbumSagas;
const stepper = (fn) => (mock) => fn.next(mock).value;

test('get success path', () => {
  const response = FixtureAPI.getAlbum(1);
  const step = stepper(getAlbum(FixtureAPI, { albumId: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Successful return and data!
  expect(step(response)).toEqual(put(AlbumActions.albumSuccess(response.data)));
});

test('get failure path', () => {
  const response = { ok: false };
  const step = stepper(getAlbum(FixtureAPI, { albumId: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Failed response.
  expect(step(response)).toEqual(put(AlbumActions.albumFailure()));
});

test('getAll success path', () => {
  const response = FixtureAPI.getAllAlbums();
  const step = stepper(getAllAlbums(FixtureAPI, { options: { page: 0, sort: 'id,asc', size: 20 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Successful return and data!
  expect(step(response)).toEqual(put(AlbumActions.albumAllSuccess([{ id: 1 }, { id: 2 }])));
});

test('getAll failure path', () => {
  const response = { ok: false };
  const step = stepper(getAllAlbums(FixtureAPI, { options: { page: 0, sort: 'id,asc', size: 20 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Failed response.
  expect(step(response)).toEqual(put(AlbumActions.albumAllFailure()));
});

test('update success path', () => {
  const response = FixtureAPI.updateAlbum({ id: 1 });
  const step = stepper(updateAlbum(FixtureAPI, { album: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Successful return and data!
  expect(step(response)).toEqual(put(AlbumActions.albumUpdateSuccess(response.data)));
});

test('update failure path', () => {
  const response = { ok: false };
  const step = stepper(updateAlbum(FixtureAPI, { album: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Failed response.
  expect(step(response)).toEqual(put(AlbumActions.albumUpdateFailure()));
});

test('delete success path', () => {
  const response = FixtureAPI.deleteAlbum({ id: 1 });
  const step = stepper(deleteAlbum(FixtureAPI, { albumId: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Successful return and data!
  expect(step(response)).toEqual(put(AlbumActions.albumDeleteSuccess(response.data)));
});

test('delete failure path', () => {
  const response = { ok: false };
  const step = stepper(deleteAlbum(FixtureAPI, { albumId: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Failed response.
  expect(step(response)).toEqual(put(AlbumActions.albumDeleteFailure()));
});
