/**
 * Copyright (c) 2017 Zero Inc, All rights reserved.
 */


/**
 * Security Controller
 *
 * @author      TCSCODER
 * @version     1.0
 */

const SecurityService = require('../services/SecurityService');

/**
 * user login
 * @param req the http request
 * @param res the http response
 */
function* login(req, res) {
  res.json(yield SecurityService.login(req.body));
}

/**
 * user logout
 * @param req
 * @param res
 */
function* logout(req, res) {
  res.json(yield SecurityService.logout(req.user.id));
}

module.exports = {
  login, logout,
};
