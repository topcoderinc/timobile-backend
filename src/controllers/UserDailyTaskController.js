/**
 * Copyright (c) 2017 Zero Inc, All rights reserved.
 */


/**
 * user daily task controller
 *
 * @author      TCSCODER
 * @version     1.0
 */

const UserDailyTaskService = require('../services/UserDailyTaskService');

/**
 * complete user daily task
 * @param req the http request
 * @param res the http response
 */
function* complete(req, res) {
  res.json(yield UserDailyTaskService.complete(req.params.id, req.user.id));
}

/**
 * get all user daily tasks
 * @param req the http request
 * @param res the http response
 */
function* getAll(req, res) {
  res.json(yield UserDailyTaskService.getAll(req.user.id));
}

module.exports = {
  complete,
  getAll,
};
