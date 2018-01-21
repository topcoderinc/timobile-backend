/**
 * Copyright (C) 2017 TopCoder Inc., All Rights Reserved.
 */

/**
 * the User service
 *
 * @author      TCSCODER
 * @version     1.0
 */
const models = require('../models');
const joi = require('joi');
const util = require('util');
const errors = require('common-errors');
const _ = require('lodash');
const config = require('config');
const helper = require('../common/helper');
const UtilityService = require('./UtilityService');
const UserCardAndBadgeService = require('./UserCardAndBadgeService');
const CommentService = require('./CommentService');
const TrackStoryUserProgressService = require('./TrackStoryUserProgressService');
const constants = require('../constants');


/**
 * get user by id
 * @param id
 */
function* get(id) {
  const user = yield helper.ensureExists(models.User, { id });
  return helper.toUserObject(user);
}

get.schema = { id: joi.id() };

/**
 * create user
 * @param host the host with api version
 * @param entity the user entity
 * @return created user
 */
function* create(host, entity) {
  entity.passwordHash = yield helper.hashString(entity.password);
  delete entity.password;
  entity.role = constants.UserRole.user;
  entity.pointsAmount = 0;
  entity.verified = false;
  entity.verificationToken = helper.generateRandomString();
  entity.verificationTokenValidUntil = new Date(new Date().getTime() + (config.VERIFY_TOKEN_EXPIRES * 1000));
  const user = yield models.User.create(entity);
  yield sendVerifyEmail(entity.email, entity.verificationToken, host);
  return helper.toUserObject(user);
}

create.schema = {
  host: joi.string().required(),
  entity: joi.object().keys({
    firstName: joi.string().required(),
    lastName: joi.string().required(),
    email: joi.string().email().required(),
    profilePhotoURL: joi.string(),
    password: joi.string().required(),
  }).required(),
};


/**
 * update user
 * @param userId the current user id
 * @param id the user id that need update
 * @param entity the user entity
 */
function* update(userId, id, entity) {
  if (userId !== id) {
    throw new errors.NotPermittedError('cannot update other user info.');
  }
  const user = yield helper.ensureExists(models.User, { id });
  _.assignIn(user, entity);
  yield user.save();
  return helper.toUserObject(user);
}

update.schema = {
  userId: joi.id(),
  id: joi.id(),
  entity: joi.object().keys({
    firstName: joi.string().required(),
    lastName: joi.string().required(),
    email: joi.string().email().required(),
    profilePhotoURL: joi.string(),
  }).required(),
};

/**
 * build db search query
 * @param filter the user search filter
 */
function buildDBFilter(filter) {
  const where = {};
  if (filter.username) {
    where.$or = [
      { firstName: { $like: `%${filter.username}%` } },
      { lastName: { $like: `%${filter.username}%` } },
    ];
  }
  if (filter.email) where.email = filter.email;
  if (filter.roles) {
    const rs = filter.roles.split(',');
    _.each(rs, (r) => {
      if (_.indexOf(_.values(constants.UserRole), r) < 0) {
        throw new errors.ArgumentError(`invalid user role: ${r}`);
      }
    });
    where.role = { $in: rs };
  }
  return {
    where,
    offset: filter.offset,
    limit: filter.limit,
    order: [[filter.sortColumn, filter.sortOrder.toUpperCase()]],
  };
}

/**
 * search users
 * @param filter the user query filter
 * @return search result
 */
function* search(filter) {
  const query = buildDBFilter(filter);
  const docs = yield models.User.findAndCountAll(query);
  const items = _.map(docs.rows, doc => helper.toUserObject(doc));
  return {
    items,
    total: docs.count,
    offset: filter.offset,
    limit: filter.limit,
  };
}

search.schema = {
  filter: joi.object().keys({
    username: joi.string(),
    email: joi.string().email(),
    roles: joi.string(), // comma separated roles
    offset: joi.offset(),
    limit: joi.limit(),
    sortColumn: joi.string().valid('id', 'firstName', 'lastName', 'email', 'role').default('id'),
    sortOrder: joi.sortOrder(),
  }),
};


/**
 * update user password
 * @param id user id
 * @param newPassword
 * @param oldPassword
 */
function* updatePassword(id, newPassword, oldPassword) {
  const user = yield helper.ensureExists(models.User, { id });
  const passwordMatched = yield helper.validateHash(oldPassword, user.passwordHash);
  if (!passwordMatched) {
    throw new errors.ArgumentError('invalid old password.');
  }
  yield models.User.update({ passwordHash: (yield helper.hashString(newPassword)) }, { where: { id } });
  return { success: true };
}

