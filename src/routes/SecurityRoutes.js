/**
 * Copyright (C) 2017 TopCoder Inc., All Rights Reserved.
 */

/**
 * the Security Routes
 *
 * @author      TCSCODER
 * @version     1.0
 */

module.exports = {
  '/login': {
    post: {
      controller: 'SecurityController',
      method: 'login',
      public: true,
    },
  },
  '/logout': {
    post: {
      controller: 'SecurityController',
      method: 'logout',
    },
  },
};
