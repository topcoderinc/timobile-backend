/**
 * Copyright (C) 2017 TopCoder Inc., All Rights Reserved.
 */

/**
 * the UserDailyTask schema
 *
 * @author      TCSCODER
 * @version     1.0
 */


module.exports = (sequelize, DataTypes) => sequelize.define('UserDailyTask', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.BIGINT, allowNull: false },
  completed: { type: DataTypes.BOOLEAN, allowNull: false },
}, {});
