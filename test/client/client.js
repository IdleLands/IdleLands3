
require('babel-polyfill');

const _ = require('lodash');
const Primus = require('primus');

const argv = require('minimist')(process.argv.slice(2));

const players = [
  'Jombocom', 'Carple', 'Danret', 'Swilia', 'Bripz', 'Goop',
  'Jeut', 'Axce', 'Groat', 'Jack', 'Xefe', 'Ooola', 'Getry',
  'Seripity', 'Tence', 'Rawgle', 'Plez', 'Zep', 'Shet', 'Jezza',
  'Lord Sirpy', 'Sir Pipe', 'Pleb', 'Rekter', 'Pilu', 'Sengai',
  'El Shibe', 'La Gpoy', 'Wizzrobu', 'Banana', 'Chelpe', 'Q',
  'Azerty'
];

const numPlayers = Math.max(1, Math.min(players.length, argv.players)) || 1;

console.log(`Testing with ${numPlayers} players.`);

const sockets = {};

const play = (name, index) => {
  const Socket = Primus.createSocket({
    transformer: 'websockets',
    parser: 'JSON',
    plugin: {
      rooms: require('primus-rooms'),
      emit: require('primus-emit'),
      multiplex: require('primus-multiplex')
    }
  });

  const socket = new Socket('ws://localhost:8080');

  const login = () => {
    socket.emit('plugin:player:login', { name, userId: `local|${name}` });
  };

  sockets[name] = socket;
  socket.on('open', () => {
    console.log(`${name} connected.`);
    login();
  });

  socket.on('close', () => {
    console.log(`${name} disconnected.`);
  });

  socket.on('data', msg => {

    if(!msg.type || !msg.text) return;
    if(msg.type === 'Global' && index !== 0) return;
    console.log(`[${msg.type}] ${msg.text}`);
  });
};

_.each(players.slice(0, numPlayers), play);