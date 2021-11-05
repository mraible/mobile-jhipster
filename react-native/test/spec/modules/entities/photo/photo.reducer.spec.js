import Actions, { reducer, INITIAL_STATE } from '../../../../../app/modules/entities/photo/photo.reducer';

test('attempt retrieving a single photo', () => {
  const state = reducer(INITIAL_STATE, Actions.photoRequest({ id: 1 }));

  expect(state.fetchingOne).toBe(true);
  expect(state.photo).toEqual({ id: undefined });
});

test('attempt retrieving a list of photo', () => {
  const state = reducer(INITIAL_STATE, Actions.photoAllRequest({ id: 1 }));

  expect(state.fetchingAll).toBe(true);
  expect(state.photoList).toEqual([]);
});

test('attempt updating a photo', () => {
  const state = reducer(INITIAL_STATE, Actions.photoUpdateRequest({ id: 1 }));

  expect(state.updating).toBe(true);
});
test('attempt to deleting a photo', () => {
  const state = reducer(INITIAL_STATE, Actions.photoDeleteRequest({ id: 1 }));

  expect(state.deleting).toBe(true);
});

test('success retrieving a photo', () => {
  const state = reducer(INITIAL_STATE, Actions.photoSuccess({ id: 1 }));

  expect(state.fetchingOne).toBe(false);
  expect(state.errorOne).toBe(null);
  expect(state.photo).toEqual({ id: 1 });
});

test('success retrieving a list of photo', () => {
  const state = reducer(
    INITIAL_STATE,
    Actions.photoAllSuccess([{ id: 1 }, { id: 2 }], { link: '</?page=1>; rel="last",</?page=0>; rel="first"', 'x-total-count': 5 }),
  );

  expect(state.fetchingAll).toBe(false);
  expect(state.errorAll).toBe(null);
  expect(state.photoList).toEqual([{ id: 1 }, { id: 2 }]);
  expect(state.links).toEqual({ first: 0, last: 1 });
  expect(state.totalItems).toEqual(5);
});

test('success updating a photo', () => {
  const state = reducer(INITIAL_STATE, Actions.photoUpdateSuccess({ id: 1 }));

  expect(state.updating).toBe(false);
  expect(state.errorUpdating).toBe(null);
  expect(state.photo).toEqual({ id: 1 });
});
test('success deleting a photo', () => {
  const state = reducer(INITIAL_STATE, Actions.photoDeleteSuccess());

  expect(state.deleting).toBe(false);
  expect(state.errorDeleting).toBe(null);
  expect(state.photo).toEqual({ id: undefined });
});

test('failure retrieving a photo', () => {
  const state = reducer(INITIAL_STATE, Actions.photoFailure({ error: 'Not found' }));

  expect(state.fetchingOne).toBe(false);
  expect(state.errorOne).toEqual({ error: 'Not found' });
  expect(state.photo).toEqual({ id: undefined });
});

test('failure retrieving a list of photo', () => {
  const state = reducer(INITIAL_STATE, Actions.photoAllFailure({ error: 'Not found' }));

  expect(state.fetchingAll).toBe(false);
  expect(state.errorAll).toEqual({ error: 'Not found' });
  expect(state.photoList).toEqual([]);
});

test('failure updating a photo', () => {
  const state = reducer(INITIAL_STATE, Actions.photoUpdateFailure({ error: 'Not found' }));

  expect(state.updating).toBe(false);
  expect(state.errorUpdating).toEqual({ error: 'Not found' });
  expect(state.photo).toEqual(INITIAL_STATE.photo);
});
test('failure deleting a photo', () => {
  const state = reducer(INITIAL_STATE, Actions.photoDeleteFailure({ error: 'Not found' }));

  expect(state.deleting).toBe(false);
  expect(state.errorDeleting).toEqual({ error: 'Not found' });
  expect(state.photo).toEqual(INITIAL_STATE.photo);
});

test('resetting state for photo', () => {
  const state = reducer({ ...INITIAL_STATE, deleting: true }, Actions.photoReset());
  expect(state).toEqual(INITIAL_STATE);
});
