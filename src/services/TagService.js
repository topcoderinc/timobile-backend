/**
 * Copyright (C) 2017 TopCoder Inc., All Rights Reserved.
 */

/**
 * the tag service
 *
 * @author      TCSCODER
 * @version     1.0
 */
const models = require('../models');
const joi = require('joi');
const _ = require('lodash');
const helper = require('../common/helper');

const entitySchema = joi.object().keys({
  value: joi.string().required(),
}).required();


/**
 * create tag
 * @param entity the entity
 * @return created entity
 */
function* create(entity) {
  return yield models.Tag.create(entity);
}

create.schema = {
  entity: entitySchema,
};

/**
 * update tag
 * @param id the id that need update
 * @param entity the entity
 */
function* update(id, entity) {
  const e = yield helper.ensureExists(models.Tag, { id });
  _.assignIn(e, entity);
  return yield e.save();
}

update.schema = {
  id: joi.id(),
  entity: entitySchema,
};

/**
 * remove tag
 * @param id entity id
 */
function* remove(id) {
  const e = yield helper.ensureExists(models.Tag, { id });
  yield e.destroy();
  return { success: true };
}

remove.schema = {
  id: joi.id(),
};

/**
 * get tag by id
 * @param id
 */
function* get(id) {
  return yield helper.ensureExists(models.Tag, { id });
}

get.schema = { id: joi.id() };

/**
 * get all tags
 * @return all tags
 */
function* getAll() {
  return yield models.Tag.findAll();
}

module.exports = {
  create,
  update,
  remove,
  get,
  getAll,
};
