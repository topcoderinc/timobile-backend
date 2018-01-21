/**
 * Copyright (C) 2017 TopCoder Inc., All Rights Reserved.
 */

/**
 * the comment service
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
  text: joi.string().required(),
  userId: joi.id(),
  chapterId: joi.optionalId(),
  trackStoryId: joi.optionalId(),
  type: joi.string().valid(_.values(constants.CommentType)).required(),
}).required();

/**
 * create comment
 * @param entity the entity
 * @return created entity
 */
function* create(entity) {
  if (entity.chapterId) {
    yield helper.ensureExists(models.Chapter, { id: entity.chapterId });
  }
  if (entity.trackStoryId) {
    yield helper.ensureExists(models.TrackStory, { id: entity.trackStoryId });
  }
  return yield models.Comment.create(entity);
}

create.schema = {
  entity: entitySchema,
};

/**
 * update comment
 * @param id the id that need update
 * @param entity the entity
 */
function* update(id, entity) {
  if (entity.chapterId) {
    yield helper.ensureExists(models.Chapter, { id: entity.chapterId });
  }
  if (entity.trackStoryId) {
    yield helper.ensureExists(models.TrackStory, { id: entity.trackStoryId });
  }
  const e = yield helper.ensureExists(models.Comment, { id });
  _.assignIn(e, entity);
  return yield e.save();
}

update.schema = {
  id: joi.id(),
  entity: entitySchema,
};

/**
 * remove comment
 * @param id entity id
 */
function* remove(id) {
  const e = yield helper.ensureExists(models.Comment, { id });
  yield e.destroy();
  return { success: true };
}

remove.schema = {
  id: joi.id(),
};

/**
 * Convert given user object to simplified user with only necessary fields to be returned with comment.
 * @param user the user
 * @returns converted simplified user
 */
function convertUser(user) {
  return _.pick(user, ['id', 'firstName', 'lastName', 'email', 'profilePhotoURL', 'role']);
}

/**
 * get comment by id
 * @param id
 */
function* get(id) {
  let comment = yield models.Comment.findOne({
    where: { id },
    include: [{
      model: models.User,
      as: 'user',
    }],
  });
  if (!comment) {
    throw new errors.NotFoundError(`cannot find comment of id: ${id}`);
  }
  comment = comment.toJSON();
  if (comment.user) {
    comment.user = convertUser(comment.user);
  }
  return comment;
}

get.schema = { id: joi.id() };

/**
 * build db search query
 * @param filter the search filter
 */
function buildDBFilter(filter) {
  const where = {};
  if (filter.userId) where.userId = filter.userId;
  if (filter.chapterId) where.chapterId = filter.chapterId;
  if (filter.trackStoryId) where.trackStoryId = filter.trackStoryId;
  if (filter.types) {
    const ts = filter.types.split(',');
    _.each(ts, (t) => {
      if (_.indexOf(_.values(constants.CommentType), t) < 0) {
        throw new errors.ArgumentError(`invalid comment type: ${t}`);
      }
    });
    where.type = { $in: ts };
  }
  const res = { where };
  if (filter.offset) res.offset = filter.offset;
  if (filter.limit) res.limit = filter.limit;
  if (filter.sortColumn && filter.sortOrder) res.order = [[filter.sortColumn, filter.sortOrder.toUpperCase()]];
  if (filter.limit) {
    // when there is limit parameter, this is a search, not countByFilter
    // then add include
    res.include = [{
      model: models.User,
      as: 'user',
    }];
  }
  return res;
}

/**
 * search comments
 * @param filter the query filter
 * @return search result
 */
function* search(filter) {
  const query = buildDBFilter(filter);
  const docs = yield models.Comment.findAndCountAll(query);
  const items = _.map(docs.rows, (row) => {
    const comment = row.toJSON();
    if (comment.user) {
      comment.user = convertUser(comment.user);
    }
    return comment;
  });
  return {
    items,
    total: docs.count,
    offset: filter.offset,
    limit: filter.limit,
  };
}

search.schema = {
  filter: joi.object().keys({
    userId: joi.optionalId(),
    chapterId: joi.optionalId(),
    trackStoryId: joi.optionalId(),
    types: joi.string(), // comma separated types
    offset: joi.offset(),
    limit: joi.limit(),
    sortColumn: joi.string().valid('id', 'text', 'userId', 'chapterId', 'trackStoryId',
      'type', 'createdAt', 'updatedAt').default('id'),
    sortOrder: joi.sortOrder(),
  }),
};

/**
 * count comments by filter
 * @param filter the query filter
 * @return search result
 */
function* countByFilter(filter) {
  const query = buildDBFilter(filter);
  return yield models.Comment.count(query);
}

countByFilter.schema = {
  filter: joi.object().keys({
    userId: joi.optionalId(),
    chapterId: joi.optionalId(),
    trackStoryId: joi.optionalId(),
    types: joi.string(), // comma separated types
  }),
};

module.exports = {
  create,
  update,
  remove,
  get,
  search,
  countByFilter,
};
