/**
 * Copyright (C) 2017 TopCoder Inc., All Rights Reserved.
 */

/**
 * the BookmarkedRacetrack Routes
 *
 * @author      TCSCODER
 * @version     1.0
 */

const constants = require('../constants');

module.exports = {
  '/currentUser/racetrackBookmarks': {
    get: {
      controller: 'BookmarkedRacetrackController',
      method: 'getAll',
      roles: [constants.UserRole.user],
    },
  },
  '/racetracks/:id/bookmark': {
    post: {
      controller: 'BookmarkedRacetrackController',
      method: 'createBookmark',
      roles: [constants.UserRole.user],
    },
    delete: {
      controller: 'BookmarkedRacetrackController',
      method: 'removeBookmark',
      roles: [constants.UserRole.user],
    },
  },
};
