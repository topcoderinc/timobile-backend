/**
 * Copyright (C) 2017 TopCoder Inc., All Rights Reserved.
 */

/**
 * the BookmarkedRacetrack schema
 *
 * @author      TCSCODER
 * @version     1.0
 */


module.exports = (sequelize, DataTypes) => sequelize.define('BookmarkedRacetrack', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.BIGINT, allowNull: false },
}, {});
