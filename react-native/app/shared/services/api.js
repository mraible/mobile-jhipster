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

  const getAlbum = (albumId) => api.get('api/albums/' + albumId);
  const getAllAlbums = (options) => api.get('api/albums', options);
  const createAlbum = (album) => api.post('api/albums', album);
  const updateAlbum = (album) => api.put(`api/albums/${album.id}`, album);
  const deleteAlbum = (albumId) => api.delete('api/albums/' + albumId);

  const getPhoto = (photoId) => api.get('api/photos/' + photoId);
  const getAllPhotos = (options) => api.get('api/photos', options);
  const createPhoto = (photo) => api.post('api/photos', photo);
  const updatePhoto = (photo) => api.put(`api/photos/${photo.id}`, photo);
  const deletePhoto = (photoId) => api.delete('api/photos/' + photoId);

  const getTag = (tagId) => api.get('api/tags/' + tagId);
  const getAllTags = (options) => api.get('api/tags', options);
  const createTag = (tag) => api.post('api/tags', tag);
  const updateTag = (tag) => api.put(`api/tags/${tag.id}`, tag);
  const deleteTag = (tagId) => api.delete('api/tags/' + tagId);
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

    createAlbum,
    updateAlbum,
    getAllAlbums,
    getAlbum,
    deleteAlbum,

    createPhoto,
    updatePhoto,
    getAllPhotos,
    getPhoto,
    deletePhoto,

    createTag,
    updateTag,
    getAllTags,
    getTag,
    deleteTag,
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
