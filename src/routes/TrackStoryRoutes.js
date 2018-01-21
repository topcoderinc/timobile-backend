/**
 * Copyright (C) 2017 TopCoder Inc., All Rights Reserved.
 */

/**
 * the TrackStory Routes
 *
 * @author      TCSCODER
 * @version     1.0
 */

const constants = require('../constants');

module.exports = {
  '/trackStories': {
    post: {
      controller: 'TrackStoryController',
      method: 'create',
      roles: [constants.UserRole.admin],
    },
    get: {
      controller: 'TrackStoryController',
      method: 'search',
    },
  },
  '/trackStories/:id': {
    get: {
      controller: 'TrackStoryController',
      method: 'get',
    },
    put: {
      controller: 'TrackStoryController',
      method: 'update',
      roles: [constants.UserRole.admin],
    },
    delete: {
      controller: 'TrackStoryController',
      method: 'remove',
      roles: [constants.UserRole.admin],
    },
  },
};
