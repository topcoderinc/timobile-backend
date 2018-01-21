/**
 * Copyright (C) 2017 TopCoder Inc., All Rights Reserved.
 */

/**
 * the security service
 *
 * @author      TCSCODER
 * @version     1.0
 */
const models = require('../models');
const joi = require('joi');
const errors = require('common-errors');
const helper = require('../common/helper');
const config = require('config');

/**
 * user login use local login method, and save token to db
 * @param entity the login entity
 * @returns {} the login result
 */
function* login(entity) {
  const user = yield models.User.findOne({ where: { email: entity.email } });
  if (!user) {
    throw new errors.NotFoundError('the user is not found.');
  }
  const matched = yield helper.validateHash(entity.password, user.passwordHash);
  if (!matched) {
    throw new errors.NotPermittedError('wrong password.');
  }
  if (!user.verified) {
    throw new errors.NotPermittedError('this email is not verified.');
  }
  return yield injectToken(user);
}

login.schema = {
  entity: joi.object().keys({
    email: joi.string().email().required(),
    password: joi.string().required(),
  }).required(),
};

/**
 * inject accessToken to user
 * @param user the db user entity
 */
function* injectToken(user) {
  user.accessToken = helper.generateRandomString();
  user.accessTokenValidUntil = new Date(new Date().getTime() + (config.ACCESS_TOKEN_EXPIRES * 1000));
  yield user.save();
  return { accessToken: user.accessToken, accessTokenValidUntil: user.accessTokenValidUntil };
}

/**
 * user logout
 * @param userId the user id
 */
function* logout(userId) {
  yield models.User.update({ accessToken: null }, { where: { id: userId } });
  return { success: true };
}

module.exports = {
  login,
  logout,
  injectToken,
};
