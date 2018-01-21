/**
 * Copyright (C) 2017 TopCoder Inc., All Rights Reserved.
 */

/**
 * the DailyTask schema
 *
 * @author      TCSCODER
 * @version     1.0
 */


module.exports = (sequelize, DataTypes) => sequelize.define('DailyTask', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  description: DataTypes.STRING,
  points: { type: DataTypes.INTEGER, allowNull: false },
  date: DataTypes.DATEONLY,
  partnerLink: DataTypes.STRING,
  active: { type: DataTypes.BOOLEAN, allowNull: false },
}, { timestamps: false });
