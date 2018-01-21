/**
 * Copyright (C) 2017 TopCoder Inc., All Rights Reserved.
 */

/**
 * the Lookup Routes
 *
 * @author      TCSCODER
 * @version     1.0
 */

module.exports = {
  '/lookup/states': {
    get: {
      controller: 'LookupController',
      method: 'getAllStates',
    },
  },
  '/lookup/prefereceOptions': {
    get: {
      controller: 'LookupController',
      method: 'getAllPreferenceOptions',
    },
  },
};
