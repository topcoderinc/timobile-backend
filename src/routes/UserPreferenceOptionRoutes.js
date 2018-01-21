/**
 * Copyright (C) 2017 TopCoder Inc., All Rights Reserved.
 */

/**
 * the UserPreferenceOption Routes
 *
 * @author      TCSCODER
 * @version     1.0
 */

const constants = require('../constants');

module.exports = {
  '/currentUser/userPreferenceOptions': {
    get: {
      controller: 'UserPreferenceOptionController',
      method: 'getAll',
    },
  },
  '/currentUser/userPreferenceOptions/:id': {
    put: {
      controller: 'UserPreferenceOptionController',
      method: 'update',
      roles: [constants.UserRole.user],
    },
  },
};
