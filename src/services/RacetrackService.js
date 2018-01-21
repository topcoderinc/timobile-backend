/**
 * Copyright (C) 2017 TopCoder Inc., All Rights Reserved.
 */

/**
 * the racetrack service
 *
 * @author      TCSCODER
 * @version     1.0
 */
const models = require('../models');
const joi = require('joi');
const errors = require('common-errors');
const _ = require('lodash');
const helper = require('../common/helper');

const entitySchema = joi.object().keys({
  name: joi.string().required(),
  stateId: joi.id(),
  locality: joi.string().required(),
  street: joi.string(),
  locationLat: joi.number().min(-90).max(90).required(),
  locationLng: joi.number().min(-180).max(180).required(),
}).required();

/**
 * create racetrack
 * @param entity the entity
 * @return created entity
 */
function* create(entity) {
  // validate that state id exists
  yield helper.ensureExists(models.State, { id: entity.stateId });

  return yield models.Racetrack.create(entity);
}

create.schema = {
  entity: entitySchema,
};

/**
 * update racetrack
 * @param id the id that need update
 * @param entity the entity
 */
function* update(id, entity) {
  // validate that state id exists
  yield helper.ensureExists(models.State, { id: entity.stateId });

  const e = yield helper.ensureExists(models.Racetrack, { id });
  _.assignIn(e, entity);
  return yield e.save();
}

update.schema = {
  id: joi.id(),
  entity: entitySchema,
};

/**
 * remove racetrack
 * @param id entity id
 */
function* remove(id) {
  const e = yield helper.ensureExists(models.Racetrack, { id });
  yield e.destroy();
  return { success: true };
}

remove.schema = {
  id: joi.id(),
};

/**
 * get racetrack by id
 * @param id
 */
function* get(id) {
  return yield helper.ensureExists(models.Racetrack, { id });
}

get.schema = { id: joi.id() };


/**
 * search racetracks
 * @param filter the query filter
 * @return search result
 */
function* search(filter) {
  if (filter.stateIds) {
    filter.stateIds = _.map(filter.stateIds.split(','), (str) => {
      const stateId = Number(str);
      if (!_.isInteger(stateId)) {
        throw new errors.ArgumentError(`invalid state id: ${str}`);
      }
      return stateId;
    });
  }
  let select = '*';
  let havingClause = null;
  if (!_.isNil(filter.distanceToLocationMiles) && !_.isNil(filter.locationLat) && !_.isNil(filter.locationLng)) {
    select = `
      *, (
        3959 * acos (
        cos ( radians( ${filter.locationLat} ) )
        * cos( radians( locationLat ) )
        * cos( radians( locationLng ) - radians( ${filter.locationLng} ) )
        + sin ( radians( ${filter.locationLat} ) )
        * sin( radians( locationLat ) )
        )
      ) AS distance
      `;
    havingClause = ` HAVING distance <= ${filter.distanceToLocationMiles} `;
  }
  let where = null;
  if (filter.name) {
    // sanitize the name filter param to avoid SQL injection attack
    filter.name = helper.sanitize(filter.name);
    where = ` name LIKE '%${filter.name}%' `;
  }
  if (filter.stateIds) {
    if (where) {
      where = ` ${where} AND stateId IN (${filter.stateIds.join(',')}) `;
    } else {
      where = ` stateId IN (${filter.stateIds.join(',')}) `;
    }
  }
  const sqlPart = `
      SELECT ${select}
      FROM racetracks
      ${where ? 'WHERE '.concat(where) : ''}
      ${havingClause || ''}
    `;
  const sql = `
      ${sqlPart}
      ORDER BY ${filter.sortColumn} ${filter.sortOrder.toUpperCase()}
      LIMIT ${filter.offset}, ${filter.limit};
    `;
  const countSql = `SELECT COUNT(*) as totalCount FROM ( ${sqlPart} ) AS a;`;

  const items = yield models.sequelize.query(sql, { model: models.Racetrack });
  const countRes = yield models.sequelize.query(countSql, { type: models.sequelize.QueryTypes.SELECT });
  const total = (countRes && countRes.length > 0 && countRes[0].totalCount) || 0;
  return { items, total, offset: filter.offset, limit: filter.limit };
}

search.schema = {
  filter: joi.object().keys({
    name: joi.string(),
    stateIds: joi.string(), // comma separated state ids
    distanceToLocationMiles: joi.number().min(0),
    locationLat: joi.number().min(-90).max(90),
    locationLng: joi.number().min(-180).max(180),
    offset: joi.offset(),
    limit: joi.limit(),
    sortColumn: joi.string().valid('id', 'name', 'stateId', 'locality', 'street').default('id'),
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
