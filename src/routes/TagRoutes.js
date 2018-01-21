/**
 * Copyright (C) 2017 TopCoder Inc., All Rights Reserved.
 */

/**
 * the Tag Routes
 *
 * @author      TCSCODER
 * @version     1.0
 */

const constants = require('../constants');

module.exports = {
  '/tags': {
    post: {
      controller: 'TagController',
      method: 'create',
      roles: [constants.UserRole.admin],
    },
    get: {
      controller: 'TagController',
      method: 'getAll',
    },
  },
  '/tags/:id': {
    get: {
      controller: 'TagController',
      method: 'get',
    },
    put: {
      controller: 'TagController',
      method: 'update',
      roles: [constants.UserRole.admin],
    },
    delete: {
      controller: 'TagController',
      method: 'remove',
      roles: [constants.UserRole.admin],
    },
  },
};
