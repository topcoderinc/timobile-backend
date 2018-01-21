/**
 * Copyright (C) 2017 TopCoder Inc., All Rights Reserved.
 */

/**
 * the achievement service
 *
 * @author      TCSCODER
 * @version     1.0
 */
const models = require('../models');
const joi = require('joi');
const co = require('co');
const errors = require('common-errors');
const _ = require('lodash');
const helper = require('../common/helper');

const entitySchema = joi.object().keys({
  name: joi.string().required(),
  description: joi.string().required(),
  imageURL: joi.string().required(),
  achievementRule: joi.object().keys({
    id: joi.optionalId(),
    achievementId: joi.optionalId(),
    model: joi.string().required(),
    whereClause: joi.string(),
    countNumber: joi.number().integer().min(0).required(),
  }).required(),
}).required();

/**
 * create achievement
 * @param entity the entity
 * @return created entity
 */
function* create(entity) {
  let theAchievementId;
  yield models.sequelize.transaction(t => co(function* () {
    const achievement = yield models.Achievement.create(entity, { transaction: t });
    theAchievementId = achievement.id;
    entity.achievementRule.achievementId = achievement.id;
    achievement.achievementRuleId = (yield helper.createOrUpdate(models.AchievementRule, entity.achievementRule, t)).id;
    yield achievement.save({ transaction: t });
  }));
  return yield get(theAchievementId);
}

create.schema = {
  entity: entitySchema,
};

/**
 * update achievement
 * @param id the id that need update
 * @param entity the entity
 */
function* update(id, entity) {
  yield models.sequelize.transaction(t => co(function* () {
    const achievement = yield helper.ensureExists(models.Achievement, { id });
    entity.achievementRule.achievementId = id;
    entity.achievementRuleId = (yield helper.createOrUpdate(models.AchievementRule, entity.achievementRule, t)).id;
    _.assignIn(achievement, entity);
    yield achievement.save({ transaction: t });
  }));
  return yield get(id);
}

update.schema = {
  id: joi.id(),
  entity: entitySchema,
};

/**
 * remove achievement
 * @param id entity id
 */
function* remove(id) {
  return yield models.sequelize.transaction(t => co(function* () {
    const e = yield helper.ensureExists(models.Achievement, { id });
    yield e.destroy({ transaction: t });
    // delete rule
    yield models.AchievementRule.destroy({ where: { achievementId: id }, transaction: t });
    return { success: true };
  }));
}

remove.schema = {
  id: joi.id(),
};

/**
 * get achievement by id
 * @param id
 */
function* get(id) {
  const entity = yield models.Achievement.findOne({
    where: { id },
    include: [{
      model: models.AchievementRule,
      as: 'achievementRule',
    }],
  });
  if (!entity) {
    throw new errors.NotFoundError(`cannot find Achievement where id = ${id}`);
  }
  return entity;
}

get.schema = { id: joi.id() };

/**
 * get all achievements
 * @return all achievements
 */
function* getAll() {
  return yield models.Achievement.findAll({
    include: [{
      model: models.AchievementRule,
      as: 'achievementRule',
    }],
  });
}

module.exports = {
  create,
  update,
  remove,
  get,
  getAll,
};
