
import fs from 'fs';

import _ from 'lodash';
import Primus from 'primus';
import Emit from 'primus-emit';
import Rooms from 'primus-rooms';
import Multiplex from 'primus-multiplex';

const ip = _(require('os').networkInterfaces())
  .values()
  .flatten()
  .filter(val => val.family === 'IPv4' && val.internal === false)
  .map('address')
  .first();

if(ip) {
  console.log(`Your IP is: ${ip}`);
}

const normalizedPath = require('path').join(__dirname, '..', 'src');

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

export const primus = Primus.createServer({ iknowhttpsisbetter: true, port: 8080, transformer: 'websockets' });

primus.use('rooms', Rooms);
primus.use('emit', Emit);
primus.use('multiplex', Multiplex);

primus.on('connection', spark => {
  const respond = (data) => {
    spark.write(data);
  };

  _.each(allSocketRequires, obj => obj.socket(spark, primus, (data) => {
    data.event = obj.event;
    respond(data);
  }));

  spark.join('adventurelog');
});

const path = require('path').join(__dirname, '..', '..', 'Play');
if(fs.statSync(path)) {
  primus.save(`${path}/primus.gen.js`);
}