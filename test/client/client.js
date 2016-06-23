
require('babel-polyfill');

const _ = require('lodash');
const SocketCluster = require('socketcluster-client');

const argv = require('minimist')(process.argv.slice(2));

const players = [
  'Jombocom', 'Carple', 'Danret', 'Swilia', 'Bripz', 'Goop',
  'Jeut', 'Axce', 'Groat', 'Jack', 'Xefe', 'Ooola', 'Getry',
  'Seripity', 'Tence', 'Rawgle', 'Plez', 'Zep', 'Shet', 'Jezza',
  'Lord Sirpy', 'Sir Pipe', 'Pleb', 'Rekter', 'Pilu', 'Sengai',
  'El Shibe', 'La Gpoy', 'Wizzrobu', 'Banana', 'Chelpe', 'Q',
  'Azerty'
];

const numPlayers = Math.max(1, Math.min(players.length, argv.players));

console.log(`Testing with ${numPlayers} players.`);

const socketOptions = {
  port: 8080,
  protocol: 'http',
  hostname: 'localhost',
  multiplex: false
};

const sockets = {};

const play = (name) => {
  sockets[name] = SocketCluster.connect(socketOptions);
  sockets[name].emit('plugin:player:login', { name });
  sockets[name].on('connect', e => console.log(`${name} connected.`));
  sockets[name].on('disconnect', e => console.log(`${name} disconnected.`));
};

_.each(players.slice(0, numPlayers), play);