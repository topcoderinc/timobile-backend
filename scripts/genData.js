/**
 * Copyright (C) 2017 TopCoder Inc., All Rights Reserved.
 */

/**
 * this script can use to make some random data
 * note: it will be drop all table and data , then create the new table
 *
 * @author      TCSCODER
 * @version     1.0
 */


const co = require('co');

require('../src/bootstrap');
const models = require('../src/models');
const logger = require('../src/common/logger');
const helper = require('../src/common/helper');

co(function* () {
  yield models.init(true);

  // create users
  const passwordHash = yield helper.hashString('password');
  yield models.User.create({
    firstName: 'first',
    lastName: 'last',
    profilePhotoURL: 'http://test.com/aaaa.jpg',
    email: 'admin@test.com',
    passwordHash,
    verified: true,
    role: 'Admin',
    pointsAmount: 1000,
  });
  yield models.User.create({
    firstName: 'first',
    lastName: 'last',
    profilePhotoURL: 'http://test.com/bbbb.jpg',
    email: 'user@test.com',
    passwordHash,
    verified: true,
    role: 'User',
    pointsAmount: 1000,
  });

  // create states
  yield models.State.create({
    value: 'state1',
  });
  yield models.State.create({
    value: 'state2',
  });

  // create preference options
  yield models.PreferenceOption.create({
    value: 'preference-option-1',
    default: true,
  });
  yield models.PreferenceOption.create({
    value: 'preference-option-2',
    default: false,
  });

  // create daily task, daily task can also be created in Postman
  yield models.DailyTask.create({
    name: 'task 1',
    description: 'desc 1',
    points: 10,
    date: new Date(),
    partnerLink: 'http://test.com',
    active: true,
  });

  // create achievement, achievement can also be created in Postman
  const achievement = yield models.Achievement.create({
    name: 'first card achievement',
    description: 'user got first card',
    imageURL: 'http://test.com/111.png',
  });
  const achievementRule = yield models.AchievementRule.create({
    achievementId: achievement.id,
    model: 'UserCard',
    whereClause: '',
    countNumber: 1,
  });
  achievement.achievementRuleId = achievementRule.id;
  yield achievement.save();

  logger.info('success!');
  process.exit(0);
}).catch((err) => {
  logger.error(err);
  logger.info('got error, program will exit');
  process.exit(1);
});
