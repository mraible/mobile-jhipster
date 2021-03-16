// a library to wrap and simplify api calls
import apisauce from 'apisauce';

import AppConfig from '../../config/app-config';

// our "constructor"
const create = (baseURL = AppConfig.apiUrl) => {
  // ------
  // STEP 1
  // ------
  //
  // Create and configure an apisauce-based api object.
  //
  const api = apisauce.create({
    // base URL is read from the "constructor"
    baseURL,
    // here are some default headers
    headers: {
      'Cache-Control': 'no-cache',
    },
    // 10 second timeout...
    timeout: 10000,
  });

  // ------
  // STEP 2
  // ------
  //
  // Define some functions that call the api.  The goal is to provide
  // a thin wrapper of the api layer providing nicer feeling functions
  // rather than "get", "post" and friends.
  //
  // I generally don't like wrapping the output at this level because
  // sometimes specific actions need to be take on `403` or `401`, etc.
  //
  // Since we can't hide from that, we embrace it by getting out of the
  // way at this level.
  //
  const setAuthToken = (userAuth) => api.setHeader('Authorization', 'Bearer ' + userAuth);
  const removeAuthToken = () => api.deleteHeader('Authorization');
  // use an empty Authorization header in the auth-info request to prevent an invalid token from returning 401
  const getOauthInfo = () => api.get('api/auth-info', {}, { headers: { Authorization: undefined } });
  const getOauthIssuerInfo = (issuerUrl) => api.get(`${issuerUrl}/.well-known/openid-configuration`);
  const register = (user) => api.post('api/register', user);
  const forgotPassword = (data) =>
    api.post('api/account/reset-password/init', data, {
      headers: { 'Content-Type': 'text/plain', Accept: 'application/json, text/plain, */*' },
    });

  const getAccount = () => api.get('api/account');
  const updateAccount = (account) => api.post('api/account', account);
  const changePassword = (currentPassword, newPassword) =>
    api.post(
      'api/account/change-password',
      { currentPassword, newPassword },
      { headers: { 'Content-Type': 'application/json', Accept: 'application/json, text/plain, */*' } },
    );

  const getUser = (userId) => api.get('api/users/' + userId);
  const getAllUsers = (options) => api.get('api/users', options);
  const createUser = (user) => api.post('api/users', user);
  const updateUser = (user) => api.put('api/users', user);
  const deleteUser = (userId) => api.delete('api/users/' + userId);

  const getPoints = (pointsId) => api.get('api/points/' + pointsId);
  const getAllPoints = (options) => api.get('api/points', options);
  const createPoints = (points) => api.post('api/points', points);
  const updatePoints = (points) => api.put('api/points', points);
  const deletePoints = (pointsId) => api.delete('api/points/' + pointsId);

  const getBloodPressure = (bloodPressureId) => api.get('api/blood-pressures/' + bloodPressureId);
  const getAllBloodPressures = (options) => api.get('api/blood-pressures', options);
  const createBloodPressure = (bloodPressure) => api.post('api/blood-pressures', bloodPressure);
  const updateBloodPressure = (bloodPressure) => api.put('api/blood-pressures', bloodPressure);
  const deleteBloodPressure = (bloodPressureId) => api.delete('api/blood-pressures/' + bloodPressureId);

  const getWeight = (weightId) => api.get('api/weights/' + weightId);
  const getAllWeights = (options) => api.get('api/weights', options);
  const createWeight = (weight) => api.post('api/weights', weight);
  const updateWeight = (weight) => api.put('api/weights', weight);
  const deleteWeight = (weightId) => api.delete('api/weights/' + weightId);

  const getPreferences = (preferencesId) => api.get('api/preferences/' + preferencesId);
  const getAllPreferences = (options) => api.get('api/preferences', options);
  const createPreferences = (preferences) => api.post('api/preferences', preferences);
  const updatePreferences = (preferences) => api.put('api/preferences', preferences);
  const deletePreferences = (preferencesId) => api.delete('api/preferences/' + preferencesId);
  // jhipster-react-native-api-method-needle

  // ------
  // STEP 3
  // ------
  //
  // Return back a collection of functions that we would consider our
  // interface.  Most of the time it'll be just the list of all the
  // methods in step 2.
  //
  // Notice we're not returning back the `api` created in step 1?  That's
  // because it is scoped privately.  This is one way to create truly
  // private scoped goodies in JavaScript.
  //
  return {
    // a list of the API functions from step 2
    createUser,
    updateUser,
    getAllUsers,
    getUser,
    deleteUser,

    createPoints,
    updatePoints,
    getAllPoints,
    getPoints,
    deletePoints,

    createBloodPressure,
    updateBloodPressure,
    getAllBloodPressures,
    getBloodPressure,
    deleteBloodPressure,

    createWeight,
    updateWeight,
    getAllWeights,
    getWeight,
    deleteWeight,

    createPreferences,
    updatePreferences,
    getAllPreferences,
    getPreferences,
    deletePreferences,
    // jhipster-react-native-api-export-needle
    setAuthToken,
    removeAuthToken,
    getOauthInfo,
    getOauthIssuerInfo,
    register,
    forgotPassword,
    getAccount,
    updateAccount,
    changePassword,
  };
};

// let's return back our create method as the default.
export default {
  create,
};
