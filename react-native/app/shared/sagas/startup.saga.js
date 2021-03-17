import { put } from 'redux-saga/effects';
import AppStateActions from '../reducers/app-state.reducer';
import LoginActions from '../../modules/login/login.reducer';
import AccountActions from '../reducers/account.reducer';
import AuthInfoActions from '../reducers/auth-info.reducer';

// process STARTUP actions
export function* startup(action) {
  yield put(LoginActions.loginLoad());
  yield put(AccountActions.accountRequest());
  yield put(AppStateActions.setRehydrationComplete());
  yield put(AuthInfoActions.authInfoRequest());
}
