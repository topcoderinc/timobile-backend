/**
 * Copyright (C) 2017 TopCoder Inc., All Rights Reserved.
 */

/**
 * the default config
 *
 * @author      TCSCODER
 * @version     1.0
 */

module.exports = {
  LOG_LEVEL: process.env.LOG_LEVEL || 'debug',
  PORT: process.env.PORT || 3000,

  PASSWORD_HASH_SALT_LENGTH: (process.env.PASSWORD_HASH_SALT_LENGTH && Number(process.env.PASSWORD_HASH_SALT_LENGTH)) || 10,

  ACCESS_TOKEN_EXPIRES: (process.env.ACCESS_TOKEN_EXPIRES && Number(process.env.ACCESS_TOKEN_EXPIRES))
    || 12 * 60 * 60, // 12 hours
  VERIFY_TOKEN_EXPIRES: (process.env.VERIFY_TOKEN_EXPIRES && Number(process.env.VERIFY_TOKEN_EXPIRES))
    || 2 * 60 * 60, // 2 hours
  FORGOT_PASSWORD_TOKEN_EXPIRES: (process.env.FORGOT_PASSWORD_TOKEN_EXPIRES && Number(process.env.FORGOT_PASSWORD_TOKEN_EXPIRES))
    || 2 * 60 * 60, // 2 hours
  QUERY_DEFAULT_LIMIT: (process.env.QUERY_DEFAULT_LIMIT && Number(process.env.QUERY_DEFAULT_LIMIT)) || 20,
  API_VERSION: process.env.API_VERSION || 'api/v1',

  VERIFY_EMAIL_SUBJECT: process.env.VERIFY_EMAIL_SUBJECT || 'Verify Your Email',
  VERIFY_EMAIL_CONTENT: process.env.VERIFY_EMAIL_CONTENT ||
    `Hello, Your verification token is:
%s

You can click following url to verify email:
%s`,

  FORGOT_PASSWORD_EMAIL_SUBJECT: process.env.FORGOT_PASSWORD_EMAIL_SUBJECT || 'Reset Forgot Password',
  FORGOT_PASSWORD_EMAIL_CONTENT: process.env.FORGOT_PASSWORD_EMAIL_CONTENT ||
    `Hello, Your reset password token is:
%s`,
  SESSION_SECRET: 'secret',
  FROM_EMAIL: process.env.FROM_EMAIL || 'test@test.com',
  email: {
    host: process.env.SMTP_HOST || 'localhost',
    port: (process.env.SMTP_PORT && Number(process.env.SMTP_PORT)) || 25,
    auth: {
      user: process.env.SMTP_USER || 'username',
      pass: process.env.SMTP_PASSWORD || 'password',
    },
  },
  facebook: {
    clientId: process.env.FACEBOOK_APP_ID || '135794683759765',
    clientSecret: process.env.FACEBOOK_APP_SECRET || '7802759f88fbfa9c7ada1cdada38be5e',
  },
  socialRedirectUrl: 'tiMobile://social',
  db: {
    // the uri format is mysql://username:password@host:port/dbname
    uri: process.env.JAWSDB_URL || 'mysql://root:@localhost:3306/ti_mobile_db',
    options: {
      dialect: 'mysql',
      pool: {
        max: 5,
        min: 0,
        idle: 10000,
      },
    },
  },
};
