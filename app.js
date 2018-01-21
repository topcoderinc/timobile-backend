/**
 * Copyright (C) 2017 TopCoder Inc., All Rights Reserved.
 */

/**
 * The application entry point
 *
 * @author      TCSCODER
 * @version     1.0
 */

require('./src/bootstrap');

const config = require('config');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const _ = require('lodash');
const winston = require('winston');
const httpStatus = require('http-status');
const helper = require('./src/common/helper');
const errorMiddleware = require('./src/common/ErrorMiddleware');
const routes = require('./src/routes');
const errors = require('common-errors');
const models = require('./src/models');
const passport = require('passport');
const BearerStrategy = require('passport-http-bearer');
const UserService = require('./src/services/UserService');
const co = require('co');
const passportLogic = require('./src/passport');

const app = express();
const http = require('http').Server(app);

app.use(passport.initialize());
app.use(passport.session());
app.set('port', config.PORT);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

passportLogic.init(app);
models.init(false);

passport.use(new BearerStrategy((token, done) =>
  co(function* () {
    return yield UserService.getByAccessToken(token);
  }).then(user => (user ? done(null, user) : done(null, false))).catch(err => done(err))
));

const apiRouter = express.Router();

// load all routes
_.each(routes, (verbs, url) => {
  _.each(verbs, (def, verb) => {
    const actions = [
      function (req, res, next) {
        req.signature = `${def.controller}#${def.method}`;
        next();
      },
    ];
    const method = require(`./src/controllers/${def.controller}`)[ def.method ]; // eslint-disable-line

    if (!method) {
      throw new Error(`${def.method} is undefined, for controller ${def.controller}`);
    }
    if (!def.public) {
      // authentication
      actions.push(passport.authenticate('bearer', { session: false }));
      // authorization
      if (def.roles && def.roles.length > 0) {
        actions.push((req, res, next) => {
          if (_.indexOf(def.roles, req.user.role) < 0) {
            next(new errors.NotPermittedError('invalid role'));
          } else {
            next();
          }
        });
      }
    }

    actions.push(method);
    winston.info(`API : ${verb.toLocaleUpperCase()} /${config.API_VERSION}${url}`);
    apiRouter[verb](`/${config.API_VERSION}${url}`, helper.autoWrapExpress(actions));
  });
});

app.use('/', apiRouter);
app.use(errorMiddleware());
app.use('*', (req, res) => {
  const pathKey = req.baseUrl.substring(config.API_VERSION.length + 1);
  const route = routes[pathKey];
  if (route) {
    res.status(httpStatus.METHOD_NOT_ALLOWED).json({ message: 'The requested method is not supported.' });
  } else {
    res.status(httpStatus.NOT_FOUND).json({ message: 'The requested resouce cannot found.' });
  }
});

http.listen(app.get('port'), () => {
  winston.info(`Express server listening on port ${app.get('port')}`);
});

module.exports = app;
