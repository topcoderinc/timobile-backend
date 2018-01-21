/**
 * Copyright (c) 2017 Zero Inc, All rights reserved.
 */


/**
 * Racetrack Controller
 *
 * @author      TCSCODER
 * @version     1.0
 */

const RaceTrackService = require('../services/RacetrackService');

/**
 * create racetrack
 * @param req the http request
 * @param res the http response
 */
function* create(req, res) {
  res.json(yield RaceTrackService.create(req.body));
}

/**
 * update racetrack
 * @param req the http request
 * @param res the http response
 */
function* update(req, res) {
  res.json(yield RaceTrackService.update(req.params.id, req.body));
}

/**
 * get racetrack by id
 * @param req the http request
 * @param res the http response
 */
function* get(req, res) {
  res.json(yield RaceTrackService.get(req.params.id));
}

/**
 * remove racetrack
 * @param req the http request
 * @param res the http response
 */
function* remove(req, res) {
  res.json(yield RaceTrackService.remove(req.params.id));
}

/**
 * search racetracks
 * @param req the http request
 * @param res the http response
 */
function* search(req, res) {
  res.json(yield RaceTrackService.search(req.query));
}

module.exports = {
  create,
  update,
  get,
  remove,
  search,
};
