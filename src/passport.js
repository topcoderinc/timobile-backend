/**
 * Copyright (C) 2017 TopCoder Inc., All Rights Reserved.
 */

/**
 * the passport auth file
 *
 * @author      TCSCODER
 * @version     1.0
 */

const config = require('config');
const passport = require('passport');
const _ = require('lodash');
const co = require('co');
const models = require('./models');
const helper = require('./common/helper');
const FacebookStrategy = require('passport-facebook');
const SecurityService = require('./services/SecurityService');
const constants = require('./constants');
/**
 * get the auth callback url predix
 * @param req the request
 */
const getCallbackPredix = req => helper.getHostWithApiVersion(req);

/**
 * the passport default serializeUser method
 */
passport.serializeUser((user, cb) => {
  cb(null, user);
});

/**
 * the passport default deserializeUser method
 */
passport.deserializeUser((obj, cb) => {
  cb(null, obj);
});

/**
 * create the auth function
 * @param authType , the auth type(google,facebook,linkedIn)
 * @param scope the auth scope
 * @return {function(*=, *=, *=)}
 */
const createAuthFunc = (authType, scope) => {
  const strategies = {
    facebook: FacebookStrategy,
  };
  const Strategy = strategies[authType];
  const strategyEntity = {
    clientID: config[authType].clientId,
    clientSecret: config[authType].clientSecret,
    scope,
  };
  if (authType === 'facebook') {
    strategyEntity.profileFields = scope;
    strategyEntity.profileFields = ['emails', 'displayName', 'picture.type(large)', 'name', 'profileUrl'];
  }
  return (req, res, next) => {
    passport.use(new Strategy(
      _.extend(strategyEntity, { callbackURL: `${getCallbackPredix(req)}/auth/${authType}/callback` }),
      ((accessToken, refreshToken, profile, cb) => cb(null, _.extend(profile, { accessToken }))),
    ));
    return passport.authenticate(authType, { scope })(req, res, next);
  };
};

/**
 * get auth entity and auth query (to found match user)
 * @param authType the auth type
 * @param user the use
 * @returns {*}
 */
const getEntityAndQuery = (authType, user) => {
  const idName = `${authType}Id`;
  const entity = { username: user.displayName, token: user.accessToken };
  entity[idName] = user.id;
  try {
    entity.email = user.emails[0].value; // if email exist , use email as query key
    entity.profileImage = user.photos[0].value;
    return entity;
  } catch (e) {
    return entity;
  }
};

/**
 * the common auth callback
 * @param authType the auth type
 * @param req the request
 * @param res the response
 * @param next the next
 */
const authCallback = (authType, req, res, next) => {
  const entity = getEntityAndQuery(authType, req.user);
  co(function* () {
    let user = yield models.User.findOne({ where: { facebookId: entity.facebookId } });
    if (!user) {
      const userEntity = {
        role: constants.UserRole.user,
        facebookId: entity.facebookId,
        facebookToken: entity.token,
        pointsAmount: 0,
        profilePhotoURL: entity.profileImage,
        email: entity.email,
        verified: true
      };
      if (entity.username) {
        const names = entity.username.split(' ');
        userEntity.firstName = names[0];
        if (names.length > 1) {
          userEntity.lastName = names[1];
        }
      }
      user = yield models.User.create(userEntity);
    }
    const userAuth = yield SecurityService.injectToken(user);
    const redirectUrl = `${config.socialRedirectUrl}?accessToken=${userAuth.accessToken}`
      + `&accessTokenValidUntil=${userAuth.accessTokenValidUntil.getTime()}&type=${authType}`;
    res.redirect(redirectUrl);
  }).catch((err) => {
    next(err);
  });
};

/**
 * the facebook callback
 */
const facebookCallback = (req, res, next) => {
  authCallback('facebook', req, res, next);
};

module.exports = {
  init: (app) => { // register passport auth uri
    app.get(`/${config.API_VERSION}/auth/facebook`, createAuthFunc('facebook', ['email', 'user_photos', 'public_profile']));
    app.get(`/${config.API_VERSION}/auth/facebook/callback`, passport.authenticate('facebook'), facebookCallback);
  },
};
