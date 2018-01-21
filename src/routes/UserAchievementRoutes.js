/**
 * Copyright (C) 2017 TopCoder Inc., All Rights Reserved.
 */

/**
 * the UserAchievement Routes
 *
 * @author      TCSCODER
 * @version     1.0
 */

const constants = require('../constants');

module.exports = {
  '/currentUser/achievements/checkForNew': {
    post: {
      controller: 'UserAchievementController',
      method: 'checkForNew',
      roles: [constants.UserRole.user],
    },
  },
  '/currentUser/achievements': {
    get: {
      controller: 'UserAchievementController',
      method: 'getAll',
    },
  },
};
