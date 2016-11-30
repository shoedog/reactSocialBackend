'use strict';

const Controller = require('./socialController');
const Validator = require('./socialSchema');

exports.register = (server, options, next) => {

  // instantiate controller
  const controller = new Controller(options.database, options.socialKeys);

  server.bind(controller);
  server.route([
    {
      method: 'GET',
      path: '/social/connect',
      config: {
        auth: false,
        handler: controller.connect
      }
    },
    {
      method: 'GET',
      path: '/social/connect/twitter',
      config: {
        auth: 'twitter',
        handler: controller.connectTwitter
      }
    },
    {
      method: 'POST',
      path: '/social/remove/twitter',
      config: {
        auth: {strategies: ['jwt']},
        handler: controller.removeTwitter
      }
    },
    {
      method: 'GET',
      path: '/social/feed',
      config: {
        auth: false,
        handler: controller.list
      }
    },
    {
      method: 'GET',
      path: '/social/feed/{id}',
      config: {
        auth: {strategies: ['jwt']},
        handler: controller.read
      }
    },
    {
      method: 'POST',
      path: '/social/post',
      config: {
        auth: {strategies: ['jwt']},
        handler: controller.post,
        validate: Validator.post()
      }
    },
    {
      method: 'POST',
      path: '/social/favorite/{tweetId}',
      config: {
        auth: {strategies: ['jwt']},
        handler: controller.favorite
      }
    },
    {
      method: 'POST',
      path: '/social/unfavorite/{tweetId}',
      config: {
        auth: {strategies: ['jwt']},
        handler: controller.unfavorite
      }
    },
    {
      method: 'POST',
      path: '/social/retweet/{tweetId}',
      config: {
        auth: {strategies: ['jwt']},
        handler: controller.retweet
      }
    },
    {
      method: 'POST',
      path: '/social/unretweet/{tweetId}',
      config: {
        auth: {strategies: ['jwt']},
        handler: controller.unretweet
      }
    },
    {
      method: ['GET', 'POST'],
      path: '/social/stream/{keyword}',
      config: {
        auth: false,
        handler: controller.searchStream
      }
    },
  ]);

};

exports.register.attributes = {
  name: 'socialRoutes',
  version: '1.0.0'
};
