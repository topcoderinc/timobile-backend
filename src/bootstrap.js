/**
 * Copyright (C) 2017 TopCoder Inc., All Rights Reserved.
 */

/**
 * add logger and joi to services
 *
 * @author      TCSCODER
 * @version     1.0
 */

global.Promise = require('bluebird');
const fs = require('fs');
const path = require('path');
const joi = require('joi');
const logger = require('./common/logger');
const config = require('config');

joi.id = () => joi.number().integer().min(1).required();
joi.optionalId = () => joi.number().integer().min(1);
joi.offset = () => joi.number().integer().min(0).default(0);
joi.limit = () => joi.number().integer().min(1).default(config.QUERY_DEFAULT_LIMIT);
joi.sortOrder = () => joi.string().valid('asc', 'ASC', 'desc', 'DESC').default('ASC');

/**
 * add logger and joi schema to service
 * @param dir
 */
function buildServices(dir) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const curPath = path.join(dir, file);
    fs.stat(curPath, (err, stats) => {
      if (err) return;
      if (stats.isDirectory()) {
        buildServices(curPath);
      } else if (path.extname(file) === '.js') {
        logger.buildService(require(curPath)); // eslint-disable-line
      }
    });
  });
}

buildServices(path.join(__dirname, 'services'));
