/**
 * Copyright (C) 2017 TopCoder Inc., All Rights Reserved.
 */

/**
 * the TrackStoryUserProgress schema
 *
 * @author      TCSCODER
 * @version     1.0
 */


module.exports = (sequelize, DataTypes) => sequelize.define('TrackStoryUserProgress', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  trackStoryId: { type: DataTypes.BIGINT, allowNull: false },
  userId: { type: DataTypes.BIGINT, allowNull: false },
  completed: { type: DataTypes.BOOLEAN, allowNull: false },
  cardsAndRewardsReceived: { type: DataTypes.BOOLEAN, allowNull: false },
  additionalTaskCompleted: { type: DataTypes.BOOLEAN, allowNull: false },
}, { timestamps: false });
