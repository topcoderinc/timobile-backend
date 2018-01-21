/**
 * Copyright (C) 2017 TopCoder Inc., All Rights Reserved.
 */

/**
 * the user achievement service
 *
 * @author      TCSCODER
 * @version     1.0
 */
const models = require('../models');
const joi = require('joi');
const co = require('co');
const _ = require('lodash');
const AchievementService = require('./AchievementService');

/**
 * check for new achievements
 * @param userId the user id
 */
function* checkForNew(userId) {
  return yield models.sequelize.transaction(t => co(function* () {
    const achievements = yield AchievementService.getAll();
    const userAchievements = yield models.UserAchievement.findAll({ where: { userId } });
    const result = [];
    for (let i = 0; i < achievements.length; i += 1) {
      if (!_.find(userAchievements, ua => ua.achievementId === achievements[i].id)) {
        // this achievement is not achieved yet by user, check whether user now has achieved it or not
        const Model = models[achievements[i].achievementRule.model];
        let where = {};
        if (achievements[i].achievementRule.whereClause
          && achievements[i].achievementRule.whereClause.length > 0) {
          where = JSON.parse(achievements[i].achievementRule.whereClause);
        }
        where.userId = userId;
        const count = yield Model.count({ where });
        if (count >= achievements[i].achievementRule.countNumber) {
          // now, user achieves a new achievement
          const newUA = yield models.UserAchievement.create({
            userId,
            achievementId: achievements[i].id,
          }, { transaction: t });
          const newUAObj = newUA.toJSON();
          newUAObj.achievement = achievements[i];
          result.push(newUAObj);
        }
      }
    }
    return result;
  }));
}

checkForNew.schema = {
  userId: joi.id(),
};

/**
 * get all user achievements
 * @param userId the user id
 */
function* getAll(userId) {
  return models.UserAchievement.findAll({
    where: { userId },
    include: [{
      model: models.Achievement,
      as: 'achievement',
    }],
  });
}

getAll.schema = { userId: joi.id() };

module.exports = {
  checkForNew,
  getAll,
};
