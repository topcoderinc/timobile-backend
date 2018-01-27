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
const errors = require('common-errors');
const httpStatus = require('http-status');

const co = require('co');

const includeOption = [{
  model: models.DailyTask,
  as: 'dailyTask',
}];
/**
 * complete user daily task
 * @param id the daily task id that need to complete
 * @param userId the user id
 */
function* complete(id, userId) {
  return yield models.sequelize.transaction(t => co(function* () {
    const userTask = yield helper.ensureExists(models.UserDailyTask, { id, userId }, includeOption);
    if (userTask.completed) {
      throw new errors.HttpStatus(httpStatus.BAD_REQUEST, 'user task already completed');
    }
    const user = yield helper.ensureExists(models.User, { id: userId });
    const task = yield helper.ensureExists(models.DailyTask, { id });
    user.pointsAmount += task.points;
    userTask.completed = true;
    yield user.save({ transaction: t });
    yield userTask.save({ transaction: t });
    return userTask;
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
    include: includeOption,
  });
}

getAll.schema = { userId: joi.id() };

module.exports = {
  complete,
  getAll,
};
