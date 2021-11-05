export default {
  // Functions return fixtures

  // entity fixtures
  updateAlbum: (album) => {
    return {
      ok: true,
      data: require('../../shared/fixtures/update-album.json'),
    };
  },
  getAllAlbums: () => {
    return {
      ok: true,
      data: require('../../shared/fixtures/get-all-albums.json'),
    };
  },
  getAlbum: (albumId) => {
    return {
      ok: true,
      data: require('../../shared/fixtures/get-album.json'),
    };
  },
  deleteAlbum: (albumId) => {
    return {
      ok: true,
    };
  },
  updatePhoto: (photo) => {
    return {
      ok: true,
      data: require('../../shared/fixtures/update-photo.json'),
    };
  },
  getAllPhotos: () => {
    return {
      ok: true,
      data: require('../../shared/fixtures/get-all-photos.json'),
    };
  },
  getPhoto: (photoId) => {
    return {
      ok: true,
      data: require('../../shared/fixtures/get-photo.json'),
    };
  },
  deletePhoto: (photoId) => {
    return {
      ok: true,
    };
  },
  updateTag: (tag) => {
    return {
      ok: true,
      data: require('../../shared/fixtures/update-tag.json'),
    };
  },
  getAllTags: () => {
    return {
      ok: true,
      data: require('../../shared/fixtures/get-all-tags.json'),
    };
  },
  getTag: (tagId) => {
    return {
      ok: true,
      data: require('../../shared/fixtures/get-tag.json'),
    };
  },
  deleteTag: (tagId) => {
    return {
      ok: true,
    };
  },
  // jhipster-react-native-api-fixture-needle

  // user fixtures
  updateUser: (user) => {
    return {
      ok: true,
      data: require('../fixtures/update-user.json'),
    };
  },
  getAllUsers: () => {
    return {
      ok: true,
      data: require('../fixtures/get-users.json'),
    };
  },
  getUser: (userId) => {
    return {
      ok: true,
      data: require('../fixtures/get-user.json'),
    };
  },
  deleteUser: (userId) => {
    return {
      ok: true,
    };
  },
  // auth fixtures
  setAuthToken: () => {},
  removeAuthToken: () => {},
  getOauthInfo: () => {
    return {
      ok: true,
      data: require('../fixtures/get-oauth-info.json'),
    };
  },
  register: ({ user }) => {
    if (user === 'user') {
      return {
        ok: true,
      };
    } else {
      return {
        ok: false,
        data: {
          title: 'Invalid email',
        },
      };
    }
  },
  forgotPassword: ({ email }) => {
    if (email === 'valid@gmail.com') {
      return {
        ok: true,
      };
    } else {
      return {
        ok: false,
        data: 'Invalid email',
      };
    }
  },
  getAccount: () => {
    return {
      ok: true,
      status: 200,
      headers: {
        'content-type': 'application/json;charset=UTF-8',
      },
      data: require('../fixtures/get-account.json'),
    };
  },
  updateAccount: () => {
    return {
      ok: true,
    };
  },
  changePassword: ({ currentPassword }) => {
    if (currentPassword === 'valid-password') {
      return {
        ok: true,
      };
    } else {
      return {
        ok: false,
        data: 'Password error',
      };
    }
  },
};
