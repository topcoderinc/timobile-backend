/**
 * Copyright (c) 2017 Zero Inc, All rights reserved.
 */


/**
 * comment Controller
 *
 * @author      TCSCODER
 * @version     1.0
 */

const CommentService = require('../services/CommentService');

/**
 * create comment
 * @param req the http request
 * @param res the http response
 */
function* create(req, res) {
  req.body.userId = req.user.id;
  res.json(yield CommentService.create(req.body));
}

/**
 * update comment
 * @param req the http request
 * @param res the http response
 */
function* update(req, res) {
  req.body.userId = req.user.id;
  res.json(yield CommentService.update(req.params.id, req.body));
}

/**
 * get comment by id
 * @param req the http request
 * @param res the http response
 */
function* get(req, res) {
  res.json(yield CommentService.get(req.params.id));
}

/**
 * remove comment
 * @param req the http request
 * @param res the http response
 */
function* remove(req, res) {
  res.json(yield CommentService.remove(req.params.id));
}

/**
 * search comments
 * @param req the http request
 * @param res the http response
 */
function* search(req, res) {
  res.json(yield CommentService.search(req.query));
}

/**
 * count comments by filter
 * @param req the http request
 * @param res the http response
 */
function* countByFilter(req, res) {
  res.json({ count: yield CommentService.countByFilter(req.query) });
}

module.exports = {
  create,
  update,
  get,
  remove,
  search,
  countByFilter,
};
