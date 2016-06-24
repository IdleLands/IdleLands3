import _ from 'lodash';
import path from 'path';

import { Logger } from '../src/shared/logger';

require('dotenv').config({ silent: true });

export const run = (worker) => {
  const scServer = worker.scServer;

  process.on('uncaughtException', (e) => Logger.error('Process:UncaughtException', e));
  process.on('unhandledRejection', (reason) => Logger.error('Process:UnhandledRejection', new Error(JSON.stringify(reason))));

  scServer.on('error', e => Logger.error('SC:Server', e));

  scServer.on('connection', socket => {

    const normalizedPath = path.join(__dirname, '..', 'src');

    const allSocketFunctions = require('require-dir')(normalizedPath, { recurse: true });

    const requireRecursive = (obj) => {
      _.each(obj, (val) => {
        if(!_.isObject(val)) return;
        if(!val.socket) return requireRecursive(val);
        val.socket(socket, worker);
      });
    };

    try {
      requireRecursive(allSocketFunctions);
    } catch(e) {
      Logger.error('SC:Socket:Function', e);
    }
  });
};