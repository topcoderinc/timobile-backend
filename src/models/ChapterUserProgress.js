/**
 * Copyright (C) 2017 TopCoder Inc., All Rights Reserved.
 */

/**
 * the ChapterUserProgress schema
 *
 * @author      TCSCODER
 * @version     1.0
 */


module.exports = (sequelize, DataTypes) => sequelize.define('ChapterUserProgress', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  chapterId: { type: DataTypes.BIGINT, allowNull: false },
  trackStoryUserProgressId: { type: DataTypes.BIGINT, allowNull: false },
  wordsRead: DataTypes.INTEGER,
  completed: { type: DataTypes.BOOLEAN, allowNull: false },
}, { timestamps: false });
