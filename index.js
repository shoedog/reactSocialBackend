'use strict';

let server = require('./app/server');

// Launch site.
server.start((err) => {
  if (err) { throw err; }

  console.log('info', 'the magic happens at: ' + server.info.uri);
});
