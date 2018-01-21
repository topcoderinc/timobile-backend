/**
 * Copyright (C) 2017 TopCoder Inc., All Rights Reserved.
 */

/**
 * the track story user progress service
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
const TrackStoryService = require('./TrackStoryService');

/**
 * get or create progress
 * @param entity the entity
 * @return created entity
 */
function* getOrCreate(userId, trackStoryId) {
  yield helper.ensureExists(models.TrackStory, { id: trackStoryId });
  const progress = yield models.TrackStoryUserProgress.findOne({ where: { userId, trackStoryId } });
  if (progress) {
    return progress;
  }
  return yield models.TrackStoryUserProgress.create({
    userId,
    trackStoryId,
    completed: false,
    cardsAndRewardsReceived: false,
    additionalTaskCompleted: false,
  });
}

getOrCreate.schema = {
  userId: joi.id(),
  trackStoryId: joi.id(),
};

/**
 * update progress
 * @param id the id that need update
 * @param entity the entity
 */
function* update(id, entity) {
  yield models.sequelize.transaction(t => co(function* () {
    const progress = yield helper.ensureExists(models.TrackStoryUserProgress, { id });
    _.assignIn(progress, entity);
    yield progress.save({ transaction: t });

    if (entity.chaptersUserProgress) {
      for (let i = 0; i < entity.chaptersUserProgress.length; i += 1) {
        // ensure that the chapter id exists
        yield helper.ensureExists(models.Chapter, { id: entity.chaptersUserProgress[i].chapterId });
        entity.chaptersUserProgress[i].trackStoryUserProgressId = id;
      }
      const chapterProgressIds = yield helper.createOrUpdateArrayItems(models.ChapterUserProgress,
        entity.chaptersUserProgress, t);
      yield progress.setChaptersUserProgress(chapterProgressIds, { transaction: t });
    }
  }));
  return yield models.TrackStoryUserProgress.findOne({
    where: { id },
    include: [{
      model: models.ChapterUserProgress,
      as: 'chaptersUserProgress',
    }],
  });
}

update.schema = {
  id: joi.id(),
  entity: joi.object().keys({
    userId: joi.id(),
    trackStoryId: joi.id(),
    // following 3 fields are managed by other functions
    // completed: joi.boolean(),
    // cardsAndRewardsReceived: joi.boolean(),
    // additionalTaskCompleted: joi.boolean(),
    chaptersUserProgress: joi.array().items(joi.object().keys({
      id: joi.optionalId(),
      chapterId: joi.id(),
      trackStoryUserProgressId: joi.optionalId(),
      wordsRead: joi.number().integer().min(0),
      completed: joi.boolean().required(),
    })),
  }).required(),
};

/**
 * complete progress
 * @param id the id that need to complete
 */
function* complete(id) {
  const e = yield helper.ensureExists(models.TrackStoryUserProgress, { id });
  e.completed = true;
  return yield e.save();
}

complete.schema = {
  id: joi.id(),
};

/**
 * receive rewards
 * @param id the progress id
 */
function* receiveRewards(id) {
  return yield models.sequelize.transaction(t => co(function* () {
    const progress = yield helper.ensureExists(models.TrackStoryUserProgress, { id });
    if (!progress.completed) {
      throw new errors.ValidationError('the progress is incomplete');
    }
    if (progress.cardsAndRewardsReceived) {
      throw new errors.ValidationError('the rewards are already received');
    }
    const trackStory = (yield TrackStoryService.get(progress.trackStoryId)).toJSON();
    const result = { userCards: [] };
    if (trackStory.badge) {
      result.userBadge = (yield models.UserBadge.create({ userId: progress.userId, badgeId: trackStory.badge.id },
        { transaction: t })).toJSON();
      result.userBadge.badge = trackStory.badge;
    }
    if (trackStory.cards) {
      for (let i = 0; i < trackStory.cards.length; i += 1) {
        const userCardObj = (yield models.UserCard.create({ userId: progress.userId, cardId: trackStory.cards[i].id },
          { transaction: t })).toJSON();
        userCardObj.card = trackStory.cards[i];
        result.userCards.push(userCardObj);
      }
    }
    progress.cardsAndRewardsReceived = true;
    yield progress.save({ transaction: t });
    return result;
  }));
}

receiveRewards.schema = {
  id: joi.id(),
};

/**
 * get all progresses of the user
 * @param userId the user id
 * @param completed the completed flag
 */
function* getAll(userId, completed) {
  const where = { userId };
  if (!_.isNil(completed)) {
    where.completed = completed;
  }
  return yield models.TrackStoryUserProgress.findAll({
    where,
    include: [{
      model: models.ChapterUserProgress,
      as: 'chaptersUserProgress',
    }],
  });
}

getAll.schema = {
  userId: joi.id(),
  completed: joi.boolean().allow(null),
};

/**
 * complete additional task
 * @param id the progress id that need to complete additional task
 */
function* completeAdditionalTask(id) {
  return yield models.sequelize.transaction(t => co(function* () {
    const progress = yield helper.ensureExists(models.TrackStoryUserProgress, { id });
    if (progress.additionalTaskCompleted) {
      throw new errors.ValidationError('the additional task is already completed');
    }
    const trackStory = yield TrackStoryService.get(progress.trackStoryId);
    if (trackStory.additionalTask) {
      const user = yield helper.ensureExists(models.User, { id: progress.userId });
      user.pointsAmount += trackStory.additionalTask.points;
      yield user.save({ transaction: t });
    }
    progress.additionalTaskCompleted = true;
    yield progress.save({ transaction: t });
    return { success: true };
  }));
}

completeAdditionalTask.schema = {
  id: joi.id(),
};

module.exports = {
  getOrCreate,
  update,
  complete,
  receiveRewards,
  getAll,
  completeAdditionalTask,
};
