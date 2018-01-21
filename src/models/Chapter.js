/**
 * Copyright (C) 2017 TopCoder Inc., All Rights Reserved.
 */

/**
 * the Chapter schema
 *
 * @author      TCSCODER
 * @version     1.0
 */


module.exports = (sequelize, DataTypes) => sequelize.define('Chapter', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  trackStoryId: { type: DataTypes.BIGINT, allowNull: false },
  number: { type: DataTypes.INTEGER, allowNull: false },
  title: { type: DataTypes.STRING, allowNull: false },
  subtitle: DataTypes.STRING,
  content: { type: DataTypes.STRING, allowNull: false },
  wordsCount: DataTypes.INTEGER,
}, { timestamps: false });
