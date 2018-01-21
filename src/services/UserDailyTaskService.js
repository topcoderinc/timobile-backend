/**
 * Copyright (C) 2017 TopCoder Inc., All Rights Reserved.
 */

/**
 * the user daily task service
 *
 * @author      TCSCODER
 * @version     1.0
 */
const models = require('../models');
const joi = require('joi');
const helper = require('../common/helper');
const co = require('co');

/**
 * complete user daily task
 * @param id the daily task id that need to complete
 * @param userId the user id
 */
function* complete(id, userId) {
  return yield models.sequelize.transaction(t => co(function* () {
    const user = yield helper.ensureExists(models.User, { id: userId });
    const task = yield helper.ensureExists(models.DailyTask, { id });
    user.pointsAmount += task.points;
    yield user.save({ transaction: t });
    return yield models.UserDailyTask.create({ userId, dailyTaskId: id, completed: true }, { transaction: t });
  }));
}

complete.schema = {
  id: joi.id(),
  userId: joi.id(),
};

/**
 * get all user daily tasks
 * @param userId the user id
 */
function* getAll(userId) {
  return yield models.UserDailyTask.findAll({
    where: { userId },
    include: [{
      model: models.DailyTask,
      as: 'dailyTask',
    }],
  });
}

getAll.schema = { userId: joi.id() };

module.exports = {
  complete,
  getAll,
};
