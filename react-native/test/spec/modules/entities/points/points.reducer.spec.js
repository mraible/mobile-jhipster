import Actions, { reducer, INITIAL_STATE } from '../../../../../app/modules/entities/points/points.reducer';

test('attempt retrieving a single points', () => {
  const state = reducer(INITIAL_STATE, Actions.pointsRequest({ id: 1 }));

  expect(state.fetchingOne).toBe(true);
  expect(state.points).toEqual({ id: undefined });
});

test('attempt retrieving a list of points', () => {
  const state = reducer(INITIAL_STATE, Actions.pointsAllRequest({ id: 1 }));

  expect(state.fetchingAll).toBe(true);
  expect(state.pointsList).toEqual([]);
});

test('attempt updating a points', () => {
  const state = reducer(INITIAL_STATE, Actions.pointsUpdateRequest({ id: 1 }));

  expect(state.updating).toBe(true);
});
test('attempt to deleting a points', () => {
  const state = reducer(INITIAL_STATE, Actions.pointsDeleteRequest({ id: 1 }));

  expect(state.deleting).toBe(true);
});

test('success retrieving a points', () => {
  const state = reducer(INITIAL_STATE, Actions.pointsSuccess({ id: 1 }));

  expect(state.fetchingOne).toBe(false);
  expect(state.errorOne).toBe(null);
  expect(state.points).toEqual({ id: 1 });
});

test('success retrieving a list of points', () => {
  const state = reducer(
    INITIAL_STATE,
    Actions.pointsAllSuccess([{ id: 1 }, { id: 2 }], { link: '</?page=1>; rel="last",</?page=0>; rel="first"', 'x-total-count': 5 }),
  );

  expect(state.fetchingAll).toBe(false);
  expect(state.errorAll).toBe(null);
  expect(state.pointsList).toEqual([{ id: 1 }, { id: 2 }]);
  expect(state.links).toEqual({ first: 0, last: 1 });
  expect(state.totalItems).toEqual(5);
});

test('success updating a points', () => {
  const state = reducer(INITIAL_STATE, Actions.pointsUpdateSuccess({ id: 1 }));

  expect(state.updating).toBe(false);
  expect(state.errorUpdating).toBe(null);
  expect(state.points).toEqual({ id: 1 });
});
test('success deleting a points', () => {
  const state = reducer(INITIAL_STATE, Actions.pointsDeleteSuccess());

  expect(state.deleting).toBe(false);
  expect(state.errorDeleting).toBe(null);
  expect(state.points).toEqual({ id: undefined });
});

test('failure retrieving a points', () => {
  const state = reducer(INITIAL_STATE, Actions.pointsFailure({ error: 'Not found' }));

  expect(state.fetchingOne).toBe(false);
  expect(state.errorOne).toEqual({ error: 'Not found' });
  expect(state.points).toEqual({ id: undefined });
});

test('failure retrieving a list of points', () => {
  const state = reducer(INITIAL_STATE, Actions.pointsAllFailure({ error: 'Not found' }));

  expect(state.fetchingAll).toBe(false);
  expect(state.errorAll).toEqual({ error: 'Not found' });
  expect(state.pointsList).toEqual([]);
});

test('failure updating a points', () => {
  const state = reducer(INITIAL_STATE, Actions.pointsUpdateFailure({ error: 'Not found' }));

  expect(state.updating).toBe(false);
  expect(state.errorUpdating).toEqual({ error: 'Not found' });
  expect(state.points).toEqual(INITIAL_STATE.points);
});
test('failure deleting a points', () => {
  const state = reducer(INITIAL_STATE, Actions.pointsDeleteFailure({ error: 'Not found' }));

  expect(state.deleting).toBe(false);
  expect(state.errorDeleting).toEqual({ error: 'Not found' });
  expect(state.points).toEqual(INITIAL_STATE.points);
});

test('resetting state for points', () => {
  const state = reducer({ ...INITIAL_STATE, deleting: true }, Actions.pointsReset());
  expect(state).toEqual(INITIAL_STATE);
});
