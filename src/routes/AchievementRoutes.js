/**
 * Copyright (C) 2017 TopCoder Inc., All Rights Reserved.
 */

/**
 * the Achievement Routes
 *
 * @author      TCSCODER
 * @version     1.0
 */

const constants = require('../constants');

module.exports = {
  '/achievements': {
    post: {
      controller: 'AchievementController',
      method: 'create',
      roles: [constants.UserRole.admin],
    },
    get: {
      controller: 'AchievementController',
      method: 'getAll',
    },
  },
  '/achievements/:id': {
    get: {
      controller: 'AchievementController',
      method: 'get',
    },
    put: {
      controller: 'AchievementController',
      method: 'update',
      roles: [constants.UserRole.admin],
    },
    delete: {
      controller: 'AchievementController',
      method: 'remove',
      roles: [constants.UserRole.admin],
    },
  },
};
