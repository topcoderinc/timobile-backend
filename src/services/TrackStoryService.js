/**
 * Copyright (C) 2017 TopCoder Inc., All Rights Reserved.
 */

/**
 * the track story service
 *
 * @author      TCSCODER
 * @version     1.0
 */
const models = require('../models');
const joi = require('joi');
const co = require('co');
const errors = require('common-errors');
const _ = require('lodash');
const helper = require('../common/helper');
const constants = require('../constants');

const entitySchema = joi.object().keys({
  title: joi.string().required(),
  subtitle: joi.string(),
  tags: joi.array().items(joi.object().keys({
    id: joi.optionalId(),
    value: joi.string().required(),
  })),
  chapters: joi.array().items(joi.object().keys({
    id: joi.optionalId(),
    trackStoryId: joi.optionalId(),
    number: joi.number().integer().min(1).required(),
    title: joi.string().required(),
    subtitle: joi.string(),
    content: joi.string().required(),
    wordsCount: joi.number().integer().min(0),
  })),
  cards: joi.array().items(joi.object().keys({
    id: joi.optionalId(),
    name: joi.string().required(),
    description: joi.string(),
    imageURL: joi.string(),
    type: joi.string().valid(_.values(constants.CardType)).required(),
    trackStoryId: joi.optionalId(),
    pricePoints: joi.number().integer().min(0),
  })),
  racetrack: joi.object().keys({
    id: joi.optionalId(),
    name: joi.string().required(),
    stateId: joi.id(),
    locality: joi.string().required(),
    street: joi.string(),
    locationLat: joi.number().min(-90).max(90).required(),
    locationLng: joi.number().min(-180).max(180).required(),
  }),
  smallImageURL: joi.string(),
  largeImageURL: joi.string(),
  badge: joi.object().keys({
    id: joi.optionalId(),
    name: joi.string().required(),
    description: joi.string(),
    imageURL: joi.string(),
    trackStoryId: joi.optionalId(),
  }),
  additionalTask: joi.object().keys({
    id: joi.optionalId(),
    name: joi.string().required(),
    description: joi.string(),
    points: joi.number().integer().min(0),
    trackStoryId: joi.optionalId(),
  }),
}).required();

/**
 * Create track story. For child entity, if id is provided, it will be updated, otherwise created.
 * @param entity the entity
 * @return created entity
 */
function* create(entity) {
  let theId;
  yield models.sequelize.transaction(t => co(function* () {
    if (entity.racetrack) {
      entity.racetrackId = (yield helper.createOrUpdate(models.Racetrack, entity.racetrack, t)).id;
    }
    const trackStory = yield models.TrackStory.create(entity, { transaction: t });
    theId = trackStory.id;
    let resave = false;
    if (entity.badge) {
      entity.badge.trackStoryId = trackStory.id;
      trackStory.badgeId = (yield helper.createOrUpdate(models.Badge, entity.badge, t)).id;
      resave = true;
    }
    if (entity.additionalTask) {
      entity.additionalTask.trackStoryId = trackStory.id;
      trackStory.additionalTaskId = (yield helper.createOrUpdate(models.AdditionalTask, entity.additionalTask, t)).id;
      resave = true;
    }
    if (resave) {
      yield trackStory.save({ transaction: t });
    }

    if (entity.tags && entity.tags.length > 0) {
      const tagIds = yield helper.createOrUpdateArrayItems(models.Tag, entity.tags, t);
      yield trackStory.setTags(tagIds, { transaction: t });
    }
    if (entity.chapters && entity.chapters.length > 0) {
      _.each(entity.chapters, (chapter) => {
        chapter.trackStoryId = trackStory.id;
      });
      const chapterIds = yield helper.createOrUpdateArrayItems(models.Chapter, entity.chapters, t);
      yield trackStory.setChapters(chapterIds, { transaction: t });
    }
    if (entity.cards && entity.cards.length > 0) {
      _.each(entity.cards, (card) => {
        card.trackStoryId = trackStory.id;
      });
      const cardIds = yield helper.createOrUpdateArrayItems(models.Card, entity.cards, t);
      yield trackStory.setCards(cardIds, { transaction: t });
    }
  }));
  return yield get(theId);
}

create.schema = {
  entity: entitySchema,
};

/**
 * Update track story. For child entity, if id is provided, it will be updated, otherwise created.
 * @param id the id that need update
 * @param entity the entity
 */
