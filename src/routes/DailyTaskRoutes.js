/**
 * Copyright (C) 2017 TopCoder Inc., All Rights Reserved.
 */

/**
 * the DailyTask Routes
 *
 * @author      TCSCODER
 * @version     1.0
 */

const constants = require('../constants');

module.exports = {
  '/dailyTasks': {
    post: {
      controller: 'DailyTaskController',
      method: 'create',
      roles: [constants.UserRole.admin],
    },
    get: {
      controller: 'DailyTaskController',
      method: 'search',
    },
  },
  '/dailyTasks/:id': {
    get: {
      controller: 'DailyTaskController',
      method: 'get',
    },
    put: {
      controller: 'DailyTaskController',
      method: 'update',
      roles: [constants.UserRole.admin],
    },
    delete: {
      controller: 'DailyTaskController',
      method: 'remove',
      roles: [constants.UserRole.admin],
    },
  },
};
