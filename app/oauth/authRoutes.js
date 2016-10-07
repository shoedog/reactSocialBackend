'use strict';

const Boom = require('boom');

exports.register = (server, options, next) => {

  server.route({
    method: 'GET',
    path: '/auth/twitter',
    config: {
      handler: (request, reply) => {

        if (!request.auth.isAuthenticated) {
          return reply(Boom.unauthorized('Authentication failed: ' + request.auth.error.message));
        }

        const profile = request.auth.credentials.profile;

        return reply(profile);
      }
    }
  });

  next();
}

exports.register.attributes = {
  name: 'authRoutes',
  version: '1.0.0'
};
