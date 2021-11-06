import Actions, { reducer, INITIAL_STATE } from '../../../../../app/modules/entities/tag/tag.reducer';

test('attempt retrieving a single tag', () => {
  const state = reducer(INITIAL_STATE, Actions.tagRequest({ id: 1 }));

  expect(state.fetchingOne).toBe(true);
  expect(state.tag).toEqual({ id: undefined });
});

test('attempt retrieving a list of tag', () => {
  const state = reducer(INITIAL_STATE, Actions.tagAllRequest({ id: 1 }));

  expect(state.fetchingAll).toBe(true);
  expect(state.tagList).toEqual([]);
});

test('attempt updating a tag', () => {
  const state = reducer(INITIAL_STATE, Actions.tagUpdateRequest({ id: 1 }));

  expect(state.updating).toBe(true);
});
test('attempt to deleting a tag', () => {
  const state = reducer(INITIAL_STATE, Actions.tagDeleteRequest({ id: 1 }));

  expect(state.deleting).toBe(true);
});

test('success retrieving a tag', () => {
  const state = reducer(INITIAL_STATE, Actions.tagSuccess({ id: 1 }));

  expect(state.fetchingOne).toBe(false);
  expect(state.errorOne).toBe(null);
  expect(state.tag).toEqual({ id: 1 });
});

test('success retrieving a list of tag', () => {
  const state = reducer(
    INITIAL_STATE,
    Actions.tagAllSuccess([{ id: 1 }, { id: 2 }], { link: '</?page=1>; rel="last",</?page=0>; rel="first"', 'x-total-count': 5 }),
  );

  expect(state.fetchingAll).toBe(false);
  expect(state.errorAll).toBe(null);
  expect(state.tagList).toEqual([{ id: 1 }, { id: 2 }]);
  expect(state.links).toEqual({ first: 0, last: 1 });
  expect(state.totalItems).toEqual(5);
});

test('success updating a tag', () => {
  const state = reducer(INITIAL_STATE, Actions.tagUpdateSuccess({ id: 1 }));

  expect(state.updating).toBe(false);
  expect(state.errorUpdating).toBe(null);
  expect(state.tag).toEqual({ id: 1 });
});
test('success deleting a tag', () => {
  const state = reducer(INITIAL_STATE, Actions.tagDeleteSuccess());

  expect(state.deleting).toBe(false);
  expect(state.errorDeleting).toBe(null);
  expect(state.tag).toEqual({ id: undefined });
});

test('failure retrieving a tag', () => {
  const state = reducer(INITIAL_STATE, Actions.tagFailure({ error: 'Not found' }));

  expect(state.fetchingOne).toBe(false);
  expect(state.errorOne).toEqual({ error: 'Not found' });
  expect(state.tag).toEqual({ id: undefined });
});

test('failure retrieving a list of tag', () => {
  const state = reducer(INITIAL_STATE, Actions.tagAllFailure({ error: 'Not found' }));

  expect(state.fetchingAll).toBe(false);
  expect(state.errorAll).toEqual({ error: 'Not found' });
  expect(state.tagList).toEqual([]);
});

test('failure updating a tag', () => {
  const state = reducer(INITIAL_STATE, Actions.tagUpdateFailure({ error: 'Not found' }));

  expect(state.updating).toBe(false);
  expect(state.errorUpdating).toEqual({ error: 'Not found' });
  expect(state.tag).toEqual(INITIAL_STATE.tag);
});
test('failure deleting a tag', () => {
  const state = reducer(INITIAL_STATE, Actions.tagDeleteFailure({ error: 'Not found' }));

  expect(state.deleting).toBe(false);
  expect(state.errorDeleting).toEqual({ error: 'Not found' });
  expect(state.tag).toEqual(INITIAL_STATE.tag);
});

test('resetting state for tag', () => {
  const state = reducer({ ...INITIAL_STATE, deleting: true }, Actions.tagReset());
  expect(state).toEqual(INITIAL_STATE);
});
