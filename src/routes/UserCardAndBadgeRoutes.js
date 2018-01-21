/**
 * Copyright (C) 2017 TopCoder Inc., All Rights Reserved.
 */

/**
 * the UserCardAndBadge Routes
 *
 * @author      TCSCODER
 * @version     1.0
 */

const constants = require('../constants');

module.exports = {
  '/cards/:id/purchase': {
    post: {
      controller: 'UserCardAndBadgeController',
      method: 'purchase',
      roles: [constants.UserRole.user],
    },
  },
  '/currentUser/userCards': {
    get: {
      controller: 'UserCardAndBadgeController',
      method: 'getAllUserCards',
    },
  },
  '/currentUser/userBadges': {
    get: {
      controller: 'UserCardAndBadgeController',
      method: 'getAllUserBadges',
    },
  },
};
