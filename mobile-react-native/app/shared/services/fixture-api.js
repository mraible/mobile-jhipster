export default {
  // Functions return fixtures

  // entity fixtures

  updatePoint: (point) => {
    return {
      ok: true,
      data: require('../../shared/fixtures/update-point.json')
    }
  },
  getPoints: () => {
    return {
      ok: true,
      data: require('../../shared/fixtures/get-points.json')
    }
  },
  getPoint: (pointId) => {
    return {
      ok: true,
      data: require('../../shared/fixtures/get-point.json')
    }
  },
  deletePoint: (pointId) => {
    return {
      ok: true
    }
  },
  searchPoints: (query) => {
    return {
      ok: true,
      data: require('../../shared/fixtures/search-points.json')
    }
  },

  updateBloodPressure: (bloodPressure) => {
    return {
      ok: true,
      data: require('../../shared/fixtures/update-bloodpressure.json')
    }
  },
  getBloodPressures: () => {
    return {
      ok: true,
      data: require('../../shared/fixtures/get-bloodpressures.json')
    }
  },
  getBloodPressure: (bloodPressureId) => {
    return {
      ok: true,
      data: require('../../shared/fixtures/get-bloodpressure.json')
    }
  },
  deleteBloodPressure: (bloodPressureId) => {
    return {
      ok: true
    }
  },
  searchBloodPressures: (query) => {
    return {
      ok: true,
      data: require('../../shared/fixtures/search-bloodpressures.json')
    }
  },

  updateWeight: (weight) => {
    return {
      ok: true,
      data: require('../../shared/fixtures/update-weight.json')
    }
  },
  getWeights: () => {
    return {
      ok: true,
      data: require('../../shared/fixtures/get-weights.json')
    }
  },
  getWeight: (weightId) => {
    return {
      ok: true,
      data: require('../../shared/fixtures/get-weight.json')
    }
  },
  deleteWeight: (weightId) => {
    return {
      ok: true
    }
  },
  searchWeights: (query) => {
    return {
      ok: true,
      data: require('../../shared/fixtures/search-weights.json')
    }
  },

  updatePreference: (preference) => {
    return {
      ok: true,
      data: require('../../shared/fixtures/update-preference.json')
    }
  },
  getPreferences: () => {
    return {
      ok: true,
      data: require('../../shared/fixtures/get-preferences.json')
    }
  },
  getPreference: (preferenceId) => {
    return {
      ok: true,
      data: require('../../shared/fixtures/get-preference.json')
    }
  },
  deletePreference: (preferenceId) => {
    return {
      ok: true
    }
  },
  searchPreferences: (query) => {
    return {
      ok: true,
      data: require('../../shared/fixtures/search-preferences.json')
    }
  },
  // ignite-jhipster-api-fixture-needle

  // user fixtures
  updateUser: (user) => {
    return {
      ok: true,
      data: require('../fixtures/update-user.json')
    }
  },
  getUsers: () => {
    return {
      ok: true,
      data: require('../fixtures/get-users.json')
    }
  },
  getUser: (userId) => {
    return {
      ok: true,
      data: require('../fixtures/get-user.json')
    }
  },
  deleteUser: (userId) => {
    return {
      ok: true
    }
  },
  // auth fixtures
  setAuthToken: () => {

  },
  removeAuthToken: () => {

  },
  getOauthInfo: () => {
    return {
      ok: true,
      data: require('../fixtures/get-oauth-info.json')
    }
  },
  register: ({ user }) => {
    if (user === 'user') {
      return {
        ok: true
      }
    } else {
      return {
        ok: false,
        data: 'Invalid email'
      }
    }
  },
  forgotPassword: ({ email }) => {
    if (email === 'valid@gmail.com') {
      return {
        ok: true
      }
    } else {
      return {
        ok: false,
        data: 'Invalid email'
      }
    }
  },
  getAccount: () => {
    return {
      ok: true,
      status: 200,
      headers: {
        'content-type': 'application/json;charset=UTF-8'
      },
      data: require('../fixtures/get-account.json')
    }
  },
  updateAccount: () => {
    return {
      ok: true
    }
  },
  changePassword: ({ currentPassword }) => {
    if (currentPassword === 'valid-password') {
      return {
        ok: true
      }
    } else {
      return {
        ok: false,
        data: 'Password error'
      }
    }
  }
}
