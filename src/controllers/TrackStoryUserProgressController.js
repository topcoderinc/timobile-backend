/**
 * Copyright (c) 2017 Zero Inc, All rights reserved.
 */


/**
 * TrackStory user progress Controller
 *
 * @author      TCSCODER
 * @version     1.0
 */

const TrackStoryUserProgressService = require('../services/TrackStoryUserProgressService');
const _ = require('lodash');

/**
 * get or create progress
 * @param req the http request
 * @param res the http response
 */
function* getOrCreate(req, res) {
  res.json(yield TrackStoryUserProgressService.getOrCreate(req.user.id, req.params.id));
}

/**
 * update progress
 * @param req the http request
 * @param res the http response
 */
function* update(req, res) {
  req.body.userId = req.user.id;
  res.json(yield TrackStoryUserProgressService.update(req.params.id, req.body));
}

/**
 * complete progress
 * @param req the http request
 * @param res the http response
 */
function* complete(req, res) {
  res.json(yield TrackStoryUserProgressService.complete(req.params.id));
}

/**
 * receive rewards
 * @param req the http request
 * @param res the http response
 */
function* receiveRewards(req, res) {
  res.json(yield TrackStoryUserProgressService.receiveRewards(req.params.id));
}

/**
 * get all progresses of current user
 * @param req the http request
 * @param res the http response
 */
function* getAll(req, res) {
  let completed = null;
  if (req.query.completed) {
    if (_.indexOf(['true', 'yes', 'y'], req.query.completed.toLowerCase()) >= 0) {
      completed = true;
    } else {
      completed = false;
    }
  }
  res.json(yield TrackStoryUserProgressService.getAll(req.user.id, completed));
}

/**
 * complete additional task
 * @param req the http request
 * @param res the http response
 */
function* completeAdditionalTask(req, res) {
  res.json(yield TrackStoryUserProgressService.completeAdditionalTask(req.params.id));
}

module.exports = {
  getOrCreate,
  update,
  complete,
  receiveRewards,
  getAll,
  completeAdditionalTask,
};
