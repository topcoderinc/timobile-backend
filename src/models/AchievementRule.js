/**
 * Copyright (C) 2017 TopCoder Inc., All Rights Reserved.
 */

/**
 * the AchievementRule schema
 *
 * @author      TCSCODER
 * @version     1.0
 */


module.exports = (sequelize, DataTypes) => sequelize.define('AchievementRule', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  achievementId: { type: DataTypes.BIGINT, allowNull: false },
  model: { type: DataTypes.STRING, allowNull: false },
  // JSON string of where clause, userId filter will be added to it
  whereClause: DataTypes.STRING,
  countNumber: { type: DataTypes.INTEGER, allowNull: false },
}, { timestamps: false });
