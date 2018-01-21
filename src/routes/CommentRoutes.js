/**
 * Copyright (C) 2017 TopCoder Inc., All Rights Reserved.
 */

/**
 * the Comment Routes
 *
 * @author      TCSCODER
 * @version     1.0
 */

module.exports = {
  '/comments': {
    post: {
      controller: 'CommentController',
      method: 'create',
    },
    get: {
      controller: 'CommentController',
      method: 'search',
    },
  },
  '/comments/:id': {
    get: {
      controller: 'CommentController',
      method: 'get',
    },
    put: {
      controller: 'CommentController',
      method: 'update',
    },
    delete: {
      controller: 'CommentController',
      method: 'remove',
    },
  },
  '/count/comments': {
    get: {
      controller: 'CommentController',
      method: 'countByFilter',
    },
  },
};
