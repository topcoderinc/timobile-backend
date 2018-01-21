/**
 * Copyright (C) 2017 TopCoder Inc., All Rights Reserved.
 */

/**
 * the Racetrack Routes
 *
 * @author      TCSCODER
 * @version     1.0
 */

const constants = require('../constants');

module.exports = {
  '/racetracks': {
    post: {
      controller: 'RacetrackController',
      method: 'create',
      roles: [constants.UserRole.admin],
    },
    get: {
      controller: 'RacetrackController',
      method: 'search',
    },
  },
  '/racetracks/:id': {
    get: {
      controller: 'RacetrackController',
      method: 'get',
    },
    put: {
      controller: 'RacetrackController',
      method: 'update',
      roles: [constants.UserRole.admin],
    },
    delete: {
      controller: 'RacetrackController',
      method: 'remove',
      roles: [constants.UserRole.admin],
    },
  },
};
