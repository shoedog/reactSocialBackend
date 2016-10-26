'use strict';

const Controller = require('./socialController');

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
        auth: {strategies: ['jwt', 'twitter']},
        handler: controller.read
      }
    }
  ]);

};

exports.register.attributes = {
  name: 'socialRoutes',
  version: '1.0.0'
};
