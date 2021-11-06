import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistStore } from 'redux-persist';

import ReduxPersist from '../../config/redux-persist';
import StartupActions from '../reducers/startup.reducer';

const updateReducers = (store) => {
  const reducerVersion = ReduxPersist.reducerVersion;
  const startup = () => store.dispatch(StartupActions.startup());

  // Check to ensure latest reducer version
  AsyncStorage.getItem('reducerVersion')
    .then((localVersion) => {
      if (localVersion !== reducerVersion) {
        // Purge store
        persistStore(store, null, startup).purge();
        AsyncStorage.setItem('reducerVersion', reducerVersion);
      } else {
        persistStore(store, null, startup);
      }
    })
    .catch(() => {
      persistStore(store, null, startup);
      AsyncStorage.setItem('reducerVersion', reducerVersion);
    });
};

export default { updateReducers };
