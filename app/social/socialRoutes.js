'use strict';

const Controller = require('./socialController');

exports.register = (server, options, next) => {

  // instantiate controller
  const controller = new Controller();

  server.bind(controller);
  server.route([
    {
      method: 'GET',
      path: '/social',
      config: {
        auth: {
          stragegy: 'twitter'
        },
        handler: controller.list,
        validate: Validator.list()
      }
    },
    {
      method: 'POST',
      path: '/social/connect/twitter',
      config: {
        auth: 'false',
        handler: controller.read,
        validate: Validator.read()
      }
    }
  ]);
};
