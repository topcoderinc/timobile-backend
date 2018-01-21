/**
 * Copyright (C) 2017 TopCoder Inc., All Rights Reserved.
 */

/**
 * Defines the API routes
 *
 * @author      TCSCODER
 * @version     1.0
 */

const _ = require('lodash');
const AchievementRoutes = require('./AchievementRoutes');
const BookmarkedRacetrackRoutes = require('./BookmarkedRacetrackRoutes');
const CardRoutes = require('./CardRoutes');
const CommentRoutes = require('./CommentRoutes');
const DailyTaskRoutes = require('./DailyTaskRoutes');
const LookupRoutes = require('./LookupRoutes');
const RacetrackRoutes = require('./RacetrackRoutes');
const SecurityRoutes = require('./SecurityRoutes');
const TagRoutes = require('./TagRoutes');
const TrackStoryRoutes = require('./TrackStoryRoutes');
const TrackStoryUserProgressRoutes = require('./TrackStoryUserProgressRoutes');
const UserAchievementRoutes = require('./UserAchievementRoutes');
const UserCardAndBadgeRoutes = require('./UserCardAndBadgeRoutes');
const UserDailyTaskRoutes = require('./UserDailyTaskRoutes');
const UserPreferenceOptionRoutes = require('./UserPreferenceOptionRoutes');
const UserRoutes = require('./UserRoutes');

module.exports = _.extend({}, AchievementRoutes, BookmarkedRacetrackRoutes, CardRoutes,
  CommentRoutes, DailyTaskRoutes, LookupRoutes, RacetrackRoutes, SecurityRoutes, TagRoutes,
  TrackStoryRoutes, TrackStoryUserProgressRoutes, UserAchievementRoutes, UserCardAndBadgeRoutes,
  UserDailyTaskRoutes, UserPreferenceOptionRoutes, UserRoutes);
