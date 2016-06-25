
import { AdventureLog, MessageTypes } from '../shared/adventure-log';
import { GameState } from './game-state';
import { emitter as PlayerEmitter } from '../plugins/players/_emitter';

import { SocketProxy } from '../../socketcluster/proxy';

PlayerEmitter.on('player:login', async ({ playerName }) => {
  const player = await GameState.addPlayer(playerName);
  if(!player) return;
  player.$statistics.incrementStat('Game.Logins');
  AdventureLog(SocketProxy.getWorkerForPlayer(playerName), {
    text: `Welcome ${player.name} back to Idliathlia!`,
    type: MessageTypes.GLOBAL,
    highlights: [{ name: player.name }]
  });
});

PlayerEmitter.on('player:register', async ({ playerName }) => {
  const player = await GameState.addPlayer(playerName);
  if(!player) return;
  player.$statistics.incrementStat('Game.Logins');
  AdventureLog(SocketProxy.getWorkerForPlayer(playerName), {
    text: `Welcome ${player.name} to Idliathlia!`,
    type: MessageTypes.GLOBAL,
    highlights: [{ name: player.name }]
  });
});

PlayerEmitter.on('player:logout', ({ playerName }) => {
  AdventureLog(SocketProxy.getWorkerForPlayer(playerName), {
    text: `${playerName} has departed Idliathlia!`,
    type: MessageTypes.GLOBAL,
    highlights: [{ name: playerName }]
  });
  GameState.delPlayer(playerName);
});

PlayerEmitter.on('player:levelup', ({ worker, player }) => {
  AdventureLog(worker, {
    text: `${player.name} has reached experience level ${player.level}!`,
    type: MessageTypes.GLOBAL,
    highlights: [{ name: player.name }]
  });
});