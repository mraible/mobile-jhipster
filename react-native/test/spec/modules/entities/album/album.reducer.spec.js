import Actions, { reducer, INITIAL_STATE } from '../../../../../app/modules/entities/album/album.reducer';

test('attempt retrieving a single album', () => {
  const state = reducer(INITIAL_STATE, Actions.albumRequest({ id: 1 }));

  expect(state.fetchingOne).toBe(true);
  expect(state.album).toEqual({ id: undefined });
});

test('attempt retrieving a list of album', () => {
  const state = reducer(INITIAL_STATE, Actions.albumAllRequest({ id: 1 }));

  expect(state.fetchingAll).toBe(true);
  expect(state.albumList).toEqual([]);
});

test('attempt updating a album', () => {
  const state = reducer(INITIAL_STATE, Actions.albumUpdateRequest({ id: 1 }));

  expect(state.updating).toBe(true);
});
test('attempt to deleting a album', () => {
  const state = reducer(INITIAL_STATE, Actions.albumDeleteRequest({ id: 1 }));

  expect(state.deleting).toBe(true);
});

test('success retrieving a album', () => {
  const state = reducer(INITIAL_STATE, Actions.albumSuccess({ id: 1 }));

  expect(state.fetchingOne).toBe(false);
  expect(state.errorOne).toBe(null);
  expect(state.album).toEqual({ id: 1 });
});

test('success retrieving a list of album', () => {
  const state = reducer(
    INITIAL_STATE,
    Actions.albumAllSuccess([{ id: 1 }, { id: 2 }], { link: '</?page=1>; rel="last",</?page=0>; rel="first"', 'x-total-count': 5 }),
  );

  expect(state.fetchingAll).toBe(false);
  expect(state.errorAll).toBe(null);
  expect(state.albumList).toEqual([{ id: 1 }, { id: 2 }]);
  expect(state.links).toEqual({ first: 0, last: 1 });
  expect(state.totalItems).toEqual(5);
});

test('success updating a album', () => {
  const state = reducer(INITIAL_STATE, Actions.albumUpdateSuccess({ id: 1 }));

  expect(state.updating).toBe(false);
  expect(state.errorUpdating).toBe(null);
  expect(state.album).toEqual({ id: 1 });
});
test('success deleting a album', () => {
  const state = reducer(INITIAL_STATE, Actions.albumDeleteSuccess());

  expect(state.deleting).toBe(false);
  expect(state.errorDeleting).toBe(null);
  expect(state.album).toEqual({ id: undefined });
});

test('failure retrieving a album', () => {
  const state = reducer(INITIAL_STATE, Actions.albumFailure({ error: 'Not found' }));

  expect(state.fetchingOne).toBe(false);
  expect(state.errorOne).toEqual({ error: 'Not found' });
  expect(state.album).toEqual({ id: undefined });
});

test('failure retrieving a list of album', () => {
  const state = reducer(INITIAL_STATE, Actions.albumAllFailure({ error: 'Not found' }));

  expect(state.fetchingAll).toBe(false);
  expect(state.errorAll).toEqual({ error: 'Not found' });
  expect(state.albumList).toEqual([]);
});

test('failure updating a album', () => {
  const state = reducer(INITIAL_STATE, Actions.albumUpdateFailure({ error: 'Not found' }));

  expect(state.updating).toBe(false);
  expect(state.errorUpdating).toEqual({ error: 'Not found' });
  expect(state.album).toEqual(INITIAL_STATE.album);
});
test('failure deleting a album', () => {
  const state = reducer(INITIAL_STATE, Actions.albumDeleteFailure({ error: 'Not found' }));

  expect(state.deleting).toBe(false);
  expect(state.errorDeleting).toEqual({ error: 'Not found' });
  expect(state.album).toEqual(INITIAL_STATE.album);
});

test('resetting state for album', () => {
  const state = reducer({ ...INITIAL_STATE, deleting: true }, Actions.albumReset());
  expect(state).toEqual(INITIAL_STATE);
});
