
if(process.env.NODE_ENV === 'production' && !process.env.IGNORE_NEWRELIC) {
  require('newrelic');
}

process.on('uncaughtException', e => console.error(e));
process.on('unhandledRejection', reason => console.error(reason));

require('dotenv').config({ silent: true });

require('babel-register');
require('babel-polyfill');

require('./primus/server');

require('./src/core/event-loop');