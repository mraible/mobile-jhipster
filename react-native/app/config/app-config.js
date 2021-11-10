import Constants from 'expo-constants';

// load extra config from the app.json file
const extra = Constants.manifest?.extra ?? {};

export default {
  // use 10.0.2.2 for Android to connect to host machine
  apiUrl: 'http://localhost:8080/',
  // leave blank if using Keycloak
  // - Dz7Oc9Zv9onjUBsdC55wReC4ifGMlA7G for Auth0
  oktaClientId: '0oa2ki7yq5UuNf1P05d7',
  // use fixtures instead of real API requests
  useFixtures: false,
  // debug mode
  debugMode: __DEV__,
  extra,
};
