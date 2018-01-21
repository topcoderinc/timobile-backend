/**
 * Copyright (C) 2017 TopCoder Inc., All Rights Reserved.
 */

/**
 * the Comment schema
 *
 * @author      TCSCODER
 * @version     1.0
 */
const constants = require('../constants');
const _ = require('lodash');

module.exports = (sequelize, DataTypes) => sequelize.define('Comment', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  text: { type: DataTypes.STRING, allowNull: false },
  chapterId: DataTypes.BIGINT,
  trackStoryId: DataTypes.BIGINT,
  type: { type: DataTypes.ENUM, values: _.values(constants.CommentType), allowNull: false },
}, {});
