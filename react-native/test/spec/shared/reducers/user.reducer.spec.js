import Actions, { reducer, INITIAL_STATE } from '../../../../app/shared/reducers/user.reducer';

test('attempt retrieving a list of user', () => {
  const state = reducer(INITIAL_STATE, Actions.userAllRequest({ id: 1 }));

  expect(state.fetchingAll).toBe(true);
  expect(state.userList).toEqual([]);
});

test('success retrieving a list of user', () => {
  const state = reducer(INITIAL_STATE, Actions.userAllSuccess([{ id: 1 }, { id: 2 }]));

  expect(state.fetchingAll).toBe(false);
  expect(state.errorAll).toBe(null);
  expect(state.userList).toEqual([{ id: 1 }, { id: 2 }]);
});

test('failure retrieving a list of user', () => {
  const state = reducer(INITIAL_STATE, Actions.userAllFailure({ error: 'Not found' }));

  expect(state.fetchingAll).toBe(false);
  expect(state.errorAll).toEqual({ error: 'Not found' });
  expect(state.userList).toEqual([]);
});
