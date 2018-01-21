/**
 * Copyright (C) 2017 TopCoder Inc., All Rights Reserved.
 */

/**
 * the State schema
 *
 * @author      TCSCODER
 * @version     1.0
 */


module.exports = (sequelize, DataTypes) => sequelize.define('State', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  value: { type: DataTypes.STRING, allowNull: false },
}, { timestamps: false });
