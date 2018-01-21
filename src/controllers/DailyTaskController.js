/**
 * Copyright (c) 2017 Zero Inc, All rights reserved.
 */


/**
 * daily task controller
 *
 * @author      TCSCODER
 * @version     1.0
 */

const DailyTaskService = require('../services/DailyTaskService');

/**
 * create daily task
 * @param req the http request
 * @param res the http response
 */
function* create(req, res) {
  res.json(yield DailyTaskService.create(req.body));
}

/**
 * update daily task
 * @param req the http request
 * @param res the http response
 */
function* update(req, res) {
  res.json(yield DailyTaskService.update(req.params.id, req.body));
}

/**
 * get daily task by id
 * @param req the http request
 * @param res the http response
 */
function* get(req, res) {
  res.json(yield DailyTaskService.get(req.params.id));
}

/**
 * remove daily task
 * @param req the http request
 * @param res the http response
 */
function* remove(req, res) {
  res.json(yield DailyTaskService.remove(req.params.id));
}

/**
 * search daily tasks
 * @param req the http request
 * @param res the http response
 */
function* search(req, res) {
  res.json(yield DailyTaskService.search(req.query));
}

module.exports = {
  create,
  update,
  get,
  remove,
  search,
};
