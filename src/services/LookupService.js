/**
 * Copyright (C) 2017 TopCoder Inc., All Rights Reserved.
 */

/**
 * the look up service
 *
 * @author      TCSCODER
 * @version     1.0
 */
const joi = require('joi');
const models = require('../models');

const schema = {
  filter: joi.object().keys({
    offset: joi.offset(),
    limit: joi.limit(),
    name: joi.string(),
  }),
};

/**
 * get all states
 * @param filter the filter
 * @return states result
 */
function* getAllStates(filter) {
  let where = {};
  if (filter.name) {
    where = { value: { $like: `%${filter.name}%` } };
  }
  const docs = yield models.State.findAndCountAll({ where, offset: filter.offset, limit: filter.limit });
  return {
    items: docs.rows,
    total: docs.count,
    offset: filter.offset,
    limit: filter.limit,
  };
}

getAllStates.schema = schema;

/**
 * get all preference options
 * @param filter the filter
 * @return preference options result
 */
function* getAllPreferenceOptions(filter) {
  const docs = yield models.PreferenceOption.findAndCountAll({ offset: filter.offset, limit: filter.limit });
  return {
    items: docs.rows,
    total: docs.count,
    offset: filter.offset,
    limit: filter.limit,
  };
}

getAllPreferenceOptions.schema = schema;

module.exports = {
  getAllStates,
  getAllPreferenceOptions,
};
