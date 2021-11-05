import FixtureAPI from '../../../../app/shared/services/fixture-api';
import { call, put, select } from 'redux-saga/effects';

import { login, logout, loginLoad, selectAuthToken, selectAuthInfo, selectIdToken } from '../../../../app/modules/login/login.sagas';
import LoginActions from '../../../../app/modules/login/login.reducer';
import AccountActions from '../../../../app/shared/reducers/account.reducer';

const stepper = (fn) => (mock) => fn.next(mock).value;

test('login success path', () => {
  const oauthInfo = FixtureAPI.getOauthInfo();
  const step = stepper(login(FixtureAPI, oauthInfo));
  const sampleOauthResponse = {
    accessToken: 'test-access-token',
    idToken: 'test-id-token',
    refreshToken: 'test-refresh-token',
  };
  expect(step(oauthInfo)).toEqual(select(selectAuthInfo));
  // await the response from the oauth2 issuer
  step(oauthInfo);
  expect(step(sampleOauthResponse)).toEqual(call(FixtureAPI.setAuthToken, 'test-access-token'));
  expect(step()).toEqual(put(LoginActions.loginSuccess('test-access-token', 'test-id-token')));
  // Request the account details
  expect(step()).toEqual(put(AccountActions.accountRequest()));
  // Close the relogin popup if needed
  expect(step()).toEqual(put({ type: 'RELOGIN_OK' }));
});
test('login failure path', () => {
  const response = FixtureAPI.getOauthInfo();
  const step = stepper(login(FixtureAPI));

  expect(step()).toEqual(select(selectAuthInfo));
  expect(step()).toEqual(put(LoginActions.loginFailure('Login failed, please try again')));
});
test('login load path with no token', () => {
  const step = stepper(loginLoad(FixtureAPI));
  // Attempt to select the token
  expect(step()).toEqual(select(selectAuthToken));
  // No token was found so call success
  expect(step()).toEqual(put(LoginActions.loginLoadSuccess()));
});
test('login load path with a token', () => {
  const accessToken = 'sample-access-token';
  const step = stepper(loginLoad(FixtureAPI));
  // Select the token from redux and set it
  expect(step(accessToken)).toEqual(select(selectAuthToken));
  expect(step(accessToken)).toEqual(call(FixtureAPI.setAuthToken, accessToken));
  FixtureAPI.setAuthToken(accessToken);
  // The token has been set so call success
  expect(step()).toEqual(put(LoginActions.loginLoadSuccess()));
});
test('logout success path', () => {
  const step = stepper(logout(FixtureAPI));
  expect(step()).toEqual(call(FixtureAPI.removeAuthToken));
  FixtureAPI.removeAuthToken();
  // Reset the account and logout
  expect(step()).toEqual(put(AccountActions.accountReset()));
  expect(step()).toEqual(put(AccountActions.accountRequest()));
  expect(step()).toEqual(put(LoginActions.logoutSuccess()));
  const oauthInfo = FixtureAPI.getOauthInfo();
  expect(step(oauthInfo)).toEqual(select(selectAuthInfo));
  expect(step('test-id-token')).toEqual(select(selectIdToken));
  // await the redirect from the oauth2 issuer logout endpoint
  step();
  expect(step()).toEqual(put({ type: 'RELOGIN_ABORT' }));
});
test('selects the auth token', () => {
  const state = { login: { authToken: 'hi' } };
  // Retrieve the API token
  expect(selectAuthToken(state)).toEqual('hi');
});
