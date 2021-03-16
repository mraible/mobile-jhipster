import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';

import configureStore from './create-store';
import rootSaga from '../sagas';
import ReduxPersist from '../../config/redux-persist';

/* ------------- Assemble The Reducers ------------- */
export const reducers = combineReducers({
  appState: require('./app-state.reducer').reducer,
  users: require('./user.reducer').reducer,
  points: require('../../modules/entities/points/points.reducer').reducer,
  bloodPressures: require('../../modules/entities/blood-pressure/blood-pressure.reducer').reducer,
  weights: require('../../modules/entities/weight/weight.reducer').reducer,
  preferences: require('../../modules/entities/preferences/preferences.reducer').reducer,
  // jhipster-react-native-redux-store-import-needle
  authInfo: require('./auth-info.reducer').reducer,
  account: require('./account.reducer').reducer,
  login: require('../../modules/login/login.reducer').reducer,
});

export default () => {
  let finalReducers = reducers;
  // If rehydration is on use persistReducer otherwise default combineReducers
  if (ReduxPersist.active) {
    const persistConfig = ReduxPersist.storeConfig;
    finalReducers = persistReducer(persistConfig, reducers);
  }

  let { store, sagasManager, sagaMiddleware } = configureStore(finalReducers, rootSaga);

  if (module.hot) {
    module.hot.accept(() => {
      const nextRootReducer = require('./index').reducers;
      store.replaceReducer(nextRootReducer);

      const newYieldedSagas = require('../sagas').default;
      sagasManager.cancel();
      sagasManager.done.then(() => {
        sagasManager = sagaMiddleware.run(newYieldedSagas);
      });
    });
  }

  return store;
};
