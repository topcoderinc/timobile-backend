/**
 * Copyright (C) 2017 TopCoder Inc., All Rights Reserved.
 */

/**
 * the TrackStory schema
 *
 * @author      TCSCODER
 * @version     1.0
 */


module.exports = (sequelize, DataTypes) => sequelize.define('TrackStory', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  subtitle: DataTypes.STRING,
  smallImageURL: DataTypes.STRING,
  largeImageURL: DataTypes.STRING,
}, { timestamps: false });
