/**
 * Copyright (c) 2017 Zero Inc, All rights reserved.
 */


/**
 * achievement Controller
 *
 * @author      TCSCODER
 * @version     1.0
 */

const AchievementService = require('../services/AchievementService');

/**
 * create achievement
 * @param req the http request
 * @param res the http response
 */
function* create(req, res) {
  res.json(yield AchievementService.create(req.body));
}

/**
 * update achievement
 * @param req the http request
 * @param res the http response
 */
function* update(req, res) {
  res.json(yield AchievementService.update(req.params.id, req.body));
}

/**
 * get achievement by id
 * @param req the http request
 * @param res the http response
 */
function* get(req, res) {
  res.json(yield AchievementService.get(req.params.id));
}

/**
 * remove achievement
 * @param req the http request
 * @param res the http response
 */
function* remove(req, res) {
  res.json(yield AchievementService.remove(req.params.id));
}

/**
 * get all achievements
 * @param req the http request
 * @param res the http response
 */
function* getAll(req, res) {
  res.json(yield AchievementService.getAll());
}

module.exports = {
  create,
  update,
  get,
  remove,
  getAll,
};
