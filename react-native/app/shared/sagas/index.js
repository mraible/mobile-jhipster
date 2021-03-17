import { takeLatest, all } from 'redux-saga/effects';
import API from '../services/api';
import FixtureAPI from '../services/fixture-api';
import AppConfig from '../../config/app-config';

/* ------------- Types ------------- */

import { StartupTypes } from '../reducers/startup.reducer';
import { AuthInfoTypes } from '../reducers/auth-info.reducer';
import { LoginTypes } from '../../modules/login/login.reducer';
import { AccountTypes } from '../../shared/reducers/account.reducer';
import { UserTypes } from '../../shared/reducers/user.reducer';
import { PointsTypes } from '../../modules/entities/points/points.reducer';
import { BloodPressureTypes } from '../../modules/entities/blood-pressure/blood-pressure.reducer';
import { WeightTypes } from '../../modules/entities/weight/weight.reducer';
import { PreferencesTypes } from '../../modules/entities/preferences/preferences.reducer';
// jhipster-react-native-saga-redux-import-needle

/* ------------- Sagas ------------- */

import { startup } from './startup.saga';
import { getAuthInfo } from './auth-info.saga';
import { login, logout, loginLoad } from '../../modules/login/login.sagas';
import { getAccount, updateAccount } from '../../shared/sagas/account.sagas';
import UserSagas from '../../shared/sagas/user.sagas';
import PointsSagas from '../../modules/entities/points/points.sagas';
import BloodPressureSagas from '../../modules/entities/blood-pressure/blood-pressure.sagas';
import WeightSagas from '../../modules/entities/weight/weight.sagas';
import PreferencesSagas from '../../modules/entities/preferences/preferences.sagas';
// jhipster-react-native-saga-method-import-needle

/* ------------- API ------------- */

// The API we use is only used from Sagas, so we create it here and pass along
// to the sagas which need it.
const api = AppConfig.useFixtures ? FixtureAPI : API.create();

/* ------------- Connect Types To Sagas ------------- */

export default function* root() {
  yield all([
    // some sagas only receive an action
    takeLatest(StartupTypes.STARTUP, startup),
    takeLatest(AuthInfoTypes.AUTH_INFO_REQUEST, getAuthInfo, api),

    // JHipster accounts
    takeLatest(LoginTypes.LOGIN_LOAD, loginLoad, api),
    takeLatest(LoginTypes.LOGIN_REQUEST, login, api),
    takeLatest(LoginTypes.LOGOUT_REQUEST, logout, api),

    takeLatest(PointsTypes.POINTS_REQUEST, PointsSagas.getPoints, api),
    takeLatest(PointsTypes.POINTS_ALL_REQUEST, PointsSagas.getAllPoints, api),
    takeLatest(PointsTypes.POINTS_UPDATE_REQUEST, PointsSagas.updatePoints, api),
    takeLatest(PointsTypes.POINTS_DELETE_REQUEST, PointsSagas.deletePoints, api),

    takeLatest(BloodPressureTypes.BLOOD_PRESSURE_REQUEST, BloodPressureSagas.getBloodPressure, api),
    takeLatest(BloodPressureTypes.BLOOD_PRESSURE_ALL_REQUEST, BloodPressureSagas.getAllBloodPressures, api),
    takeLatest(BloodPressureTypes.BLOOD_PRESSURE_UPDATE_REQUEST, BloodPressureSagas.updateBloodPressure, api),
    takeLatest(BloodPressureTypes.BLOOD_PRESSURE_DELETE_REQUEST, BloodPressureSagas.deleteBloodPressure, api),

    takeLatest(WeightTypes.WEIGHT_REQUEST, WeightSagas.getWeight, api),
    takeLatest(WeightTypes.WEIGHT_ALL_REQUEST, WeightSagas.getAllWeights, api),
    takeLatest(WeightTypes.WEIGHT_UPDATE_REQUEST, WeightSagas.updateWeight, api),
    takeLatest(WeightTypes.WEIGHT_DELETE_REQUEST, WeightSagas.deleteWeight, api),

    takeLatest(PreferencesTypes.PREFERENCES_REQUEST, PreferencesSagas.getPreferences, api),
    takeLatest(PreferencesTypes.PREFERENCES_ALL_REQUEST, PreferencesSagas.getAllPreferences, api),
    takeLatest(PreferencesTypes.PREFERENCES_UPDATE_REQUEST, PreferencesSagas.updatePreferences, api),
    takeLatest(PreferencesTypes.PREFERENCES_DELETE_REQUEST, PreferencesSagas.deletePreferences, api),
    // jhipster-react-native-saga-redux-connect-needle

    takeLatest(UserTypes.USER_ALL_REQUEST, UserSagas.getAllUsers, api),

    takeLatest(AccountTypes.ACCOUNT_REQUEST, getAccount, api),
    takeLatest(AccountTypes.ACCOUNT_UPDATE_REQUEST, updateAccount, api),
  ]);
}
