/**
 * Copyright (C) 2017 TopCoder Inc., All Rights Reserved.
 */

/**
 * Contains generic helper methods
 *
 * @author      TCSCODER
 * @version     1.0
 */

const _ = require('lodash');
const co = require('co');
const config = require('config');
const bluebird = require('bluebird');
const uuid = require('uuid/v4');
const errors = require('common-errors');
const bcrypt = require('bcryptjs');
const util = require('util');

bluebird.promisifyAll(bcrypt);


/**
 * get host with api version , example like http://localhost:3000/api/v1
 * @param req the rquest
 * @returns {String} the URL prefix of host with api
 */
function getHostWithApiVersion(req) {
  return `${req.protocol}://${req.headers.host}/${config.API_VERSION}`;
}

/**
 * if entity got id, then update it by id, othewise , create new entity
 * @param model the model
 * @param entity the entity
 * @param t the transaction, optional
 * @returns created/updated object
 */
function* createOrUpdate(model, entity, t) {
  if (entity.id) {
    const options = { where: { id: entity.id } };
    if (t) {
      options.transaction = t;
    }
    yield model.update(entity, options);
    return entity;
  }
  return t ? (yield model.create(entity, { transaction: t })).toJSON() : (yield model.create(entity)).toJSON();
}

/**
 * create or update entities , same as createOrUpdate
 * @param the db model
 * @param entities
 * @param t the transaction, optional
 * @returns created/updated object ids
 */
function* createOrUpdateArrayItems(model, entities, t) {
  const results = [];
  for (let i = 0; i < entities.length; i += 1) {
    const e = yield createOrUpdate(model, entities[i], t);
    results.push(e.id);
  }
  return results;
}


/**
 * Wrap generator function to standard express function
 * @param {Function} fn the generator function
 * @returns {Function} the wrapped function
 */
function wrapExpress(fn) {
  return function (req, res, next) {
    co(fn(req, res, next)).catch(next);
  };
}

/**
 * Wrap all generators from object
 * @param obj the object (controller exports)
 * @returns {Object|Array} the wrapped object
 */
function autoWrapExpress(obj) {
  if (_.isArray(obj)) {
    return obj.map(autoWrapExpress);
  }
  if (_.isFunction(obj)) {
    if (obj.constructor.name === 'GeneratorFunction') {
      return wrapExpress(obj);
    }
    return obj;
  }
  _.each(obj, (value, key) => {
    obj[key] = autoWrapExpress(value);
  });
  return obj;
}

/**
 * Hash the given text.
 *
 * @param {String} text the text to hash
 * @returns {String} the hashed string
 */
function* hashString(text) {
  return yield bcrypt.hashAsync(text, config.PASSWORD_HASH_SALT_LENGTH);
}

/**
 * Validate that the hash is actually the hashed value of plain text
 *
 * @param {String} text   the text to validate
 * @param {String} hash   the hash to validate
 * @returns {Boolean} whether it is valid
 */
function* validateHash(text, hash) {
  return yield bcrypt.compareAsync(text, hash);
}

/**
 * Generate an unique random string.
 *
 * @returns {String} the generated string
 */
function generateRandomString() {
  return `${uuid()}-${new Date().getTime()}`;
}

/**
 * Ensures there is one entity, and return it
 * @param Model the model
 * @param where the where clause
 * @param include the include models
 * @returns {Object} the found entity
 */
function* ensureExists(Model, where, include) {
  const query = { where };
  if (include) {
    query.include = include;
  }
  const entity = yield Model.findOne(query);
  if (!entity) {
    throw new errors.NotFoundError(`cannot find entity ${util.format(Model)} where: ${JSON.stringify(where)}`);
  }
  return entity;
}

/**
 * conert user entity to json object to return to frontend
 * @param entity the user entity
 * @return the converted object
 */
function toUserObject(entity) {
  let obj = entity.toJSON();
  obj = _.omit(obj, ['passwordHash', 'forgotPasswordToken', 'forgotPasswordTokenValidUntil',
    'verificationToken', 'verificationTokenValidUntil', 'facebookId']);
  return obj;
}

/**
 * Sanitize string to avoid SQL injection attack. Only number, letter and space are preserved,
 * other characters are removed.
 * @param s the string
 * @returns {String} the sanitized string
 */
function sanitize(s) {
  if (!s) {
    return '';
  }
  return s.replace(/[^a-zA-Z 0-9]/g, '');
}

module.exports = {
  wrapExpress,
  autoWrapExpress,
  createOrUpdate,
  createOrUpdateArrayItems,
  getHostWithApiVersion,
  hashString,
  validateHash,
  generateRandomString,
  ensureExists,
  toUserObject,
  sanitize,
};
