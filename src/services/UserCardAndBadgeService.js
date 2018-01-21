/**
 * Copyright (C) 2017 TopCoder Inc., All Rights Reserved.
 */

/**
 * the user card and badge service
 *
 * @author      TCSCODER
 * @version     1.0
 */
const models = require('../models');
const joi = require('joi');
const co = require('co');
const errors = require('common-errors');
const helper = require('../common/helper');

/**
 * purchase card
 * @param entity the entity
 * @return created entity
 */
function* purchase(userId, cardId) {
  return yield models.sequelize.transaction(t => co(function* () {
    const user = yield helper.ensureExists(models.User, { id: userId });
    const card = yield helper.ensureExists(models.Card, { id: cardId });
    if (user.pointsAmount < card.pricePoints) {
      throw new errors.ValidationError('not enough points');
    }
    user.pointsAmount -= card.pricePoints;
    yield user.save({ transaction: t });
    return yield models.UserCard.create({ userId, cardId }, { transaction: t });
  }));
}

purchase.schema = {
  userId: joi.id(),
  cardId: joi.id(),
};

/**
 * get all user cards
 * @param userId user id
 */
function* getAllUserCards(userId) {
  return yield models.UserCard.findAll({
    where: { userId },
    include: [{
      model: models.Card,
      as: 'card',
    }],
  });
}

getAllUserCards.schema = {
  userId: joi.id(),
};

/**
 * get all user badges
 * @param userId user id
 */
function* getAllUserBadges(userId) {
  return yield models.UserBadge.findAll({
    where: { userId },
    include: [{
      model: models.Badge,
      as: 'badge',
    }],
  });
}

getAllUserBadges.schema = {
  userId: joi.id(),
};

module.exports = {
  purchase,
  getAllUserCards,
  getAllUserBadges,
};
