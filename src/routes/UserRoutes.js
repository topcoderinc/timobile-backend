/**
 * Copyright (C) 2017 TopCoder Inc., All Rights Reserved.
 */

/**
 * the User Routes
 *
 * @author      TCSCODER
 * @version     1.0
 */

const constants = require('../constants');

module.exports = {
  '/signup': {
    post: {
      controller: 'UserController',
      method: 'create',
      public: true,
    },
  },
  '/users/:id': {
    get: {
      controller: 'UserController',
      method: 'get',
      roles: [constants.UserRole.admin],
    },
    put: {
      controller: 'UserController',
      method: 'update',
    },
  },
  '/users': {
    get: {
      controller: 'UserController',
      method: 'search',
      roles: [constants.UserRole.admin],
    },
  },
  '/updatePassword': {
    put: {
      controller: 'UserController',
      method: 'updatePassword',
    },
  },
  '/verifyEmail': {
    get: {
      controller: 'UserController',
      method: 'verifyEmail',
      public: true,
    },
  },
  '/currentUser': {
    get: {
      controller: 'UserController',
      method: 'getCurrent',
    },
  },
  '/initiateForgotPassword': {
    post: {
      controller: 'UserController',
      method: 'initiateForgotPassword',
      public: true,
    },
  },
  '/changeForgotPassword': {
    post: {
      controller: 'UserController',
      method: 'changeForgotPassword',
      public: true,
    },
  },
  '/currentUser/statistics': {
    get: {
      controller: 'UserController',
      method: 'getStatistics',
    },
  },
};
