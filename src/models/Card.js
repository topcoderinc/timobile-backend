/**
 * Copyright (C) 2017 TopCoder Inc., All Rights Reserved.
 */

/**
 * the Card schema
 *
 * @author      TCSCODER
 * @version     1.0
 */
const constants = require('../constants');
const _ = require('lodash');

module.exports = (sequelize, DataTypes) => sequelize.define('Card', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  description: DataTypes.STRING,
  imageURL: DataTypes.STRING,
  type: { type: DataTypes.ENUM, values: _.values(constants.CardType), allowNull: false },
  trackStoryId: DataTypes.BIGINT,
  pricePoints: DataTypes.INTEGER,
}, { timestamps: false });
