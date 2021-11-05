import { createStore, applyMiddleware, compose as composeWithoutDevTools } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { composeWithDevTools } from 'redux-devtools-extension';

import AppConfig from '../../config/app-config';
import RehydrationServices from '../services/rehydration.service';
import ReduxPersist from '../../config/redux-persist';
const compose = AppConfig.debugMode ? composeWithDevTools : composeWithoutDevTools;
// creates the store
export default (rootReducer, rootSaga) => {
  /* ------------- Redux Configuration ------------- */

  const middleware = [];
  const enhancers = [];

  /* ------------- Saga Middleware ------------- */

  const sagaMonitor = null;
  const sagaMiddleware = createSagaMiddleware({ sagaMonitor });
  middleware.push(sagaMiddleware);

  /* ------------- Assemble Middleware ------------- */

  enhancers.push(applyMiddleware(...middleware));

  const store = createStore(rootReducer, compose(...enhancers));

  // configure persistStore and check reducer version number
  if (ReduxPersist.active) {
    RehydrationServices.updateReducers(store);
  }

  // kick off root saga
  let sagasManager = sagaMiddleware.run(rootSaga);

  return {
    store,
    sagasManager,
    sagaMiddleware,
  };
};
