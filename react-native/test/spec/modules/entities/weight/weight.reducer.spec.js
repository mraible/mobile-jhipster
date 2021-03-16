import Actions, { reducer, INITIAL_STATE } from '../../../../../app/modules/entities/weight/weight.reducer';

test('attempt retrieving a single weight', () => {
  const state = reducer(INITIAL_STATE, Actions.weightRequest({ id: 1 }));

  expect(state.fetchingOne).toBe(true);
  expect(state.weight).toEqual({ id: undefined });
});

test('attempt retrieving a list of weight', () => {
  const state = reducer(INITIAL_STATE, Actions.weightAllRequest({ id: 1 }));

  expect(state.fetchingAll).toBe(true);
  expect(state.weightList).toEqual([]);
});

test('attempt updating a weight', () => {
  const state = reducer(INITIAL_STATE, Actions.weightUpdateRequest({ id: 1 }));

  expect(state.updating).toBe(true);
});
test('attempt to deleting a weight', () => {
  const state = reducer(INITIAL_STATE, Actions.weightDeleteRequest({ id: 1 }));

  expect(state.deleting).toBe(true);
});

test('success retrieving a weight', () => {
  const state = reducer(INITIAL_STATE, Actions.weightSuccess({ id: 1 }));

  expect(state.fetchingOne).toBe(false);
  expect(state.errorOne).toBe(null);
  expect(state.weight).toEqual({ id: 1 });
});

test('success retrieving a list of weight', () => {
  const state = reducer(
    INITIAL_STATE,
    Actions.weightAllSuccess([{ id: 1 }, { id: 2 }], { link: '</?page=1>; rel="last",</?page=0>; rel="first"', 'x-total-count': 5 }),
  );

  expect(state.fetchingAll).toBe(false);
  expect(state.errorAll).toBe(null);
  expect(state.weightList).toEqual([{ id: 1 }, { id: 2 }]);
  expect(state.links).toEqual({ first: 0, last: 1 });
  expect(state.totalItems).toEqual(5);
});

test('success updating a weight', () => {
  const state = reducer(INITIAL_STATE, Actions.weightUpdateSuccess({ id: 1 }));

  expect(state.updating).toBe(false);
  expect(state.errorUpdating).toBe(null);
  expect(state.weight).toEqual({ id: 1 });
});
test('success deleting a weight', () => {
  const state = reducer(INITIAL_STATE, Actions.weightDeleteSuccess());

  expect(state.deleting).toBe(false);
  expect(state.errorDeleting).toBe(null);
  expect(state.weight).toEqual({ id: undefined });
});

test('failure retrieving a weight', () => {
  const state = reducer(INITIAL_STATE, Actions.weightFailure({ error: 'Not found' }));

  expect(state.fetchingOne).toBe(false);
  expect(state.errorOne).toEqual({ error: 'Not found' });
  expect(state.weight).toEqual({ id: undefined });
});

test('failure retrieving a list of weight', () => {
  const state = reducer(INITIAL_STATE, Actions.weightAllFailure({ error: 'Not found' }));

  expect(state.fetchingAll).toBe(false);
  expect(state.errorAll).toEqual({ error: 'Not found' });
  expect(state.weightList).toEqual([]);
});

test('failure updating a weight', () => {
  const state = reducer(INITIAL_STATE, Actions.weightUpdateFailure({ error: 'Not found' }));

  expect(state.updating).toBe(false);
  expect(state.errorUpdating).toEqual({ error: 'Not found' });
  expect(state.weight).toEqual(INITIAL_STATE.weight);
});
test('failure deleting a weight', () => {
  const state = reducer(INITIAL_STATE, Actions.weightDeleteFailure({ error: 'Not found' }));

  expect(state.deleting).toBe(false);
  expect(state.errorDeleting).toEqual({ error: 'Not found' });
  expect(state.weight).toEqual(INITIAL_STATE.weight);
});

test('resetting state for weight', () => {
  const state = reducer({ ...INITIAL_STATE, deleting: true }, Actions.weightReset());
  expect(state).toEqual(INITIAL_STATE);
});
