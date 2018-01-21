/**
 * Copyright (C) 2017 TopCoder Inc., All Rights Reserved.
 */

/**
 * the sequelize schema index
 *
 * @author      TCSCODER
 * @version     1.0
 */

const sequelize = require('../datasource').getSequelize();
const DataTypes = require('sequelize/lib/data-types');

const User = require('./User')(sequelize, DataTypes);
const UserPreferenceOption = require('./UserPreferenceOption')(sequelize, DataTypes);
const State = require('./State')(sequelize, DataTypes);
const Card = require('./Card')(sequelize, DataTypes);
const Badge = require('./Badge')(sequelize, DataTypes);
const UserBadge = require('./UserBadge')(sequelize, DataTypes);
const UserCard = require('./UserCard')(sequelize, DataTypes);
const PreferenceOption = require('./PreferenceOption')(sequelize, DataTypes);
const Tag = require('./Tag')(sequelize, DataTypes);
const TrackStory = require('./TrackStory')(sequelize, DataTypes);
const Chapter = require('./Chapter')(sequelize, DataTypes);
const UserAchievement = require('./UserAchievement')(sequelize, DataTypes);
const AdditionalTask = require('./AdditionalTask')(sequelize, DataTypes);
const Racetrack = require('./Racetrack')(sequelize, DataTypes);
const Comment = require('./Comment')(sequelize, DataTypes);
const DailyTask = require('./DailyTask')(sequelize, DataTypes);
const BookmarkedRacetrack = require('./BookmarkedRacetrack')(sequelize, DataTypes);
const UserDailyTask = require('./UserDailyTask')(sequelize, DataTypes);
const TrackStoryUserProgress = require('./TrackStoryUserProgress')(sequelize, DataTypes);
const ChapterUserProgress = require('./ChapterUserProgress')(sequelize, DataTypes);
const Achievement = require('./Achievement')(sequelize, DataTypes);
const AchievementRule = require('./AchievementRule')(sequelize, DataTypes);

const belongsToMany = (source, target, through, as) => {
  source.belongsToMany(target, { through, timestamp: false, as });
};
const belongsTo = (source, target, as) => {
  source.belongsTo(target, { as });
};

belongsTo(UserPreferenceOption, PreferenceOption, 'preferenceOption');
belongsTo(UserBadge, Badge, 'badge');
belongsTo(UserCard, Card, 'card');

belongsToMany(TrackStory, Tag, 'TrackStoryTags', 'tags');
belongsToMany(TrackStory, Chapter, 'TrackStoryChapters', 'chapters');
belongsToMany(TrackStory, Card, 'TrackStoryCards', 'cards');
belongsTo(TrackStory, Racetrack, 'racetrack');
belongsTo(TrackStory, Badge, 'badge');
belongsTo(TrackStory, AdditionalTask, 'additionalTask');

belongsTo(UserAchievement, Achievement, 'achievement');
belongsTo(Achievement, AchievementRule, 'achievementRule');
belongsTo(Racetrack, State, 'state');
belongsTo(Comment, User, 'user');
belongsTo(BookmarkedRacetrack, Racetrack, 'racetrack');
belongsTo(UserDailyTask, DailyTask, 'dailyTask');

belongsToMany(TrackStoryUserProgress, ChapterUserProgress, 'TrackStoryUserProgressChatpers', 'chaptersUserProgress');

module.exports = {
  User,
  UserPreferenceOption,
  State,
  Card,
  Badge,
  UserBadge,
  UserCard,
  PreferenceOption,
  Tag,
  TrackStory,
  Chapter,
  UserAchievement,
  AdditionalTask,
  Comment,
  DailyTask,
  Racetrack,
  BookmarkedRacetrack,
  UserDailyTask,
  TrackStoryUserProgress,
  ChapterUserProgress,
  Achievement,
  AchievementRule,
  sequelize,
};

module.exports.init = force => sequelize.sync({ force });
