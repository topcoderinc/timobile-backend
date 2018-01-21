/**
 * Copyright (C) 2017 TopCoder Inc., All Rights Reserved.
 */

/**
 * the User schema
 *
 * @author      TCSCODER
 * @version     1.0
 */
const constants = require('../constants');
const _ = require('lodash');

module.exports = (sequelize, DataTypes) => sequelize.define('User', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  firstName: { type: DataTypes.STRING, allowNull: true },
  lastName: { type: DataTypes.STRING, allowNull: true },
  email: { type: DataTypes.STRING, allowNull: true, unique: true },
  profilePhotoURL: DataTypes.STRING,
  passwordHash: { type: DataTypes.STRING, allowNull: true },
  accessToken: DataTypes.STRING,
  accessTokenValidUntil: DataTypes.DATE,
  forgotPasswordToken: DataTypes.STRING,
  forgotPasswordTokenValidUntil: DataTypes.DATE,
  verificationToken: DataTypes.STRING,
  verificationTokenValidUntil: DataTypes.DATE,
  facebookId: DataTypes.STRING,
  facebookToken: DataTypes.STRING,
  verified: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  role: { type: DataTypes.ENUM, values: _.values(constants.UserRole), allowNull: false, defaultValue: constants.UserRole.user },
  pointsAmount: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
}, {});
