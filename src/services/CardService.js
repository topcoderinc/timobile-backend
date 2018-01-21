/**
 * Copyright (C) 2017 TopCoder Inc., All Rights Reserved.
 */

/**
 * the card service
 *
 * @author      TCSCODER
 * @version     1.0
 */
const models = require('../models');
const joi = require('joi');
const _ = require('lodash');
const helper = require('../common/helper');
const constants = require('../constants');
const errors = require('common-errors');

const entitySchema = joi.object().keys({
  name: joi.string().required(),
  description: joi.string(),
  imageURL: joi.string(),
  type: joi.string().valid(_.values(constants.CardType)).required(),
  trackStoryId: joi.optionalId(),
  pricePoints: joi.number().integer().min(0),
}).required();


/**
 * create card
 * @param entity the entity
 * @return created entity
 */
function* create(entity) {
  return yield models.Card.create(entity);
}

create.schema = {
  entity: entitySchema,
};

/**
 * update card
 * @param id the id that need update
 * @param entity the entity
 */
function* update(id, entity) {
  const e = yield helper.ensureExists(models.Card, { id });
  _.assignIn(e, entity);
  return yield e.save();
}

update.schema = {
  id: joi.id(),
  entity: entitySchema,
};

/**
 * remove card
 * @param id entity id
 */
function* remove(id) {
  const e = yield helper.ensureExists(models.Card, { id });
  yield e.destroy();
  return { success: true };
}

remove.schema = {
  id: joi.id(),
};

/**
 * get card by id
 * @param id
 */
function* get(id) {
  return yield helper.ensureExists(models.Card, { id });
}

get.schema = { id: joi.id() };

/**
 * build db search query
 * @param filter the search filter
 */
function* buildDBFilter(filter) {
  const where = {};
  if (filter.name) where.name = { $like: `%${filter.name}%` };
  if (filter.trackStoryId) where.trackStoryId = filter.trackStoryId;
  if (filter.types) {
    const ts = filter.types.split(',');
    _.each(ts, (t) => {
      if (_.indexOf(_.values(constants.CardType), t) < 0) {
        throw new errors.ArgumentError(`invalid card type: ${t}`);
      }
    });
    where.type = { $in: ts };
  }
  return {
    where,
    offset: filter.offset,
    limit: filter.limit,
    order: [[filter.sortColumn, filter.sortOrder.toUpperCase()]],
  };
}

/**
 * search cards
 * @param filter the query filter
 * @return search result
 */
function* search(filter) {
  const query = yield buildDBFilter(filter);
  const docs = yield models.Card.findAndCountAll(query);
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
    trackStoryId: joi.optionalId(),
    types: joi.string(), // comma separated types
    offset: joi.offset(),
    limit: joi.limit(),
    sortColumn: joi.string().valid('id', 'name', 'description', 'imageURL', 'type', 'trackStoryId', 'pricePoints').default('id'),
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
