export default {
  // Functions return fixtures

  // entity fixtures
  updatePoints: (points) => {
    return {
      ok: true,
      data: require('../../shared/fixtures/update-points.json'),
    };
  },
  getAllPoints: () => {
    return {
      ok: true,
      data: require('../../shared/fixtures/get-all-points.json'),
    };
  },
  getPoints: (pointsId) => {
    return {
      ok: true,
      data: require('../../shared/fixtures/get-points.json'),
    };
  },
  deletePoints: (pointsId) => {
    return {
      ok: true,
    };
  },
  updateBloodPressure: (bloodPressure) => {
    return {
      ok: true,
      data: require('../../shared/fixtures/update-blood-pressure.json'),
    };
  },
  getAllBloodPressures: () => {
    return {
      ok: true,
      data: require('../../shared/fixtures/get-all-blood-pressures.json'),
    };
  },
  getBloodPressure: (bloodPressureId) => {
    return {
      ok: true,
      data: require('../../shared/fixtures/get-blood-pressure.json'),
    };
  },
  deleteBloodPressure: (bloodPressureId) => {
    return {
      ok: true,
    };
  },
  updateWeight: (weight) => {
    return {
      ok: true,
      data: require('../../shared/fixtures/update-weight.json'),
    };
  },
  getAllWeights: () => {
    return {
      ok: true,
      data: require('../../shared/fixtures/get-all-weights.json'),
    };
  },
  getWeight: (weightId) => {
    return {
      ok: true,
      data: require('../../shared/fixtures/get-weight.json'),
    };
  },
  deleteWeight: (weightId) => {
    return {
      ok: true,
    };
  },
  updatePreferences: (preferences) => {
    return {
      ok: true,
      data: require('../../shared/fixtures/update-preferences.json'),
    };
  },
  getAllPreferences: () => {
    return {
      ok: true,
      data: require('../../shared/fixtures/get-all-preferences.json'),
    };
  },
  getPreferences: (preferencesId) => {
    return {
      ok: true,
      data: require('../../shared/fixtures/get-preferences.json'),
    };
  },
  deletePreferences: (preferencesId) => {
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
