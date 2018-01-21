/**
 * Copyright (c) 2017 Zero Inc, All rights reserved.
 */


/**
 * user achievement controller
 *
 * @author      TCSCODER
 * @version     1.0
 */

const UserAchievementService = require('../services/UserAchievementService');

/**
 * check for new user achievements
 * @param req the http request
 * @param res the http response
 */
function* checkForNew(req, res) {
  res.json(yield UserAchievementService.checkForNew(req.user.id));
}

/**
 * get all user achievements
 * @param req the http request
 * @param res the http response
 */
function* getAll(req, res) {
  res.json(yield UserAchievementService.getAll(req.user.id));
}

module.exports = {
  checkForNew,
  getAll,
};
