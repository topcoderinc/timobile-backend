/**
 * Copyright (c) 2017 Zero Inc, All rights reserved.
 */


/**
 * User card and badge controller
 *
 * @author      TCSCODER
 * @version     1.0
 */

const UserCardAndBadgeService = require('../services/UserCardAndBadgeService');

/**
 * purchase card
 * @param req the http request
 * @param res the http response
 */
function* purchase(req, res) {
  res.json(yield UserCardAndBadgeService.purchase(req.user.id, req.params.id));
}

/**
 * get all user cards
 * @param req the http request
 * @param res the http response
 */
function* getAllUserCards(req, res) {
  res.json(yield UserCardAndBadgeService.getAllUserCards(req.user.id));
}

/**
 * get all user badges
 * @param req the http request
 * @param res the http response
 */
function* getAllUserBadges(req, res) {
  res.json(yield UserCardAndBadgeService.getAllUserBadges(req.user.id));
}

module.exports = {
  purchase,
  getAllUserCards,
  getAllUserBadges,
};
