
console.log('Starting IdleLands!');
require('dotenv').config({ silent: true });

if(process.env.NODE_ENV !== 'production') {

  var fs = require('fs');
  try {
    // production passes in environment variables instead
    fs.accessSync('./.env', fs.F_OK);
  } catch (e) {
    console.log('Can\'t find the .env file. Please place one in the current dir');
    process.exit();
  }
}

process.on('uncaughtException', e => console.error(e));
process.on('unhandledRejection', reason => console.error(reason));

var _ = require('lodash');
_.mixin({
  'isNotWritable': (obj, key) => {
    const descriptor = Object.getOwnPropertyDescriptor(obj, key);
    return (!descriptor || !descriptor.writable);
  }
}, { chain: false });

require('./primus/server');

require('./core/event-loop');