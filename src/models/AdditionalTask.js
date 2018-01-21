/**
 * Copyright (C) 2017 TopCoder Inc., All Rights Reserved.
 */

/**
 * the AdditionalTask schema
 *
 * @author      TCSCODER
 * @version     1.0
 */


module.exports = (sequelize, DataTypes) => sequelize.define('AdditionalTask', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  description: DataTypes.STRING,
  points: { type: DataTypes.INTEGER, allowNull: false },
  trackStoryId: { type: DataTypes.BIGINT, allowNull: false },
}, { timestamps: false });
