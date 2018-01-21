/**
 * Copyright (c) 2017 Zero Inc, All rights reserved.
 */


/**
 * tag Controller
 *
 * @author      TCSCODER
 * @version     1.0
 */

const BookmarkedRacetrackService = require('../services/BookmarkedRacetrackService');

/**
 * create bookmark
 * @param req the http request
 * @param res the http response
 */
function* createBookmark(req, res) {
  res.json(yield BookmarkedRacetrackService.createBookmark(req.user.id, req.params.id));
}

/**
 * remove bookmark
 * @param req the http request
 * @param res the http response
 */
function* removeBookmark(req, res) {
  res.json(yield BookmarkedRacetrackService.removeBookmark(req.user.id, req.params.id));
}

/**
 * get all bookmarks
 * @param req the http request
 * @param res the http response
 */
function* getAll(req, res) {
  res.json(yield BookmarkedRacetrackService.getAll(req.user.id));
}

module.exports = {
  createBookmark,
  removeBookmark,
  getAll,
};
