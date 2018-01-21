/**
 * Copyright (C) 2017 TopCoder Inc., All Rights Reserved.
 */

/**
 * the Racetrack schema
 *
 * @author      TCSCODER
 * @version     1.0
 */


module.exports = (sequelize, DataTypes) => sequelize.define('Racetrack', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  locality: { type: DataTypes.STRING, allowNull: false },
  street: DataTypes.STRING,
  locationLat: { type: DataTypes.FLOAT, allowNull: false },
  locationLng: { type: DataTypes.FLOAT, allowNull: false },
}, { timestamps: false });
