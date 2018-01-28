/**
 * Copyright (C) 2017 TopCoder Inc., All Rights Reserved.
 */

/**
 * the bookmarked racetrack service
 *
 * @author      TCSCODER
 * @version     1.0
 */
const models = require('../models');
const joi = require('joi');
const errors = require('common-errors');
const helper = require('../common/helper');

/**
 * create bookmark
 * @param userId the user id
 * @param racetrackId the racetrack id
 */
function* createBookmark(userId, racetrackId) {
  yield helper.ensureExists(models.Racetrack, { id: racetrackId });
  const e = yield models.BookmarkedRacetrack.findOne({ where: { userId, racetrackId } });
  if (e) {
    throw new errors.ValidationError('the race track was already bookmarked');
  }
  const bookMark = yield models.BookmarkedRacetrack.create({
    userId,
    racetrackId,
  });
  return yield get(bookMark.id);
}

createBookmark.schema = {
  userId: joi.id(),
  racetrackId: joi.id(),
};

/**
 * get bookmark by bookmark id
 */
function* get(id) {
  return yield models.BookmarkedRacetrack.findOne({
    where: { id },
    include: [{
      model: models.Racetrack,
      as: 'racetrack',
    }],
  });
}

/**
 * remove bookmark
 * @param userId the user id
 * @param racetrackId the racetrack id
 */
function* removeBookmark(userId, racetrackId) {
  yield helper.ensureExists(models.Racetrack, { id: racetrackId });
  const count = yield models.BookmarkedRacetrack.destroy({ where: { userId, racetrackId } });
  if (count === 0) {
    throw new errors.ValidationError('the race track was not bookmarked');
  }
  return { success: true };
}

removeBookmark.schema = {
  userId: joi.id(),
  racetrackId: joi.id(),
};

/**
 * get all bookmarks
 * @param userId the user id
 * @return all bookmarks of the user
 */
function* getAll(userId) {
  return yield models.BookmarkedRacetrack.findAll({
    where: { userId },
    include: [{
      model: models.Racetrack,
      as: 'racetrack',
    }],
  });
}

getAll.schema = {
  userId: joi.id(),
};

module.exports = {
  createBookmark,
  removeBookmark,
  getAll,
};
