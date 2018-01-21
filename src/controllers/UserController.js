/**
 * Copyright (c) 2017 Zero Inc, All rights reserved.
 */


/**
 * user Controller
 *
 * @author      TCSCODER
 * @version     1.0
 */

const UserService = require('../services/UserService');
const helper = require('../common/helper');

/**
 * create user (singup)
 * @param req the http request
 * @param res the http response
 */
function* create(req, res) {
  res.json(yield UserService.create(helper.getHostWithApiVersion(req), req.body));
}

/**
 * update user info
 * @param req the http request
 * @param res the http response
 */
function* update(req, res) {
  res.json(yield UserService.update(req.user.id, req.params.id, req.body));
}

/**
 * get user by id
 * @param req the http request
 * @param res the http response
 */
function* get(req, res) {
  res.json(yield UserService.get(req.params.id));
}

/**
 * search users
 * @param req the http request
 * @param res the http response
 */
function* search(req, res) {
  res.json(yield UserService.search(req.query));
}

/**
 * update user password
 * @param req the http request
 * @param res the http response
 */
function* updatePassword(req, res) {
  res.json(yield UserService.updatePassword(req.user.id, req.body.newPassword, req.body.oldPassword));
}

/**
 * verify Email with token
 * @param req the http request
 * @param res the http response
 */
function* verifyEmail(req, res) {
  res.json(yield UserService.verifyEmail(req.query.email, req.query.verificationToken));
}


/**
 * get current user
 * @param req the http request
 * @param res the http response
 */
function* getCurrent(req, res) {
  res.json(helper.toUserObject(req.user));
}

/**
 * Initiate forgot password
 * @param req the http request
 * @param res the http response
 */
function* initiateForgotPassword(req, res) {
  res.json(yield UserService.initiateForgotPassword(req.query.email));
}

/**
 * change forgot password
 * @param req
 * @param res
 */
function* changeForgotPassword(req, res) {
  res.json(yield UserService.changeForgotPassword(
    req.body.email, req.body.forgotPasswordToken, req.body.newPassword));
}

/**
 * get user statistics
 * @param req
 * @param res
 */
function* getStatistics(req, res) {
  res.json(yield UserService.getStatistics(req.user.id));
}

module.exports = {
  verifyEmail,
  search,
  create,
  update,
  get,
  getCurrent,
  updatePassword,
  initiateForgotPassword,
  changeForgotPassword,
  getStatistics,
};
