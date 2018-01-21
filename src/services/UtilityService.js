/**
 * Copyright (C) 2017 TopCoder Inc., All Rights Reserved.
 */

/**
 * the Utility Service
 *
 * @author      TCSCODER
 * @version     1.0
 */


const config = require('config');
const joi = require('joi');
const _ = require('lodash');
const nodemailer = require('nodemailer');
const logger = require('../common/logger');

const transporter = nodemailer.createTransport(_.extend(config.email, { logger }));

/**
 * send email to user
 * @param email the email entity ,  {to:,subject:,text:,html:}
 * @returns {Promise}
 */
function* sendEmail(emailEntity) {
  if (!emailEntity.from) {
    emailEntity.from = config.FROM_EMAIL;
  }
  return new Promise((resolve, reject) => {
    transporter.sendMail(emailEntity, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}
sendEmail.schema = {
  emailEntity: joi.object().keys({
    from: joi.string().email(),
    to: joi.string().email().required(),
    subject: joi.string().required(),
    text: joi.string().required(),
    html: joi.string(),
  }).required(),
};

module.exports = { sendEmail };
