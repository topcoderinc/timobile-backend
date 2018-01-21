/**
 * Copyright (C) 2017 TopCoder Inc., All Rights Reserved.
 */

/**
 * the TrackStoryUserProgress Routes
 *
 * @author      TCSCODER
 * @version     1.0
 */

const constants = require('../constants');

module.exports = {
  '/trackStories/:id/userProgress': {
    get: {
      controller: 'TrackStoryUserProgressController',
      method: 'getOrCreate',
    },
  },
  '/currentUser/trackStoryUserProgress/:id': {
    put: {
      controller: 'TrackStoryUserProgressController',
      method: 'update',
      roles: [constants.UserRole.user],
    },
  },
  '/currentUser/trackStoryUserProgress/:id/complete': {
    put: {
      controller: 'TrackStoryUserProgressController',
      method: 'complete',
      roles: [constants.UserRole.user],
    },
  },
  '/currentUser/trackStoryUserProgress/:id/receiveRewards': {
    put: {
      controller: 'TrackStoryUserProgressController',
      method: 'receiveRewards',
      roles: [constants.UserRole.user],
    },
  },
  '/currentUser/trackStoryUserProgress/:id/completeAdditionalTask': {
    put: {
      controller: 'TrackStoryUserProgressController',
      method: 'completeAdditionalTask',
      roles: [constants.UserRole.user],
    },
  },
  '/currentUser/trackStoryUserProgress': {
    get: {
      controller: 'TrackStoryUserProgressController',
      method: 'getAll',
      roles: [constants.UserRole.user],
    },
  },
};
