/**
 * Copyright (C) 2017 TopCoder Inc., All Rights Reserved.
 */

/**
 * the UserDailyTask Routes
 *
 * @author      TCSCODER
 * @version     1.0
 */

const constants = require('../constants');

module.exports = {
  '/currentUser/userDailyTasks': {
    get: {
      controller: 'UserDailyTaskController',
      method: 'getAll',
    },
  },
  '/currentUser/userDailyTasks/:id/complete': {
    put: {
      controller: 'UserDailyTaskController',
      method: 'complete',
      roles: [constants.UserRole.user],
    },
  },
};
