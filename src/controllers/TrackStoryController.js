/**
 * Copyright (c) 2017 Zero Inc, All rights reserved.
 */


/**
 * track story controller
 *
 * @author      TCSCODER
 * @version     1.0
 */

const TrackStoryService = require('../services/TrackStoryService');

/**
 * create track story
 * @param req the http request
 * @param res the http response
 */
function* create(req, res) {
  res.json(yield TrackStoryService.create(req.body));
}

/**
 * update track story
 * @param req the http request
 * @param res the http response
 */
function* update(req, res) {
  res.json(yield TrackStoryService.update(req.params.id, req.body));
}

/**
 * get track story by id
 * @param req the http request
 * @param res the http response
 */
function* get(req, res) {
  res.json(yield TrackStoryService.get(req.params.id));
}

/**
 * remove track story
 * @param req the http request
 * @param res the http response
 */
function* remove(req, res) {
  res.json(yield TrackStoryService.remove(req.params.id));
}

/**
 * search track stories
 * @param req the http request
 * @param res the http response
 */
function* search(req, res) {
  res.json(yield TrackStoryService.search(req.query));
}

module.exports = {
  create,
  update,
  get,
  remove,
  search,
};
