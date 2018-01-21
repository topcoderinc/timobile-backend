/**
 * Copyright (c) 2017 Zero Inc, All rights reserved.
 */


/**
 * tag Controller
 *
 * @author      TCSCODER
 * @version     1.0
 */

const TagService = require('../services/TagService');

/**
 * create tag
 * @param req the http request
 * @param res the http response
 */
function* create(req, res) {
  res.json(yield TagService.create(req.body));
}

/**
 * update tag
 * @param req the http request
 * @param res the http response
 */
function* update(req, res) {
  res.json(yield TagService.update(req.params.id, req.body));
}

/**
 * get tag by id
 * @param req the http request
 * @param res the http response
 */
function* get(req, res) {
  res.json(yield TagService.get(req.params.id));
}

/**
 * remove tag
 * @param req the http request
 * @param res the http response
 */
function* remove(req, res) {
  res.json(yield TagService.remove(req.params.id));
}

/**
 * get all tags
 * @param req the http request
 * @param res the http response
 */
function* getAll(req, res) {
  res.json(yield TagService.getAll());
}

module.exports = {
  create,
  update,
  get,
  remove,
  getAll,
};
