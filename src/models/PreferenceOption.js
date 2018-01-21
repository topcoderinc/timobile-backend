/**
 * Copyright (C) 2017 TopCoder Inc., All Rights Reserved.
 */

/**
 * the PreferenceOption schema
 *
 * @author      TCSCODER
 * @version     1.0
 */


module.exports = (sequelize, DataTypes) => sequelize.define('PreferenceOption', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  value: { type: DataTypes.STRING, allowNull: false },
  default: { type: DataTypes.BOOLEAN, allowNull: false },
}, { timestamps: false });
