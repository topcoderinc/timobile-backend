/**
 * Copyright (C) 2017 TopCoder Inc., All Rights Reserved.
 */

/**
 * the Card Routes
 *
 * @author      TCSCODER
 * @version     1.0
 */

const constants = require('../constants');

module.exports = {
  '/cards': {
    post: {
      controller: 'CardController',
      method: 'create',
      roles: [constants.UserRole.admin],
    },
    get: {
      controller: 'CardController',
      method: 'search',
    },
  },
  '/cards/:id': {
    get: {
      controller: 'CardController',
      method: 'get',
    },
    put: {
      controller: 'CardController',
      method: 'update',
      roles: [constants.UserRole.admin],
    },
    delete: {
      controller: 'CardController',
      method: 'remove',
      roles: [constants.UserRole.admin],
    },
  },
};
