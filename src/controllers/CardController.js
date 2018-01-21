/**
 * Copyright (c) 2017 Zero Inc, All rights reserved.
 */


/**
 * card Controller
 *
 * @author      TCSCODER
 * @version     1.0
 */

const CardService = require('../services/CardService');

/**
 * create card
 * @param req the http request
 * @param res the http response
 */
function* create(req, res) {
  res.json(yield CardService.create(req.body));
}

/**
 * update card
 * @param req the http request
 * @param res the http response
 */
function* update(req, res) {
  res.json(yield CardService.update(req.params.id, req.body));
}

/**
 * get card by id
 * @param req the http request
 * @param res the http response
 */
function* get(req, res) {
  res.json(yield CardService.get(req.params.id));
}

/**
 * remove card
 * @param req the http request
 * @param res the http response
 */
function* remove(req, res) {
  res.json(yield CardService.remove(req.params.id));
}

/**
 * search cards
 * @param req the http request
 * @param res the http response
 */
function* search(req, res) {
  res.json(yield CardService.search(req.query));
}

module.exports = {
  create,
  update,
  get,
  remove,
  search,
};
