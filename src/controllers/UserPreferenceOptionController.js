/**
 * Copyright (c) 2017 Zero Inc, All rights reserved.
 */


/**
 * user preference option controller
 *
 * @author      TCSCODER
 * @version     1.0
 */

const UserPreferenceOptionService = require('../services/UserPreferenceOptionService');

/**
 * update user preference option
 * @param req the http request
 * @param res the http response
 */
function* update(req, res) {
  req.body.userId = req.user.id;
  res.json(yield UserPreferenceOptionService.update(req.params.id, req.body));
}

/**
 * get all user preference options
 * @param req the http request
 * @param res the http response
 */
function* getAll(req, res) {
  res.json(yield UserPreferenceOptionService.getAll(req.user.id));
}

module.exports = {
  update,
  getAll,
};
