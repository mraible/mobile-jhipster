import { call, put, select } from 'redux-saga/effects'
import { Platform } from 'react-native'
import { authorize } from 'react-native-app-auth'
import CookieManager from 'react-native-cookies'

import LoginActions from './login.reducer'
import AccountActions from '../../shared/reducers/account.reducer'
import AppConfig from '../../config/app-config'

export const selectAuthToken = state => state.login.authToken
// attempts to login
export function* login(api) {
  // get the oauth issuer information from the backend
  const authInfo = yield call(api.getOauthInfo)
  if (authInfo.ok) {
    const { issuer } = authInfo.data
    const config = {
      issuer,
      clientId: '0oa3h35busNYg5g0C357',
      scopes: ['openid', 'profile', 'email', 'address', 'phone', 'offline_access'],
      redirectUrl: `${AppConfig.appUrlScheme}://authorize`,
    }
    if (__DEV__ && Platform.OS === 'android') {
      // this allows connections to a keycloak instance using http:// in dev
      config.dangerouslyAllowInsecureHttpRequests = true
    }
    try {
      // result includes accessToken, accessTokenExpirationDate and refreshToken
      const authorizeResult = yield authorize(config)
      const { accessToken } = authorizeResult
      yield call(api.setAuthToken, accessToken)
      yield put(LoginActions.loginSuccess(accessToken))
      yield put(AccountActions.accountRequest())
      yield put({ type: 'RELOGIN_OK' })
    } catch (error) {
      console.tron.log(error)
      yield put(LoginActions.loginFailure('Login failed'))
    }
  } else {
    yield put(LoginActions.loginFailure((authInfo.data && authInfo.data.detail) || 'Could not connect to OAuth2 Provider'))
  }
}

// attempts to logout
export function* logout(api) {
  yield CookieManager.clearAll()
  yield call(api.removeAuthToken)
  yield put(AccountActions.accountRequest())
  yield put(LoginActions.logoutSuccess())
  yield put({ type: 'RELOGIN_ABORT' })
}
// loads the login
export function* loginLoad(api) {
  const authToken = yield select(selectAuthToken)
  // only set the token if we have it
  if (authToken) {
    yield call(api.setAuthToken, authToken)
  }
  yield put(LoginActions.loginLoadSuccess())
}
