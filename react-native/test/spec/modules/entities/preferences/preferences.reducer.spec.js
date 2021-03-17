import Actions, { reducer, INITIAL_STATE } from '../../../../../app/modules/entities/preferences/preferences.reducer';

test('attempt retrieving a single preferences', () => {
  const state = reducer(INITIAL_STATE, Actions.preferencesRequest({ id: 1 }));

  expect(state.fetchingOne).toBe(true);
  expect(state.preferences).toEqual({ id: undefined });
});

test('attempt retrieving a list of preferences', () => {
  const state = reducer(INITIAL_STATE, Actions.preferencesAllRequest({ id: 1 }));

  expect(state.fetchingAll).toBe(true);
  expect(state.preferencesList).toEqual([]);
});

test('attempt updating a preferences', () => {
  const state = reducer(INITIAL_STATE, Actions.preferencesUpdateRequest({ id: 1 }));

  expect(state.updating).toBe(true);
});
test('attempt to deleting a preferences', () => {
  const state = reducer(INITIAL_STATE, Actions.preferencesDeleteRequest({ id: 1 }));

  expect(state.deleting).toBe(true);
});

test('success retrieving a preferences', () => {
  const state = reducer(INITIAL_STATE, Actions.preferencesSuccess({ id: 1 }));

  expect(state.fetchingOne).toBe(false);
  expect(state.errorOne).toBe(null);
  expect(state.preferences).toEqual({ id: 1 });
});

test('success retrieving a list of preferences', () => {
  const state = reducer(INITIAL_STATE, Actions.preferencesAllSuccess([{ id: 1 }, { id: 2 }]));

  expect(state.fetchingAll).toBe(false);
  expect(state.errorAll).toBe(null);
  expect(state.preferencesList).toEqual([{ id: 1 }, { id: 2 }]);
});

test('success updating a preferences', () => {
  const state = reducer(INITIAL_STATE, Actions.preferencesUpdateSuccess({ id: 1 }));

  expect(state.updating).toBe(false);
  expect(state.errorUpdating).toBe(null);
  expect(state.preferences).toEqual({ id: 1 });
});
test('success deleting a preferences', () => {
  const state = reducer(INITIAL_STATE, Actions.preferencesDeleteSuccess());

  expect(state.deleting).toBe(false);
  expect(state.errorDeleting).toBe(null);
  expect(state.preferences).toEqual({ id: undefined });
});

test('failure retrieving a preferences', () => {
  const state = reducer(INITIAL_STATE, Actions.preferencesFailure({ error: 'Not found' }));

  expect(state.fetchingOne).toBe(false);
  expect(state.errorOne).toEqual({ error: 'Not found' });
  expect(state.preferences).toEqual({ id: undefined });
});

test('failure retrieving a list of preferences', () => {
  const state = reducer(INITIAL_STATE, Actions.preferencesAllFailure({ error: 'Not found' }));

  expect(state.fetchingAll).toBe(false);
  expect(state.errorAll).toEqual({ error: 'Not found' });
  expect(state.preferencesList).toEqual([]);
});

test('failure updating a preferences', () => {
  const state = reducer(INITIAL_STATE, Actions.preferencesUpdateFailure({ error: 'Not found' }));

  expect(state.updating).toBe(false);
  expect(state.errorUpdating).toEqual({ error: 'Not found' });
  expect(state.preferences).toEqual(INITIAL_STATE.preferences);
});
test('failure deleting a preferences', () => {
  const state = reducer(INITIAL_STATE, Actions.preferencesDeleteFailure({ error: 'Not found' }));

  expect(state.deleting).toBe(false);
  expect(state.errorDeleting).toEqual({ error: 'Not found' });
  expect(state.preferences).toEqual(INITIAL_STATE.preferences);
});

test('resetting state for preferences', () => {
  const state = reducer({ ...INITIAL_STATE, deleting: true }, Actions.preferencesReset());
  expect(state).toEqual(INITIAL_STATE);
});
