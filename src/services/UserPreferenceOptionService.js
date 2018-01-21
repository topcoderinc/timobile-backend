/**
 * Copyright (C) 2017 TopCoder Inc., All Rights Reserved.
 */

/**
 * the user preference option service
 *
 * @author      TCSCODER
 * @version     1.0
 */
const models = require('../models');
const joi = require('joi');
const co = require('co');
const _ = require('lodash');
const helper = require('../common/helper');

/**
 * update user preference option
 * @param id the id that need update
 * @param entity the entity
 */
function* update(id, entity) {
  const e = yield helper.ensureExists(models.UserPreferenceOption, { id });
  yield helper.ensureExists(models.PreferenceOption, { id: entity.preferenceOptionId });
  _.assignIn(e, entity);
  return yield e.save();
}

update.schema = {
  id: joi.id(),
  entity: joi.object().keys({
    userId: joi.id(),
    preferenceOptionId: joi.id(),
    selected: joi.boolean().required(),
  }).required(),
};

/**
 * get all user preference options of the user
 * @param userId the user id
 */
function* getAll(userId) {
  return yield models.sequelize.transaction(t => co(function* () {
    const userOptions = yield models.UserPreferenceOption.findAll({
      where: { userId },
      include: [{
        model: models.PreferenceOption,
        as: 'preferenceOption',
      }],
    });
    const options = yield models.PreferenceOption.findAll();
    // for each option, if there is no user preference, create a new one
    for (let i = 0; i < options.length; i += 1) {
      if (!_.find(userOptions, uo => uo.preferenceOptionId === options[i].id)) {
        const userOption = (yield models.UserPreferenceOption.create({
          userId,
          preferenceOptionId: options[i].id,
          selected: false,
        }, { transaction: t })).toJSON();
        userOption.preferenceOption = options[i];
        userOptions.push(userOption);
      }
    }
    return userOptions;
  }));
}

getAll.schema = { userId: joi.id() };

module.exports = {
  update,
  getAll,
};
