import _ from 'lodash';
import path from 'path';
import fs from 'fs';

import { Logger } from '../src/shared/logger';

require('dotenv').config({ silent: true });

const normalizedPath = path.join(__dirname, '..', 'src');

const getAllSocketFunctions = (dir) => {
  let results = [];

  const list = fs.readdirSync(dir);
  _.each(list, basefilename => {
    const filename = `${dir}/${basefilename}`;
    const stat = fs.statSync(filename);
    if(stat && stat.isDirectory()) results = results.concat(getAllSocketFunctions(filename));
    else if(_.includes(basefilename, '.socket')) results.push(filename);
  });

  return results;
};

const allSocketFunctions = getAllSocketFunctions(normalizedPath);
const allSocketRequires = _.map(allSocketFunctions, require);

export const run = (worker) => {
  const scServer = worker.scServer;

  process.on('uncaughtException', (e) => Logger.error('Process:UncaughtException', e));
  process.on('unhandledRejection', (reason) => Logger.error('Process:UnhandledRejection', new Error(JSON.stringify(reason))));

  scServer.on('error', e => Logger.error('SC:Server', e));

  worker.playerNameToSocket = {};

  scServer.on('connection', socket => {

    socket.on('masterMessage', data => console.log('MASTER', data));

    try {
      _.each(allSocketRequires, inst => inst.socket(socket, worker));
    } catch(e) {
      Logger.error('SC:Socket:Function', e);
    }
  });
};