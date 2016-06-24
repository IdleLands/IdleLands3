
import { AdventureLog, MessageTypes } from '../shared/adventure-log';
import { GameState } from './game-state';
import { emitter as PlayerEmitter } from '../plugins/players/_emitter';

PlayerEmitter.on('player:login', ({ worker, player }) => {
  GameState.addPlayer(player);
  player.$statistics.incrementStat('Logins');
  AdventureLog(worker, {
    text: `Welcome ${player.name} back to Idliathlia!`,
    type: MessageTypes.GLOBAL,
    highlights: [{ name: player.name }]
  });
});

PlayerEmitter.on('player:register', ({ worker, player }) => {
  GameState.addPlayer(player);
  AdventureLog(worker, {
    text: `Welcome ${player.name} to Idliathlia!`,
    type: MessageTypes.GLOBAL,
    highlights: [{ name: player.name }]
  });
});

PlayerEmitter.on('player:logout', ({ worker, playerName }) => {
  GameState.delPlayer(playerName);
  AdventureLog(worker, {
    text: `${playerName} has departed Idliathlia!`,
    type: MessageTypes.GLOBAL,
    highlights: [{ name: playerName }]
  });
});

PlayerEmitter.on('player:levelup', ({ worker, player }) => {
  AdventureLog(worker, {
    text: `${player.name} has reached experience level ${player.level}!`,
    type: MessageTypes.GLOBAL,
    highlights: [{ name: player.name }]
  });
});