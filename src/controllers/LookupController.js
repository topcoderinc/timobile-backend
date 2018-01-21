/**
 * Copyright (C) 2017 TopCoder Inc., All Rights Reserved.
 */

/**
 * the look up controller
 *
 * @author      TCSCODER
 * @version     1.0
 */

const LookupService = require('../services/LookupService');

/**
 * get all states
 * @param req the http request
 * @param res the http response
 */
function* getAllStates(req, res) {
  res.json(yield LookupService.getAllStates(req.query));
}


/**
 * get all preference options
 * @param req the http request
 * @param res the http response
 */
function* getAllPreferenceOptions(req, res) {
  res.json(yield LookupService.getAllPreferenceOptions(req.query));
}

module.exports = {
  getAllStates,
  getAllPreferenceOptions,
};