function* update(id, entity) {
  yield models.sequelize.transaction(t => co(function* () {
    const trackStory = yield helper.ensureExists(models.TrackStory, { id });
    if (entity.racetrack) {
      entity.racetrackId = (yield helper.createOrUpdate(models.Racetrack, entity.racetrack, t)).id;
    }
    if (entity.badge) {
      entity.badge.trackStoryId = id;
      entity.badgeId = (yield helper.createOrUpdate(models.Badge, entity.badge, t)).id;
    }
    if (entity.additionalTask) {
      entity.additionalTask.trackStoryId = id;
      entity.additionalTaskId = (yield helper.createOrUpdate(models.AdditionalTask, entity.additionalTask, t)).id;
    }
    _.assignIn(trackStory, entity);
    yield trackStory.save({ transaction: t });

    if (entity.tags) {
      const tagIds = yield helper.createOrUpdateArrayItems(models.Tag, entity.tags, t);
      yield trackStory.setTags(tagIds, { transaction: t });
    }
    if (entity.chapters) {
      _.each(entity.chapters, (chapter) => {
        chapter.trackStoryId = trackStory.id;
      });
      const chapterIds = yield helper.createOrUpdateArrayItems(models.Chapter, entity.chapters, t);
      yield trackStory.setChapters(chapterIds, { transaction: t });
    }
    if (entity.cards) {
      _.each(entity.cards, (card) => {
        card.trackStoryId = trackStory.id;
      });
      const cardIds = yield helper.createOrUpdateArrayItems(models.Card, entity.cards, t);
      yield trackStory.setCards(cardIds, { transaction: t });
    }
  }));
  return yield get(id);
}

update.schema = {
  id: joi.id(),
  entity: entitySchema,
};

/**
 * remove track story
 * @param id entity id
 */
function* remove(id) {
  return yield models.sequelize.transaction(t => co(function* () {
    const e = yield helper.ensureExists(models.TrackStory, { id });
    yield e.destroy({ transaction: t });
    // delete additional task
    yield models.AdditionalTask.destroy({ where: { trackStoryId: id }, transaction: t });
    // delete chapters
    yield models.Chapter.destroy({ where: { trackStoryId: id }, transaction: t });

    // related cards and badges may be granted to user, so they are not to be removed
    // related tag and racetrack are global, may be used by others, they are not to be removed

    return { success: true };
  }));
}

remove.schema = {
  id: joi.id(),
};

/**
 * get track story by id
 * @param id
 */
function* get(id) {
  const entity = yield models.TrackStory.findOne({
    where: { id },
    include: [{ model: models.Tag, as: 'tags' },
      { model: models.Chapter, as: 'chapters' },
      { model: models.Card, as: 'cards' },
      { model: models.Badge, as: 'badge' },
      { model: models.AdditionalTask, as: 'additionalTask' },
      { model: models.Racetrack,
        as: 'racetrack',
        include:
        [{ model: models.State, as: 'state' }] }],
  });
  if (!entity) {
    throw new errors.NotFoundError(`cannot find TrackStory where id = ${id}`);
  }
  return entity;
}

get.schema = { id: joi.id() };

/**
 * build db search query
 * @param filter the search filter
 */
function* buildDBFilter(filter) {
  const include = [{ model: models.Tag, as: 'tags' },
    { model: models.Chapter, as: 'chapters' },
    { model: models.Card, as: 'cards' },
    { model: models.Badge, as: 'badge' },
    { model: models.AdditionalTask, as: 'additionalTask' },
    { model: models.Racetrack,
      as: 'racetrack',
      include:
      [{ model: models.State, as: 'state' }] }];

  const where = {};
  if (filter.title) where.title = { $like: `%${filter.title}%` };

  let racetrackIds = [];
  if (filter.racetrackIds) {
    racetrackIds = _.map(filter.racetrackIds.split(','), (str) => {
      const id = Number(str);
      if (!_.isInteger(id)) {
        throw new errors.ArgumentError(`invalid racetrack id: ${str}`);
      }
      return id;
    });
  }
  if (filter.racetrackId) racetrackIds.push(filter.racetrackId);
  if (racetrackIds.length > 0) {
    where.racetrackId = { $in: racetrackIds };
  }
  if (filter.tagIds) {
    const ids = _.map(filter.tagIds.split(','), (tagIdStr) => {
      const tagId = Number(tagIdStr);
      if (!_.isInteger(tagId)) {
        throw new errors.ArgumentError(`Invalid tag id: ${tagIdStr}`);
      }
      return tagId;
    });
    include[0].where = { id: { $in: ids } };
  }
  return {
    where,
    include,
    offset: filter.offset,
    limit: filter.limit,
    order: [[filter.sortColumn, filter.sortOrder.toUpperCase()]],
  };
}

/**
 * search track stories
 * @param filter the query filter
 * @return search result
 */
function* search(filter) {
  const query = yield buildDBFilter(filter);
  // when child entities are included, sequelize can not count the total items,
  // so here it has no total field in the result
  const items = yield models.TrackStory.findAll(query);
  return { items, offset: filter.offset, limit: filter.limit };
}

search.schema = {
  filter: joi.object().keys({
    title: joi.string(),
    racetrackId: joi.optionalId(),
    racetrackIds: joi.string(),
    tagIds: joi.string(), // comma separated tag ids
    offset: joi.offset(),
    limit: joi.limit(),
    sortColumn: joi.string().valid('id', 'title', 'subtitle').default('id'),
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
