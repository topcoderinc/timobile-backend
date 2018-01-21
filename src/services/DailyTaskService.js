/**
 * Copyright (C) 2017 TopCoder Inc., All Rights Reserved.
 */

/**
 * the daily task service
 *
 * @author      TCSCODER
 * @version     1.0
 */
const models = require('../models');
const joi = require('joi');
const _ = require('lodash');
const helper = require('../common/helper');


const entitySchema = joi.object().keys({
  name: joi.string().required(),
  description: joi.string(),
  points: joi.number().integer().min(0).required(),
  date: joi.date(),
  partnerLink: joi.string(),
  active: joi.boolean().required(),
}).required();

/**
 * create daily task
 * @param entity the entity
 * @return created entity
 */
function* create(entity) {
  return yield models.DailyTask.create(entity);
}

create.schema = {
  entity: entitySchema,
};

/**
 * update daily task
 * @param id the id that need update
 * @param entity the entity
 */
function* update(id, entity) {
  const e = yield helper.ensureExists(models.DailyTask, { id });
  _.assignIn(e, entity);
  return yield e.save();
}

update.schema = {
  id: joi.id(),
  entity: entitySchema,
};

/**
 * remove daily task
 * @param id entity id
 */
function* remove(id) {
  const e = yield helper.ensureExists(models.DailyTask, { id });
  yield e.destroy();
  return { success: true };
}

remove.schema = {
  id: joi.id(),
};

/**
 * get daily task by id
 * @param id
 */
function* get(id) {
  return yield helper.ensureExists(models.DailyTask, { id });
}

get.schema = { id: joi.id() };

/**
 * build db search query
 * @param filter the search filter
 */
function* buildDBFilter(filter) {
  const where = {};
  if (filter.name) where.name = { $like: `%${filter.name}%` };
  if (filter.startingDate) where.date = { $gte: new Date(filter.startingDate) };
  if (filter.endingDate) {
    if (!where.date) where.date = {};
    where.date.$lte = new Date(filter.endingDate);
  }
  return {
    where,
    offset: filter.offset,
    limit: filter.limit,
    order: [[filter.sortColumn, filter.sortOrder.toUpperCase()]],
  };
}

/**
 * search daily tasks
 * @param filter the query filter
 * @return search result
 */
function* search(filter) {
  const query = yield buildDBFilter(filter);
  const docs = yield models.DailyTask.findAndCountAll(query);
  return {
    items: docs.rows,
    total: docs.count,
    offset: filter.offset,
    limit: filter.limit,
  };
}

search.schema = {
  filter: joi.object().keys({
    name: joi.string(),
    startingDate: joi.date(),
    endingDate: joi.date(),
    offset: joi.offset(),
    limit: joi.limit(),
    sortColumn: joi.string().valid('id', 'name', 'description', 'points', 'date', 'partnerLink', 'active').default('id'),
    sortOrder: joi.sortOrder(),
  }),
};

module.exports = {
  create,
  update,
  remove,
  get,
  search,
};