updatePassword.schema = {
  id: joi.id(),
  newPassword: joi.string().required(),
  oldPassword: joi.string().required(),
};


/**
 * verify Email with token
 * @param email the email address
 * @param verificationToken the token
 */
function* verifyEmail(email, verificationToken) {
  const user = yield helper.ensureExists(models.User, { email });
  if (user.verified) {
    throw new errors.ValidationError('user already verified.');
  }
  if (verificationToken !== user.verificationToken) {
    throw new errors.ValidationError('invalid verification token.');
  }
  if (!user.verificationTokenValidUntil || user.verificationTokenValidUntil.getTime() < new Date().getTime()) {
    throw new errors.ValidationError('verification token expired.');
  }
  yield models.User.update({ verified: true, verificationToken: null }, { where: { email } });
  return { success: true };
}

verifyEmail.schema = {
  email: joi.string().email().required(),
  verificationToken: joi.string().required(),
};

/**
 * initiate forgot password
 * @param email the email address
 */
function* initiateForgotPassword(email) {
  const user = yield helper.ensureExists(models.User, { email });
  user.forgotPasswordToken = helper.generateRandomString();
  user.forgotPasswordTokenValidUntil = new Date(new Date().getTime() + (config.FORGOT_PASSWORD_TOKEN_EXPIRES * 1000));
  yield user.save();
  yield sendForgotPasswordEmail(email, user.forgotPasswordToken);
  return { success: true };
}

initiateForgotPassword.schema = {
  email: joi.string().email().required(),
};

/**
 * change forgot password
 * @param email the email address
 * @param forgotPasswordToken the token
 * @param newPassword the new password
 */
function* changeForgotPassword(email, forgotPasswordToken, newPassword) {
  const user = yield helper.ensureExists(models.User, { email });
  if (forgotPasswordToken !== user.forgotPasswordToken) {
    throw new errors.ValidationError('invalid forgot password token.');
  }
  if (!user.forgotPasswordTokenValidUntil || user.forgotPasswordTokenValidUntil.getTime() < new Date().getTime()) {
    throw new errors.ValidationError('forgot password token expired.');
  }
  yield models.User.update({
    passwordHash: (yield helper.hashString(newPassword)),
    forgotPasswordToken: null,
  }, { where: { email } });
  return { success: true };
}

changeForgotPassword.schema = {
  email: joi.string().email().required(),
  forgotPasswordToken: joi.string().required(),
  newPassword: joi.string().required(),
};


/**
 * send verification email to user
 * @param emailAddress the email address
 * @param verificationToken the verificationToken
 * @param host the host with api version
 */
function* sendVerifyEmail(emailAddress, verificationToken, host) {
  const content = util.format(config.VERIFY_EMAIL_CONTENT,
    verificationToken, `${host}/verifyEmail?email=${emailAddress}&verificationToken=${verificationToken}`);
  yield UtilityService.sendEmail({ subject: config.VERIFY_EMAIL_SUBJECT, to: emailAddress, text: content });
}

/**
 * send forgot password email to user
 * @param emailAddress the email address
 * @param forgotPasswordToken the forgot password token
 */
function* sendForgotPasswordEmail(emailAddress, forgotPasswordToken) {
  const content = util.format(config.FORGOT_PASSWORD_EMAIL_CONTENT, forgotPasswordToken);
  yield UtilityService.sendEmail({ subject: config.FORGOT_PASSWORD_EMAIL_SUBJECT, to: emailAddress, text: content });
}

/**
 * get user statistics
 * @param userId the user id
 * @returns the user statistics
 */
function* getStatistics(userId) {
  const commentsNumber = yield CommentService.countByFilter({ userId });
  const completedStoriesNumber = (yield TrackStoryUserProgressService.getAll(userId, true)).length;
  const cardsNumber = (yield UserCardAndBadgeService.getAllUserCards(userId)).length;
  const badgesNumber = (yield UserCardAndBadgeService.getAllUserBadges(userId)).length;
  return { commentsNumber, completedStoriesNumber, cardsNumber, badgesNumber };
}

getStatistics.schema = { userId: joi.id() };

/**
 * get user by access token
 * @param userId the user id
 * @returns the user statistics
 */
function* getByAccessToken(accessToken) {
  return yield models.User.findOne({ where: { accessToken, accessTokenValidUntil: { $gt: new Date() } } });
}

getByAccessToken.schema = { accessToken: joi.string().required() };


module.exports = {
  create,
  update,
  get,
  search,
  updatePassword,
  verifyEmail,
  initiateForgotPassword,
  changeForgotPassword,
  getStatistics,
  getByAccessToken,
};
